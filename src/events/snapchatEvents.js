import SnapchatConfig from '../utils/snapchat/SnapchatConfig.json';

const snapchatEvent = async (eventType, payload = {}) => {
    try {
        const response = await fetch("https://tr.snapchat.com/v2/conversion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SnapchatConfig.accessToken}`
            },
            body: JSON.stringify({
                data: [
                    {
                        event_type: eventType,
                        event_conversion_type: "MOBILE_APP",
                        timestamp: String(Date.now()),
                        pixel_id: SnapchatConfig.pixelId,
                        ...payload
                    }
                ]
            })
        });
        const result = await response.json();
        console.log(`Snapchat CAPI ${eventType} event sent`, result);
    } catch (error) {
        console.log(`Snapchat CAPI ${eventType} error`, error);
    }
}

export const snapchatInstallEvent = () => snapchatEvent("APP_INSTALL");

export const snapchatOpenAppEvent = () => snapchatEvent("OPEN_APP");

export const snapchatSignUpEvent = () => snapchatEvent("SIGN_UP");

export const snapchatLoginEvent = () => snapchatEvent("LOGIN");

export const snapchatAddToCartEvent = ({ price = 0, currency = "SAR", numberOfItems = 1 }) => 
    snapchatEvent("ADD_TO_CART", { price, currency, number_items: numberOfItems });

export const snapchatStartCheckoutEvent = ({ price = 0, currency = "SAR", numberOfItems = 1 }) => 
    snapchatEvent("START_CHECKOUT", { price, currency, number_items: numberOfItems });

export const snapchatPurchaseEvent = ({ price = 0, currency = "SAR", transactionId = "", numberOfItems = 1 }) => 
    snapchatEvent("PURCHASE", { price, currency, transaction_id: transactionId, number_items: numberOfItems });
