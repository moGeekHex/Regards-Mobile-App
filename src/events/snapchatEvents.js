import { Platform, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { getLocales, getTimeZone } from "react-native-localize";
import RoutesApi from "../constants/RoutesApi";

/**
 * Snapchat Conversions API.
 *
 * Events go to our own backend (POST /snapchat/events), never straight to
 * tr.snapchat.com. The CAPI access token is a server credential: shipping it
 * in the binary lets anyone extract it and inject conversions into the ad
 * account. The backend also fills client_ip_address / client_user_agent, which
 * Snap requires — events without user_data are rejected with error 505.
 */

const SNAPCHAT_ENDPOINT = `${RoutesApi}/snapchat/events`;
const INSTALL_FLAG_KEY = "@snapchat/install_reported";
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Feeds Snap's app_data.extinfo. Real values matter: extinfo index 4 is the OS
 * version and Snap discards app_data without it.
 */
const deviceContext = () => {
    const { width, height } = Dimensions.get("window");
    let locale = "en_US";
    let timezone = "Asia/Riyadh";

    try {
        locale = getLocales()?.[0]?.languageTag || locale;
        timezone = getTimeZone() || timezone;
    } catch (error) {
        // Fall back to the defaults above rather than dropping the event.
    }

    return {
        os: Platform.OS === "ios" ? "ios" : "android",
        // Platform.Version is the API level on Android (34), not the release
        // ("14"). Snap wants the release string.
        osVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
        deviceModel: DeviceInfo.getModel(),
        locale: locale.replace("-", "_"),
        timezone,
        screenWidth: Math.round(width),
        screenHeight: Math.round(height),
    };
};

const send = async (eventName, payload = {}) => {
    const body = {
        eventName,
        device: deviceContext(),
        ...payload,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(SNAPCHAT_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        if (!response.ok) {
            // Silent 400s are why the previous integration looked healthy while
            // Snap rejected every event.
            console.warn(
                `Snapchat ${eventName} rejected by backend: HTTP ${response.status}`
            );
            return false;
        }

        return true;
    } catch (error) {
        console.warn(`Snapchat ${eventName} request failed`, error?.message);
        return false;
    } finally {
        clearTimeout(timeout);
    }
};

/**
 * APP_INSTALL means first launch on this device, not every launch. Reporting it
 * on each cold start inflates the install count and poisons Snap's optimisation.
 *
 * Devices that already had the app before this build carry no flag, so they
 * would all report a fresh install on first upgrade. A stored user proves the
 * install predates this build: seed the flag and stay silent.
 */
export const snapchatInstallEvent = async (payload = {}) => {
    try {
        const alreadyReported = await AsyncStorage.getItem(INSTALL_FLAG_KEY);
        if (alreadyReported) return false;

        const existingUser = await AsyncStorage.getItem("user");
        if (existingUser) {
            await AsyncStorage.setItem(INSTALL_FLAG_KEY, "pre-existing");
            return false;
        }

        const delivered = await send("APP_INSTALL", payload);
        if (delivered) {
            await AsyncStorage.setItem(INSTALL_FLAG_KEY, String(Date.now()));
        }
        return delivered;
    } catch (error) {
        console.warn("Snapchat APP_INSTALL failed", error?.message);
        return false;
    }
};

export const snapchatOpenAppEvent = (payload = {}) => send("APP_OPEN", payload);

export const snapchatSignUpEvent = (payload = {}) => send("SIGN_UP", payload);

export const snapchatLoginEvent = (payload = {}) => send("LOGIN", payload);

export const snapchatViewContentEvent = ({
    itemId,
    price,
    currency = "SAR",
    ...rest
} = {}) =>
    send("VIEW_CONTENT", {
        itemId: itemId !== undefined && itemId !== null ? String(itemId) : undefined,
        currency,
        value: price,
        ...rest,
    });

/**
 * Kept for a future basket flow. The app goes straight from product to payment,
 * so firing ADD_CART alongside START_CHECKOUT would collapse the funnel into a
 * single instant and give Snap nothing to optimise against.
 */
export const snapchatAddToCartEvent = ({
    price,
    currency = "SAR",
    numberOfItems = 1,
    itemId,
    ...rest
} = {}) =>
    send("ADD_CART", {
        currency,
        value: price,
        numItems: numberOfItems,
        itemId: itemId !== undefined && itemId !== null ? String(itemId) : undefined,
        ...rest,
    });

export const snapchatStartCheckoutEvent = ({
    price,
    currency = "SAR",
    numberOfItems = 1,
    itemId,
    ...rest
} = {}) =>
    send("START_CHECKOUT", {
        currency,
        value: price,
        numItems: numberOfItems,
        itemId: itemId !== undefined && itemId !== null ? String(itemId) : undefined,
        ...rest,
    });

export const snapchatPurchaseEvent = ({
    price,
    currency = "SAR",
    transactionId,
    numberOfItems = 1,
    ...rest
} = {}) =>
    send("PURCHASE", {
        currency,
        value: price,
        // Doubles as Snap's event_id, so a retried callback is deduplicated.
        orderId:
            transactionId !== undefined && transactionId !== null
                ? String(transactionId)
                : undefined,
        numItems: numberOfItems,
        ...rest,
    });
