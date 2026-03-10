import { ATTEMPTING_SEARCH , GET_SEARCH, GET_SEARCH_FAILED } from '../action/Types';

const INITIAL_STATE = {loadingData : false, searchProduct : [], isListEnd : false, moreLoading : false, error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          case ATTEMPTING_SEARCH :
               if(action.page === 1){
                    return { ...state, loadingData : true, error : '', isListEnd : false, searchProduct : [] };
               }else{
                    return { ...state, loadingData : false, error : '', moreLoading : true  };
               }

          case GET_SEARCH : 
               if(action.payload.length === 0){
                    console.log("check phase one ", action.payload)
                    return { ...state, searchProduct : [...state.searchProduct,...action.payload], loadingData : false, moreLoading : false, isListEnd : true };            
               }else{
                    console.log("check phase two ", action.payload)
                    return { ...state, searchProduct :  [...state.searchProduct,...action.payload], loadingData : false, moreLoading : false };            
               }

          case GET_SEARCH_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false };            

          default : 
               return state;    
     };
};