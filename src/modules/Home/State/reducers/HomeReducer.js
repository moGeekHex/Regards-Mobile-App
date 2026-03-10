import { SLIDER_FAILED , SLIDER_INIT, ATTEMPTING_LOGIN } from '../actions/Types';

const INITIAL_STATE = { sliderData : '' , loadingData : false , error : ''  };

export default(state = INITIAL_STATE , action) => {
    switch(action.type) {
        
        case ATTEMPTING_LOGIN :
            return { ...state, loadingData : true, error : '', sliderData : '' };

        case SLIDER_INIT : 
            return { ...state, sliderData : action.payload , loadingData : false };            

        case SLIDER_FAILED : 
            return { ...state, error : action.errorPayload , loadingData : false };            

        default :
            return state;    
    };
};