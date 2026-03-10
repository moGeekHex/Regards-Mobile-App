import { ATTEMPTING_CATEGORIES , CATEGORIES_INIT , CATEGORIES_FAILED } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const initCategories = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_CATEGORIES});
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/categories?sort=ranking,ASC`,
         }
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : CATEGORIES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleInitSuccess = async ( dispatch , resp ) => {
     dispatch({ type : CATEGORIES_INIT , payload : resp.data });
};