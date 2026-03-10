import { ATTEMPTING_GIFT_FOR , GIFT_FOR_INIT, GIFT_FOR_FAILED } from '../actions/Types';

const INITIAL_STATE = { gifts : '' , loadingData : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_GIFT_FOR :
               return { ...state, loadingData : true, error : '', gifts : '' };

          case GIFT_FOR_INIT : 
               return { ...state, gifts : action.payload , loadingData : false };            

          case GIFT_FOR_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};