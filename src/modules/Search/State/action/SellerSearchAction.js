import { ATTEMPTING_SELLER, GET_POPULAR_SELLER , GET_ALL_SELLER, GET_SELLER_BY_HOME, GET_SELLER_FAILED } from './Types'
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const getPopularSeller = (limit) => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_SELLER });
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/users/sellers?sort=S_soldOrders,DESC&limit=${limit}&filter=S_isBlocked||$eq||false`,
         }
 
          axios(config)
          .then(resp => handlePopularSeller(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_SELLER_FAILED, errorPayload : err.response.data })
          });
     }
}

const handlePopularSeller = async ( dispatch , resp ) => {
     dispatch({ type : GET_POPULAR_SELLER , payload : resp.data });
};

export const getPopularSellerByHome = (limit) => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_SELLER });
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/users/sellers?sort=S_soldOrders,DESC&limit=${limit}&filter=S_isBlocked||$eq||false`,
         }
 
          axios(config)
          .then(resp => handlePopularSellerByHome(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_SELLER_FAILED, errorPayload : err.response.data })
          });
     }
}

const handlePopularSellerByHome = async ( dispatch , resp ) => {
     dispatch({ type : GET_SELLER_BY_HOME , payload : resp.data });
};

//https://api.regards.sa​/users/sellers?sort=S_soldOrders,DESC&limit=6

export const getAllSeller = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_SELLER });
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/users/sellers?filter=S_isBlocked||$eq||false`,
         }
 
          axios(config)
          .then(resp => handleAllSeller(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_SELLER_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleAllSeller = async ( dispatch , resp ) => {
     console.log("all seller ", resp.dats) 
     dispatch({ type : GET_ALL_SELLER , payload : resp.data });
};
