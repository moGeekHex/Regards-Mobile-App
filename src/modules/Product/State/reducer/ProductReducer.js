import { ATTEMPTING_PRODUCT , PRODUCT_FOR_INIT, PRODUCT_FOR_FAILED } from '../actions/Types';

const INITIAL_STATE = { product : null, loadingData : true , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_PRODUCT :
               return { ...state, loadingData : false, error : '', product : null };

          case PRODUCT_FOR_INIT : 
               return { ...state, product : action.payload, loadingData : false };            

          case PRODUCT_FOR_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};