import { ATTEMPTING_PRODUCT_BY_SELLER, GET_PRODUCT_BY_SELLER, PRODUCT_BY_SELLER_FAILED } from '../action/Types'

const INITIAL_STATE = { productsBySeller : [], loadingData : true , isListEnd : false, moreLoading : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_PRODUCT_BY_SELLER :
               if(action.page === 1){
                    return { ...state, loadingData : true, error : '', productsBySeller : [], isListEnd : false };
               }else{
                    return { ...state, loadingData : false, error : '', moreLoading : true };
               }
          case GET_PRODUCT_BY_SELLER : 
               if(action.payload.length === 0){
                    return { ...state, productsBySeller : [...state.productsBySeller,...action.payload] , loadingData : false, moreLoading : false, isListEnd : true };                 
               }else{
                    return { ...state, productsBySeller : [...state.productsBySeller,...action.payload] , loadingData : false, moreLoading : false };                 
               }
          case PRODUCT_BY_SELLER_FAILED : 
               return { ...state, error : action.errorPayload, loadingData : false };            

          default : 
               return state;    
     };
};