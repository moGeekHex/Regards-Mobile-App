import { I18nManager, NativeModules } from 'react-native';

// .. 1- Create Signature
// .. 2- Create SDK token
// .. 3- Show payment module

interface Signature {
    access_code: string;
    device_id: string;
    language: string;
    merchant_identifier: string;
    service_command: keyof COMMANDS | string
}

interface Pay {
    amount: string;
    customer_email?: string;
    merchant_reference: string;
    merchant_extra: string;
    customer_name?: string;
    phone_number? : any;
    paymentData?: any;
    token_name?: string;
    language?: any
}

export interface PayfortResponse {
    acquirer_response_code: string;
    amount: string;
    authorization_code: string;
    card_number: string;
    command: string;
    currency: string;
    customer_email: string;
    customer_ip: string;
    eci: string;
    expiry_date: string;
    fort_id: string;
    language: string;
    merchant_extra: string;
    merchant_reference: string;
    payment_option: string;
    response_code: string;
    response_message: string;
    sdk_token: string;
    status: string;
    token_name?: string;
    customer_name?: any;
    phone_number?: any;
}

export enum COMMANDS {
    SDK_TOKEN = "SDK_TOKEN",
    PURCHASE = "PURCHASE"
}

class Payfort {

    containerData = {
        access_code : 'deygYv6PZRfO5ZcKmmqT',
        merchant_identifier : '89fef693',

        applePay_access_code: 'wcH998kRKJy7dPVZ6Dpv',
        applePay_merchant_identifier: '89fef693',

        language: I18nManager.isRTL ? "ar" : "en",
        device_id: "",
    }

    sdkToken = "";

    constructor() {
        NativeModules.Payfort.getDeviceId((device_id: string) => {
            this.containerData["device_id"] = device_id;
        });
    }

    createSignature = async (isApplePay?: boolean) => {

        const data = {
            access_code: isApplePay ? this.containerData?.applePay_access_code : this.containerData.access_code,
            device_id: this.containerData.device_id,
            language: this.containerData.language,
            merchant_identifier: isApplePay ? this.containerData?.applePay_merchant_identifier : this.containerData.merchant_identifier,
            service_command: COMMANDS.SDK_TOKEN
        }


        const signature = await this.generateSHA(data, isApplePay)

        return {
            ...data,
            signature
        }
    }

    createSDKToken = async (isApplePay?: boolean) => {

        return new Promise<{ sdk_token: string }>(async (resolve, reject) => {
            const body: Signature = await this.createSignature(isApplePay);

            fetch('https://sbpaymentservices.payfort.com/FortAPI/paymentApi', {
                method: "POST",
                body: JSON.stringify(body),
            })
                .then(response => response.json())
                .then(json => {
                    if (json.response_code === "22000") {
                        // .. success
                        const sdk_token = json.sdk_token;

                        this.sdkToken = sdk_token

                        resolve({ sdk_token })
                    } else {
                        reject(json);
                    }
                })
                .catch(reject);
        })
    }

    generateSHA = async (data: { [key: string]: any }, isApplePay?: boolean): Promise<string> => {
        const SHA = NativeModules.Sha;
    
        const request_phrase = isApplePay ? '28ZfYj.5SCm4.n8hHU01v1}+' : '83N8vy42d5jtrFNV.p9u0A]&';
        let stringToHash = request_phrase;
    
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'string') {
                stringToHash += `${key}=${data[key]}`;
            } else if (typeof data[key] === 'object') {
                stringToHash += `${key}={`;
                Object.keys(data[key]).forEach((internalKey, i) => {
                    stringToHash += `${internalKey}=${data[key][internalKey]}`;
                    if (i < Object.keys(data[key]).length - 1) {
                        stringToHash += `, `;
                    }
                });
                stringToHash += `}`;
            }
        });
        stringToHash += request_phrase;
    
        return SHA.sha256(stringToHash);
    }

    pay = ({
        amount,
        language,
        merchant_reference,
        merchant_extra,
        customer_email,
        customer_name,
        phone_number,
        token_name
    }: Pay) => {
        return new Promise<PayfortResponse>(async (resolve, reject) => {
            const isLive = false;

            const data = {
                command: COMMANDS.PURCHASE,
                currency : "SAR",
                language : I18nManager.isRTL ? "ar" : "en",
                amount ,
                merchant_reference ,
                customer_email ,
                // customer_name,
                // phone_number,
                // customer_ip,
                sdk_token: this.sdkToken
            }

            if (token_name) {
                data['token_name'] = token_name;
            }

            NativeModules.Payfort.Pay(JSON.stringify(data), resolve, reject)
        })
    }

    payWithApplePay = ({
        paymentData,
        amount,
        customer_email,
        merchant_reference,
        merchant_extra,
        arrItem,
        language
    }: Pay | any) => {

        return new Promise<PayfortResponse>(async (resolve, reject) => {
            const isLive = false;

            const data = {
                command: COMMANDS.PURCHASE,
                currency: "SAR",
                language: I18nManager.isRTL ? "ar" : "en",
                isLive,
                amount,
                merchant_reference,
                merchant_extra,
                customer_email,
                sdk_token: this.sdkToken,
                // .. more for apple
                apple_pay_merchant_identifier: 'merchant.regards',
                currencyType: "SAR",
                arrItem
            }

            // if (!isLive) {
            //     delete data['customer_ip'];
            //     delete data['device_fingerprint'];
            // }

            NativeModules.Payfort.PayWithApplePay(JSON.stringify(data), resolve, reject)

        })
    }


}

export default new Payfort();