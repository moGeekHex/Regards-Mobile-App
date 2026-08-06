import SnapchatConfig from '../utils/snapchat/SnapchatConfig.json';

// CAPI v2 event names → v3 event_name
const V3_EVENT_NAMES = {
  APP_INSTALL: 'APP_INSTALL',
  OPEN_APP: 'APP_OPEN',
  APP_OPEN: 'APP_OPEN',
  SIGN_UP: 'SIGN_UP',
  LOGIN: 'LOGIN',
  ADD_TO_CART: 'ADD_CART',
  ADD_CART: 'ADD_CART',
  START_CHECKOUT: 'START_CHECKOUT',
  PURCHASE: 'PURCHASE',
};

const toNumberOrString = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return String(value);
};

/**
 * Snap CAPI v3.
 * - With pixelId only: WEB events via /v3/{pixelId}/events
 * - With snapAppId: MOBILE_APP events via /v3/{snapAppId}/events
 * v2 /v2/conversion with a `data` array wrapper is rejected by Snap.
 */
const snapchatEvent = async (eventType, payload = {}) => {
  const eventName = V3_EVENT_NAMES[eventType] || eventType;
  const accessToken = SnapchatConfig.accessToken;
  const pixelId = SnapchatConfig.pixelId;
  const snapAppId = SnapchatConfig.snapAppId;
  const useAppEndpoint = Boolean(snapAppId);

  if (!accessToken || (!pixelId && !snapAppId)) {
    console.log('Snapchat CAPI missing accessToken / pixelId / snapAppId');
    return;
  }

  const {
    price,
    currency,
    transactionId,
    numberOfItems,
    hashedEmail,
    hashedPhone,
    eventId,
    eventSourceUrl,
    ...rest
  } = payload;

  const actionSource = useAppEndpoint ? 'MOBILE_APP' : 'WEB';
  const endpointId = useAppEndpoint ? snapAppId : pixelId;
  const url = `https://tr.snapchat.com/v3/${endpointId}/events?access_token=${encodeURIComponent(accessToken)}`;

  const userData = {};
  if (hashedEmail) userData.em = [hashedEmail];
  if (hashedPhone) userData.ph = [hashedPhone];

  const customData = {};
  if (currency) customData.currency = currency;
  if (price !== undefined && price !== null) customData.value = toNumberOrString(price);
  if (transactionId) customData.order_id = String(transactionId);
  if (numberOfItems !== undefined && numberOfItems !== null) {
    customData.num_items = toNumberOrString(numberOfItems);
  }

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: actionSource,
    event_source_url:
      eventSourceUrl || SnapchatConfig.eventSourceUrl || 'https://regards.app',
    ...(eventId || transactionId
      ? { event_id: String(eventId || transactionId) }
      : {}),
    ...(Object.keys(userData).length ? { user_data: userData } : {}),
    ...(Object.keys(customData).length ? { custom_data: customData } : {}),
  };

  if (useAppEndpoint) {
    event.app_data = {
      advertiser_tracking_enabled: 1,
      app_id: SnapchatConfig.appId || 'com.regards',
      extinfo: [
        'i2',
        SnapchatConfig.appId || 'com.regards',
        '',
        '',
        '',
        '',
        'en_US',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    };
  }

  // Allow callers to pass extra top-level / nested fields if needed
  Object.assign(event, rest);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    });
    const result = await response.json();
    console.log(`Snapchat CAPI ${eventName} event sent`, result);
    return result;
  } catch (error) {
    console.log(`Snapchat CAPI ${eventName} error`, error);
  }
};

export const snapchatInstallEvent = (payload) =>
  snapchatEvent('APP_INSTALL', payload);

export const snapchatOpenAppEvent = (payload) =>
  snapchatEvent('APP_OPEN', payload);

export const snapchatSignUpEvent = (payload) =>
  snapchatEvent('SIGN_UP', payload);

export const snapchatLoginEvent = (payload) =>
  snapchatEvent('LOGIN', payload);

export const snapchatAddToCartEvent = ({
  price = 0,
  currency = 'SAR',
  numberOfItems = 1,
  ...rest
} = {}) =>
  snapchatEvent('ADD_CART', {
    price,
    currency,
    numberOfItems,
    ...rest,
  });

export const snapchatStartCheckoutEvent = ({
  price = 0,
  currency = 'SAR',
  numberOfItems = 1,
  ...rest
} = {}) =>
  snapchatEvent('START_CHECKOUT', {
    price,
    currency,
    numberOfItems,
    ...rest,
  });

export const snapchatPurchaseEvent = ({
  price = 0,
  currency = 'SAR',
  transactionId = '',
  numberOfItems = 1,
  ...rest
} = {}) =>
  snapchatEvent('PURCHASE', {
    price,
    currency,
    transactionId,
    numberOfItems,
    ...rest,
  });
