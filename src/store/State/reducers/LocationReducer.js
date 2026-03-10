import { ATTEMPTING_LOCATION , GET_LOCATION  } from '../actions/Types';

const INITIAL_STATE = { loading : false , error : '' , lat : null, long : null, country : null, city : null  , address : null };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_LOCATION :
               return { ...state , loading : true,  error : '', logout : false, status : false, otp : null, phone : '', resend : false };
          
          case GET_LOCATION : 
               return { ...state, loading : false, error : action.errorRes, lat : action.lat, long : action.long, country : action.country , city : action.city, address : action.address };             

          default :
               return state;    
     };
};