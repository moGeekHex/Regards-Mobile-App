import { ATTEMPTING_PRODUCT_BY_CATEGORIES, GET_PRODUCT_BY_CATEGORIES, PRODUCT_BY_CATEGORIES_FAILED } from '../action/Types'

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const getProductsByCategories = (categoryId, page ) => {
     return async(dispatch) => {

          // console.log(minPriceFilter, ' = minPriceFilter')
          dispatch({type : ATTEMPTING_PRODUCT_BY_CATEGORIES, page : page});
               
          var config = {
               method: 'get',
               url: `${RoutesApi}/products/mobile/products-category?categoryId=${categoryId}&page=${page}`,
          }
 
          axios(config)
          .then(resp => handleGetProductBySearch(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : PRODUCT_BY_CATEGORIES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProductBySearch = async ( dispatch , resp ) => {
     dispatch({ type : GET_PRODUCT_BY_CATEGORIES , payload : resp.data });
};