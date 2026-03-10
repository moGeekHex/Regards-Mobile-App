import { ATTEMPTING_MYWALLET , MYWALLET_FAILED , GET_MYWALLET, CLEAR_MYWALLET } from '../actions/Types';

const INITIAL_STATE = { loadingMyWallet : false , errorMyWallet : '' , myWallet : [] };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_MYWALLET :
               return { ...state , loadingMyWallet : true, errorMyWallet : '' };
          
          case MYWALLET_FAILED : 
               return { ...state, loadingMyWallet : false, errorMyWallet : action.errorRes, myWallet: [] };             

          case GET_MYWALLET : 
               return { ...state , loadingMyWallet : false, errorMyWallet : '', myWallet : action.payload };

          case CLEAR_MYWALLET :
               return { ...state , loadingMyWallet : false, errorMyWallet : '', myWallet : [] };

          default :
               return state;    
     };
};