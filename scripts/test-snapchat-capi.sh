#!/usr/bin/env bash
# Send Snapchat CAPI v3 test events using src/utils/snapchat/SnapchatConfig.json
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_FILE="${SNAPCHAT_CONFIG:-$ROOT_DIR/src/utils/snapchat/SnapchatConfig.json}"

if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "Missing config: $CONFIG_FILE" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required" >&2
  exit 1
fi

eval "$(python3 - "$CONFIG_FILE" <<'PY'
import json, sys, shlex
with open(sys.argv[1]) as f:
    c = json.load(f)
for key, env in [
    ("pixelId", "PIXEL_ID"),
    ("accessToken", "ACCESS_TOKEN"),
    ("snapAppId", "SNAP_APP_ID"),
    ("appId", "APP_ID"),
    ("eventSourceUrl", "EVENT_SOURCE_URL"),
]:
    val = c.get(key) or ""
    print(f"{env}={shlex.quote(str(val))}")
PY
)"

if [[ -z "${ACCESS_TOKEN}" ]]; then
  echo "accessToken missing in $CONFIG_FILE" >&2
  exit 1
fi

USE_APP=0
if [[ -n "${SNAP_APP_ID}" ]]; then
  USE_APP=1
  ENDPOINT_ID="$SNAP_APP_ID"
  ACTION_SOURCE="MOBILE_APP"
else
  ENDPOINT_ID="$PIXEL_ID"
  ACTION_SOURCE="WEB"
fi

if [[ -z "$ENDPOINT_ID" ]]; then
  echo "Need pixelId or snapAppId in $CONFIG_FILE" >&2
  exit 1
fi

EVENT_SOURCE_URL="${EVENT_SOURCE_URL:-https://regards.app}"
APP_ID="${APP_ID:-com.regards}"
TS_SEC="$(python3 -c 'import time; print(int(time.time()))')"
EMAIL_HASH="$(printf 'test@example.com' | shasum -a 256 | awk '{print $1}')"
ORDER_ID="curl-test-${TS_SEC}"

BASE_URL="https://tr.snapchat.com/v3/${ENDPOINT_ID}/events"
VALIDATE_URL="${BASE_URL}/validate?access_token=${ACCESS_TOKEN}"
SEND_URL="${BASE_URL}?access_token=${ACCESS_TOKEN}"

build_payload() {
  local event_name="$1"
  local with_purchase="${2:-0}"
  python3 - "$event_name" "$with_purchase" <<PY
import json, sys
event_name, with_purchase = sys.argv[1], sys.argv[2] == "1"
event = {
  "event_name": event_name,
  "event_time": int("${TS_SEC}"),
  "action_source": "${ACTION_SOURCE}",
  "event_source_url": "${EVENT_SOURCE_URL}",
  "event_id": f"{event_name.lower()}-${ORDER_ID}",
  "user_data": {"em": ["${EMAIL_HASH}"]},
}
if with_purchase:
  event["custom_data"] = {
    "currency": "SAR",
    "value": "99.00",
    "order_id": "${ORDER_ID}",
    "num_items": "1",
  }
if "${USE_APP}" == "1":
  event["app_data"] = {
    "advertiser_tracking_enabled": 1,
    "app_id": "${APP_ID}",
    "extinfo": ["a2", "${APP_ID}", "", "", "", "", "en_US", "", "", "", "", "", "", "", "", ""],
  }
print(json.dumps({"data": [event]}))
PY
}

post_json() {
  local label="$1"
  local url="$2"
  local body="$3"
  echo "=== ${label} ==="
  curl -sS -w "\nHTTP %{http_code}\n" -X POST "$url" \
    -H "Content-Type: application/json" \
    -d "$body"
  echo
}

echo "Using endpoint id: ${ENDPOINT_ID} (action_source=${ACTION_SOURCE})"
echo "Config: ${CONFIG_FILE}"
echo

OPEN_EVENT="PAGE_VIEW"
if [[ "$USE_APP" -eq 1 ]]; then
  OPEN_EVENT="APP_OPEN"
fi

post_json "VALIDATE PURCHASE" "$VALIDATE_URL" "$(build_payload PURCHASE 1)"
post_json "SEND ${OPEN_EVENT}" "$SEND_URL" "$(build_payload "$OPEN_EVENT" 0)"
post_json "SEND LOGIN" "$SEND_URL" "$(build_payload LOGIN 0)"
post_json "SEND ADD_CART" "$SEND_URL" "$(build_payload ADD_CART 1)"
post_json "SEND START_CHECKOUT" "$SEND_URL" "$(build_payload START_CHECKOUT 1)"
post_json "SEND PURCHASE" "$SEND_URL" "$(build_payload PURCHASE 1)"

echo "Done."
