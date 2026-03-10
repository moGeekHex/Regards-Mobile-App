import { ATTEMPTING_SELLER, GET_POPULAR_SELLER , GET_ALL_SELLER, GET_SELLER_BY_HOME, GET_SELLER_FAILED } from '../action/Types'

const INITIAL_STATE = { popularSeller : '', allSeller: '' , homeSeller : '', loadingSeller : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_SELLER :
               return { ...state, loadingSeller : true, error : '' };

          case GET_POPULAR_SELLER : 
               return { ...state, popularSeller : action.payload , loadingSeller : false };     
               
          case GET_ALL_SELLER : 
               return { ...state, allSeller : action.payload , loadingSeller : false };
               
          case GET_SELLER_BY_HOME :
               return { ...state, homeSeller : action.payload , loadingSeller : false };

          case GET_SELLER_FAILED : 
               return { ...state, error : action.errorPayload , loadingSeller : false };            

          default : 
               return state;    
     };
};