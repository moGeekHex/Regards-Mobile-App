import { ATTEMPTING_GIFT_FOR , GIFT_FOR_INIT, GIFT_FOR_FAILED } from './Types';

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';


export const initGift = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_GIFT_FOR});
          
         var config = {
             method: 'get',
             url: `${RoutesApi}/gift-for?sort=ranking,ASC`,
         }
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GIFT_FOR_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleInitSuccess = async ( dispatch , resp ) => {
     dispatch({ type : GIFT_FOR_INIT , payload : resp.data });
};

/*
     filter Product by gift id
*/

export const getGiftProduct = (id) => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_GIFT_FOR});

          
         var config = {
             method: 'get',
             url: `${RoutesApi}/products?filter=giftForId||$eq||${$id}`,
         }
 
          axios(config)
          .then(resp => handleProductSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GIFT_FOR_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleProductSuccess = async ( dispatch , resp ) => {
     dispatch({ type : GIFT_FOR_INIT , payload : resp.data });
};