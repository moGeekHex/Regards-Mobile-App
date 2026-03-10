import { POPULAR_PRODUCT_FAILED , POPULAR_PRODUCT_INIT, ATTEMPTING_POPULAR_PRODUCT } from '../actions/Types';

const INITIAL_STATE = { popularProduct : '' , loadingProduct : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_POPULAR_PRODUCT :
               return { ...state, loadingProduct : true, error : '' };

          case POPULAR_PRODUCT_INIT : 
               return { ...state, popularProduct : action.payload , loadingProduct : false };            

          case POPULAR_PRODUCT_FAILED : 
               return { ...state, error : action.errorPayload , loadingProduct : false };            

          default :
               return state;    
     };
};