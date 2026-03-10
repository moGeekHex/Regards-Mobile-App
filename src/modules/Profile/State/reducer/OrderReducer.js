import { ATTEMPTING_ORDERS , GET_ORDERS, ORDERS_FAILED } from '../actions/Types';

const INITIAL_STATE = { allOrder : [] , loadingData : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_ORDERS :
               return { ...state, loadingData : true, error : ''};

          case GET_ORDERS : 
               return { ...state, allOrder : action.payload , loadingData : false };            

          case ORDERS_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};