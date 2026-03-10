import { ATTEMPTING_EVENTS, GET_POPULAR_EVENTS, GET_ALL_EVENTS, GET_EVENTS_FAILED } from '../action/Types'

const INITIAL_STATE = { popularEvents : '', allEvents: '' , loadingData : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_EVENTS :
               return { ...state, loadingData : true, error : '', popularEvents : '', allEvents : '' };

          case GET_POPULAR_EVENTS : 
               return { ...state, popularEvents : action.payload , loadingData : false };     
               
          case GET_ALL_EVENTS : 
               return { ...state, allEvents : action.payload , loadingData : false };            

          case GET_EVENTS_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};