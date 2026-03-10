import { ATTEMPTING_ADD_FAVOURITE, ADD_FAVOURITE_SUCCESS, ADD_FAVOURITE_FAILED } from '../actions/Types';

const INITIAL_STATE = { loading : false , error : '' , add : false };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_ADD_FAVOURITE :
               return { ...state , loading : true,  error : '', add : false };
          
          case ADD_FAVOURITE_FAILED : 
               return { ...state, loading : false, error : action.errorRes };             

          case ADD_FAVOURITE_SUCCESS : 
               return { ...state , loading : false , add : true };
               
          default :
               return state;    
     };
};