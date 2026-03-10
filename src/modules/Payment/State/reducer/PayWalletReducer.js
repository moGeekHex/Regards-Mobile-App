import { ATTEMPTING_PAYWALLET , PAYWALLET_SUCCESS, PAYWALLET_FAILED, PAYWALLET_CLEANUP } from '../action/Types';

const INITIAL_STATE = { loadingPayWallet : false, payWallet : false, errorPayWallet : false };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          
          case ATTEMPTING_PAYWALLET :
               return { ...state, loadingPayWallet : true, errorPayWallet : false, payWallet : false };

          case PAYWALLET_SUCCESS : 
               return { ...state, payWallet : action.payload, loadingPayWallet : false };            

          case PAYWALLET_FAILED : 
               return { ...state, errorPayWallet : action.errorPayload, loadingPayWallet : false };   

          case PAYWALLET_CLEANUP :
               return { ...state, payWallet : false, errorPayWallet : false, loadingPayWallet : false};            

          default :
               return state;    
     };
};