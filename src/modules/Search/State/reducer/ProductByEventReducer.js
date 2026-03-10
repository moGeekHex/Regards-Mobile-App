import { ATTEMPTING_PRODUCT_BY_EVENTS, GET_PRODUCT_BY_EVENTS, PRODUCT_BY_EVENTS_FAILED } from '../action/Types'

const INITIAL_STATE = { productsByEvent : [], loadingData : true, error : '', isListEnd : false, moreLoading : false };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_PRODUCT_BY_EVENTS :
               if(action.page === 1){
                    return { ...state, loadingData : true, error : '', productsByEvent : [], isListEnd : false};
               }else{
                    return { ...state, loadingData : false, error : '', moreLoading : true };
               }

          case GET_PRODUCT_BY_EVENTS : 
               if(action.payload.length === 0){
                    return { ...state, productsByEvent : [...state.productsByEvent,...action.payload] , loadingData : false, moreLoading : false, isListEnd : true  };                         
               }else{
                    return { ...state, productsByEvent : [...state.productsByEvent,...action.payload] , loadingData : false, moreLoading : false};                         
               }        

          case PRODUCT_BY_EVENTS_FAILED : 
               return { ...state, error : action.errorPayload, loadingData : false };            

          default : 
               return state;    
     };
};