import { ATTEMPTING_PRODUCT_BY_CATEGORIES, GET_PRODUCT_BY_CATEGORIES, PRODUCT_BY_CATEGORIES_FAILED } from '../action/Types'

const INITIAL_STATE = { productsByCategory : [], loadingProductByCategory : true, isListEnd : false, moreLoading : false, error : '' };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_PRODUCT_BY_CATEGORIES :
               if(action.page === 1){
                    return { ...state, loadingProductByCategory : true, error : '', productsByCategory : [], isListEnd : false };
               }else{
                    return { ...state, loadingProductByCategory : false, error : '', moreLoading : true };
               }
          case GET_PRODUCT_BY_CATEGORIES : 
               if(action.payload.length === 0){
                    return { ...state, productsByCategory : [...state.productsByCategory,...action.payload] , loadingProductByCategory : false, moreLoading : false, isListEnd : true };                         
               }else{
                    return { ...state, productsByCategory : [...state.productsByCategory,...action.payload] , loadingProductByCategory : false, moreLoading : false };                         
               }
          case PRODUCT_BY_CATEGORIES_FAILED : 
               return { ...state, error : action.errorPayload, loadingProductByCategory : false };            

          default : 
               return state;    
     };
};