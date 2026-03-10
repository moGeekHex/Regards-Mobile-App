import { I18nManager} from "react-native"
import RNGoSell from '@tap-payments/gosell-sdk-react-native';
const {
     Languages,
     PaymentTypes,
     AllowedCadTypes,
     UiDisplayModes,
     TrxMode,
     SDKMode,
     SDKAppearanceMode
}= RNGoSell.goSellSDKModels;

export const appCredentials = {
     production_secrete_key: (Platform.OS == 'ios') ? 'sk_live_E2iLJ5QAzuIPN0bqgXWlty1o' : 'sk_live_E2iLJ5QAzuIPN0bqgXWlty1o',
     language: I18nManager === "english" ? Languages.EN : Languages.AR,
     sandbox_secrete_key: (Platform.OS == 'ios') ? 'sk_test_v5nDIWa936E1hNu0THjBYglA' : 'sk_test_v5nDIWa936E1hNu0THjBYglA',
     bundleID: (Platform.OS == 'ios') ? 'com.regards' : 'com.regards',
}  
// export appCredentials = appCredentials  

const paymentReference = {
     track: 'track',
     payment: 'payment',
     gateway: 'gateway',
     acquirer: 'acquirer',
     transaction: 'trans_9101011',
     order: 'order_262625',
     gosellID: null,
};
 
 export function craditConfigurations(amount,customer,orderId) {
     return  {
          appCredentials: appCredentials,
          sessionParameters: {
               paymentStatementDescriptor: 'paymentStatementDescriptor',
               transactionCurrency: 'sar',
               isUserAllowedToSaveCard: true,
               paymentType: PaymentTypes.ALL,
               amount: amount,
               allowedCadTypes:AllowedCadTypes.ALL,
               paymenMetaData: { },
               applePayMerchantID: 'merchant.regards',
               authorizeAction: { timeInHours: 10, time: 10, type: 'CAPTURE' },
               cardHolderName: '',
               editCardHolderName: true,
               postURL: 'https://api.regards.sa/orders/orderHooks',
               paymentDescription: '',
               destinations: 'null',
               trxMode: TrxMode.PURCHASE,
               merchantID: '',
               SDKMode: SDKMode.Production,
               customer: customer,
               isRequires3DSecure: true,
               receiptSettings: { id: null, email: false, sms: true },
               allowsToSaveSameCardMoreThanOnce: false,
               paymentReference: {
                    track: 'track',
                    payment: 'payment',
                    gateway: 'gateway',
                    acquirer: 'acquirer',
                    transaction: orderId.toString(),
                    order: orderId.toString(),
                    gosellID: null,
               },
               uiDisplayMode: UiDisplayModes.AllowedCadTypes,
               supportedPaymentMethods: ['STC_PAY','VISA','AMERICAN_EXPRESS','MASTERCARD','MADA','TABBY'],
               appearanceMode: SDKAppearanceMode.Windowed
          },
     };      
}

export function applePayConfigurations(amount,customer,orderId) {
     return  {
          appCredentials: appCredentials,
          sessionParameters: {
               paymentStatementDescriptor: 'paymentStatementDescriptor',
               transactionCurrency: 'sar',
               isUserAllowedToSaveCard: true,
               paymentType: PaymentTypes.ALL,
               amount: amount,
               allowedCadTypes:AllowedCadTypes.ALL,
               paymenMetaData: { },
               applePayMerchantID: 'merchant.regards',
               authorizeAction: { timeInHours: 10, time: 10, type: 'CAPTURE' },
               postURL: 'https://api.regards.sa/orders/orderHooks',
               paymentDescription: '',
               destinations: 'null',
               trxMode: TrxMode.PURCHASE,
               merchantID: '',
               SDKMode: SDKMode.Production,
               customer: customer,
               receiptSettings: { id: null, email: false, sms: true },
               allowsToSaveSameCardMoreThanOnce: false,
               paymentReference: {
                    track: 'track',
                    payment: 'payment',
                    gateway: 'gateway',
                    acquirer: 'acquirer',
                    transaction: orderId.toString(),
                    order: orderId.toString(),
                    gosellID: null,
               },
               uiDisplayMode: UiDisplayModes.AllowedCadTypes,
               supportedPaymentMethods: ['STC_PAY','VISA','AMERICAN_EXPRESS','MASTERCARD','MADA','APPLE_PAY'],
               appearanceMode: SDKAppearanceMode.Windowed
          },
     };      
}