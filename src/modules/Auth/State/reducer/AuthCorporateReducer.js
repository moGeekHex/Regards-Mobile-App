import { ATTEMPTING_LOGIN_CORPORATE , SUCCESS_LOGIN_CORPORATE , FAILED_LOGIN_CORPORATE, CLEANUP_LOGIN_CORPORATE } from '../actions/Types';

const INITIAL_STATE = { loadingLoginCorporate : false , loginCorporate : false, errorLoginCorporate : '' };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_LOGIN_CORPORATE :
               return { ...state , loadingLoginCorporate : true,  errorLoginCorporate : '', loginCorporate : false};
          
          case SUCCESS_LOGIN_CORPORATE :
               return { ...state , loadingLoginCorporate : false,  errorLoginCorporate : '', loginCorporate : true};

          case FAILED_LOGIN_CORPORATE : 
               return { ...state ,  loadingLoginCorporate : false , errorLoginCorporate : true, loginCorporate: false};

          case CLEANUP_LOGIN_CORPORATE : 
               return { ...state ,  loadingLoginCorporate : false , errorLoginCorporate : false, loginCorporate: false};

          default :
               return state;    
     };
};