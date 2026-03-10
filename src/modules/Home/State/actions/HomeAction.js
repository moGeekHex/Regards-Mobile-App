import { ATTEMPTING_SLIDER , SLIDER_INIT , SLIDER_FAILED } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const initSlider = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_SLIDER});
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/offers?sort=ranking,ASC`,
         }
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : SLIDER_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleInitSuccess = async ( dispatch , resp ) => {
     console.log(resp.data, " resp.data")
     dispatch({ type : SLIDER_INIT , payload : resp.data });
};