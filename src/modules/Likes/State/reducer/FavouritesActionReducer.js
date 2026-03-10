import { ATTEMPTING_FAVOURITES , GET_ALL_FAVOURITES, ADD_FAVOURITE, DELETE_FAVOURITE, FAVOURITES_FAILED } from '../action/Types';

const INITIAL_STATE = { favourites : null , loadingData : false, addItem : false, deleteItem : false, error : ''  };

export default(state = INITIAL_STATE , action) => {
     switch(action.type) {
          
          case ATTEMPTING_FAVOURITES :
               return { ...state, loadingData : true, error : '',  deleteItem : false, addItem : false };

          case GET_ALL_FAVOURITES : 
               return { ...state, favourites : action.payload, loadingData : false };            

          case ADD_FAVOURITE:
               return { ...state, addItem : true , loadingData : false, deleteItem : false }

          case DELETE_FAVOURITE:
               return { ...state, deleteItem : true , loadingData : false, addItem : false}

          case FAVOURITES_FAILED : 
               return { ...state, error : action.errorPayload , loadingData : false,  deleteItem : false, addItem : false  };            

          default :
               return state;    
     };
};