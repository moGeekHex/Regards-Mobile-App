import { ATTEMPTING_GATEGORIES, GET_POPULAR_GATEGORIES, GET_ALL_GATEGORIES, ALL_GATEGORIES, GET_GATEGORIES_FAILED } from '../action/Types'

const INITIAL_STATE = { popularCategories : '', allCategories: '', categories : '' , loadingCategory : true , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_GATEGORIES :
               return { ...state, loadingCategory : true, error : '' };

          case GET_POPULAR_GATEGORIES : 
               return { ...state, popularCategories : action.payload , loadingCategory : false };     
               
          case GET_ALL_GATEGORIES : 
               return { ...state, allCategories : action.payload , loadingCategory : false };     
               
          case ALL_GATEGORIES : 
               return { ...state, categories : action.payload , loadingCategory : false };     

          case GET_GATEGORIES_FAILED : 
               return { ...state, error : action.errorPayload , loadingCategory : false };            

          default : 
               return state;    
     };
};