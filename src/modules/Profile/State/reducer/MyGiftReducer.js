import { ATTEMPTING_MyGIFT , MyGIFT_ORDERS, MyGIFT_FAILED } from '../actions/Types';

const INITIAL_STATE = { allGifts : [] , loadingDataMyGift : false , errorMyGift : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_MyGIFT :
               return { ...state, loadingDataMyGift : true, errorMyGift : ''};

          case MyGIFT_ORDERS : 
               return { ...state, allGifts : action.payload , loadingDataMyGift : false };            

          case MyGIFT_FAILED : 
               return { ...state, errorMyGift : action.errorPayload , loadingDataMyGift : false };            

          default : 
               return state;    
     };
};