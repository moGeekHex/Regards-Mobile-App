import { ATTEMPTING_PRODUCT_BY_SELLER, GET_PRODUCT_BY_SELLER, PRODUCT_BY_SELLER_FAILED } from './Types'

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const getProductsBySeller = (sellerID, page = null ) => {
     return async(dispatch) => {
          dispatch({ type : ATTEMPTING_PRODUCT_BY_SELLER, page : page });
          var config = {
               method: 'get',
               url: `${RoutesApi}/products/mobile/products-seller?sellerId=${sellerID}&page=${page}`,
          }
 
          axios(config)
          .then(resp => handleGetProductBySearch(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : PRODUCT_BY_SELLER_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProductBySearch = async ( dispatch , resp ) => {
     dispatch({ type : GET_PRODUCT_BY_SELLER , payload : resp.data });
};