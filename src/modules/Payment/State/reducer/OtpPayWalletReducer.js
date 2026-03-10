import { OTP_PAYWALLET_CLEANUP, ATTEMPTING_OTP_PAYWALLET, OTP_PAYWALLET_FAILED, OTP_PAYWALLET_SUCCESS } from '../action/Types';

const INITIAL_STATE = { loadingOtpPayWallet : false, otpPayWallet : false, errorOtpPayWallet : "" };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          
          case ATTEMPTING_OTP_PAYWALLET :
               return { ...state, loadingOtpPayWallet : true, errorOtpPayWallet : '', otpPayWallet : false };

          case OTP_PAYWALLET_SUCCESS : 
               return { ...state, otpPayWallet : true, loadingOtpPayWallet : false };            

          case OTP_PAYWALLET_FAILED : 
               return { ...state, errorOtpPayWallet : action.errorPayload, loadingOtpPayWallet : false };   

          case OTP_PAYWALLET_CLEANUP :
               return { ...state, otpPayWallet : false, errorOtpPayWallet : "", loadingOtpPayWallet : false};            

          default :
               return state;    
     };
};