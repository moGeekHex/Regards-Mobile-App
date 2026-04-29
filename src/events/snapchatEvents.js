import SnapchatConfig from '../utils/snapchat/SnapchatConfig.json';

export const snapchatPurchaseEvent = async ({
    price = 0,
    currency = "SAR",
    transactionId = "",
    numberOfItems = 1
}) => {
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
                        event_type: "PURCHASE",
                        event_conversion_type: "MOBILE_APP",
                        timestamp: String(Date.now()),
                        pixel_id: SnapchatConfig.pixelId,
                        price: price,
                        currency: currency,
                        transaction_id: transactionId,
                        number_items: numberOfItems
                    }
                ]
            })
        });
        const result = await response.json();
        console.log("Snapchat CAPI purchase event sent", result);
    } catch (error) {
        console.log("Snapchat CAPI error", error);
    }
}
