import { ATTEMPTING_PRODUCT_BY_EVENTS, GET_PRODUCT_BY_EVENTS, PRODUCT_BY_EVENTS_FAILED } from '../action/Types'

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const getProductsByEvent = ( eventID, page ) => {
     return async(dispatch) => {
          dispatch({type : ATTEMPTING_PRODUCT_BY_EVENTS,  page : page });
               
          var config = {
               method: 'get',
               url: `${RoutesApi}/products/mobile/products-event?eventId=${eventID}&page=${page}`,
          }
 
          axios(config)
          .then(resp => handleGetProductBySearch(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : PRODUCT_BY_EVENTS_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProductBySearch = async ( dispatch , resp ) => {
     console.log(resp.data, " get data by event")
     dispatch({ type : GET_PRODUCT_BY_EVENTS , payload : resp.data });
};