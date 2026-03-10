import { ATTEMPTING_CATEGORIES , CATEGORIES_INIT , CATEGORIES_FAILED } from '../actions/Types';

const INITIAL_STATE = { categories : '' , loadingCategory : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
    switch(action.type) {
        
        case ATTEMPTING_CATEGORIES :
            return { ...state, loadingCategory : true, error : '', categories : '' };

        case CATEGORIES_INIT : 
            return { ...state, categories : action.payload , loadingCategory : false };            

        case CATEGORIES_FAILED : 
            return { ...state, error : action.errorPayload , loadingCategory : false };            

        default :
            return state;    
    };
};