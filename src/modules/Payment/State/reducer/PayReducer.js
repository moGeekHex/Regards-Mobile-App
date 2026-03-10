import { ATTEMPTING_PAYMENTS , PAYMENTS_SUCCESS, PAYMENTS_ORDER, PAYMENTS_FAILED, PAYMENTS_CLEANUP, PAYMENTS_CANCLED } from '../action/Types';

const INITIAL_STATE = { loadingData : false, payment : false, order: null, error : "", };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          
          case ATTEMPTING_PAYMENTS :
               return { ...state, loadingData : true, error : '', payment : false };

          case PAYMENTS_ORDER : 
               return { ...state, order : action.payload };            

          case PAYMENTS_SUCCESS : 
               return { ...state, payment : action.payload, loadingData : false };            

          case PAYMENTS_FAILED : 
               return { ...state, error : action.errorPayload, loadingData : false };   
          
          case PAYMENTS_CANCLED : 
               return { ...state, loadingData : false };   

          case PAYMENTS_CLEANUP :
               return { ...state, payment : false, order : null, error : "", loadingData : false};            

          default :
               return state;    
     };
};