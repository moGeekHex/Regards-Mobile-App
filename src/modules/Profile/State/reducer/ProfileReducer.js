import { ATTEMPTING_GET_PROFILE, GET_PROFILE, CLEAR_PROFILE, UPDATE_PROFILE, DELETE_PROFILE, GET_PROFILE_FAILED } from '../actions/Types';

const INITIAL_STATE = { profile : null, update : false, deleteProfile : false, loadingData : false, error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_GET_PROFILE :
               return { ...state, loadingData : true, error : '', update : false, deleteProfile : false };

          case GET_PROFILE : 
               return { ...state, profile : action.payload , loadingData : false };  
               
          case CLEAR_PROFILE : 
               return { ...state, profile : null , loadingData : false };  
               
          case UPDATE_PROFILE :
               return { ...state, update : true, loadingData : false }

          case DELETE_PROFILE :
               return { ...state, deleteProfile : true, loadingData : false, profile : null }

          case GET_PROFILE_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};