import { POPULAR_PRODUCT_FAILED , POPULAR_PRODUCT_INIT, ATTEMPTING_POPULAR_PRODUCT } from '../actions/Types';

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const initPopularProduct = () => {
     return async(dispatch) => {
          
          dispatch({type : ATTEMPTING_POPULAR_PRODUCT});

          var config = {
               method: 'get',
               url: `${RoutesApi}/products/mobile/popular?limit=12`
          }
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : POPULAR_PRODUCT_FAILED, errorPayload : err.response.data })
          });
     } 
}

const handleInitSuccess = async ( dispatch , resp ) => {
     // console.log(resp.data, " popular product")
     data =  resp.data.sort( () => Math.random() - 0.5);
     dispatch({ type : POPULAR_PRODUCT_INIT , payload : data });
};
