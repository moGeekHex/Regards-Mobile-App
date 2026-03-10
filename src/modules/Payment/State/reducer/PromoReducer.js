import { ATTEMPTING_PROMO , PROMO_SUCCESS, PROMO_FAILED, PROMO_RELOAD } from '../action/Types';

const INITIAL_STATE = { loadingPromo : false, success : null, faild: false };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          
          case ATTEMPTING_PROMO :
               return { ...state, loadingPromo : true, success : null, faild : false };       

          case PROMO_SUCCESS : 
               return { ...state, success : action.payload, loadingPromo : false, faild : false };            

          case PROMO_FAILED : 
               return { ...state, faild :  action.payload, loadingPromo : false, success : null };       

          case PROMO_RELOAD : 
               return { ...state, faild : false, loadingPromo : false, success : null };  

          default :
               return state;    
     };
};