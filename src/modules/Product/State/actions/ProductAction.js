import { ATTEMPTING_PRODUCT , PRODUCT_FOR_INIT, PRODUCT_FOR_FAILED } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const getProductById = (id) => {
     return async(dispatch) => { 
         dispatch({type : ATTEMPTING_PRODUCT});
         var config = {
             method: 'get',
             url: `${RoutesApi}/products/${id}`,
         }
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : PRODUCT_FOR_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleInitSuccess = async ( dispatch , resp ) => {
     dispatch({ type : PRODUCT_FOR_INIT , payload : resp.data });
};