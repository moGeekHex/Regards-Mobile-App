import { ATTEMPTING_OTP , OTP_FAILED , SEND_OTP_SUCCESS, RESEND_OTP_SUCCESS, CHECK_OTP_SUCCESS , LOGOUT } from '../actions/Types';

const INITIAL_STATE = { loading : false , error : '' , status : false, resend : false, logout : false, otp : null, phone : '' };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_OTP :
               return { ...state , loading : true,  error : '', logout : false, status : false, otp : null, phone : '', resend : false };
          
          case OTP_FAILED : 
               return { ...state, loading : false, error : action.errorRes, status : false, otp : null, logout : null };             

          case SEND_OTP_SUCCESS : 
               return { ...state , loading : false , status : true, error : '', otp : null, logout : null, phone : action.payload, resend : null };

          case RESEND_OTP_SUCCESS : 
               return { ...state , loading : false , status : true, resend : true, error : '', otp : null, logout : null, phone : action.payload };

          case CHECK_OTP_SUCCESS : 
               return { ...state , loading : false , otp : action.payload, error : '', logout : null, status : false, resend : null }

          case LOGOUT : 
               return { ...state ,  loading : false , logout : true, otp: false, status : false};

          default :
               return state;    
     };
};