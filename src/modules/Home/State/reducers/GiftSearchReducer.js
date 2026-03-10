import { ATTEMPTING_GIFT_PRODUCT_SEARCH , GIFT_PRODUCT_SEARCH, GIFT_PRODUCT_SEARCH_FILTER , GIFT_PRODUCT_SEARCH_FAILED } from '../actions/Types';

const INITIAL_STATE = { giftProducts : [], giftProductsByFilter : [] , loadingData : true , isListEnd : false, moreLoading : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_GIFT_PRODUCT_SEARCH :
               if(action.page === 1){
                    return { ...state, loadingData : true, error : '' , giftProducts : [], giftProductsByFilter : [], isListEnd : false };
               }else{
                    return { ...state, loadingData : false, error : '', moreLoading : true  };
               }

          case GIFT_PRODUCT_SEARCH : 
               if(action.payload.length === 0){
                    return { ...state, giftProducts : [...state.giftProducts,...action.payload] , giftProductsByFilter : [], loadingData : false, moreLoading : false, isListEnd : true };            
               }else{
                    return { ...state, giftProducts : [...state.giftProducts,...action.payload] , giftProductsByFilter : [], loadingData : false, moreLoading : false };            
               }

          case GIFT_PRODUCT_SEARCH_FILTER :
               return { ...state, giftProductsByFilter : action.payload, giftProducts : '' , loadingData : false };            

          case GIFT_PRODUCT_SEARCH_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false, moreLoading : false };            

          default : 
               return state;    
     };
};