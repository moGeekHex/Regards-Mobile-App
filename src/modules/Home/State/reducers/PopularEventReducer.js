import { POPULAR_EVENT_HOME_FAILED , POPULAR_EVENT_HOME_INIT, ATTEMPTING_EVENTS_HOME, GET_ALL_HOME_EVENTS, GET_EVENTS_HOME_FAILED } from '../actions/Types';

const INITIAL_STATE = { popularEvent : '' , allEvents : '', loadingData : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_EVENTS_HOME :
               return { ...state, loadingData : true, error : '' };
          case POPULAR_EVENT_HOME_INIT : 
               return { ...state, popularEvent : action.payload , loadingData : false };            

          case POPULAR_EVENT_HOME_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            
   
          case GET_ALL_HOME_EVENTS : 
               return { ...state, allEvents : action.payload , loadingData : false };            

          case GET_EVENTS_HOME_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};


