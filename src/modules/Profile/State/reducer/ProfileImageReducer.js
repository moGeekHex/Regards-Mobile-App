import { ATTEMPTING_IMAGE_PROFILE , IMAGE_PROFILE_SUCCESS, IMAGE_PROFILE_FAILED } from '../actions/Types';

const INITIAL_STATE = { imageUpdate : false , loadingData : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_IMAGE_PROFILE :
               return { ...state, loadingData : true, error : '', imageUpdate : false};

          case IMAGE_PROFILE_SUCCESS : 
               return { ...state, imageUpdate : true , loadingData : false };            

          case IMAGE_PROFILE_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};