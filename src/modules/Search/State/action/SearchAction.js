import { ATTEMPTING_SEARCH , GET_SEARCH, GET_SEARCH_FAILED } from '../action/Types';

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';


export const getProductBySearch = (searchText, page, minPriceFilter , maxPriceFilter, sort) => {
     return async(dispatch) => {
          
         dispatch({type : ATTEMPTING_SEARCH,  page : page});
          
         var config = {
             method: 'get',
             url: `https://services.regards.sa/product/search?q=${searchText}&page=${page}`,
         }
 
          axios(config)
          .then(resp => handleGetProductBySearch(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_SEARCH_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProductBySearch = async ( dispatch , resp ) => {
     dispatch({ type : GET_SEARCH , payload : resp.data.data });
};