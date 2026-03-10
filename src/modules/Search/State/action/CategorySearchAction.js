import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import { ATTEMPTING_GATEGORIES, GET_POPULAR_GATEGORIES, GET_ALL_GATEGORIES, ALL_GATEGORIES, GET_GATEGORIES_FAILED } from './Types'

export const getPopularCategories = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_GATEGORIES});
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/categories?sort=purchasesCount,DESC&limit=4`,
         }
 
          axios(config)
          .then(resp => handlePopularCategories(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_GATEGORIES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handlePopularCategories = async ( dispatch , resp ) => {
     dispatch({ type : GET_POPULAR_GATEGORIES , payload : resp.data });
};

export const getAllCategories = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_GATEGORIES});
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/categories`,
         }
 
          axios(config)
          .then(resp => handleAllCategories(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_GATEGORIES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleAllCategories = async ( dispatch , resp ) => {
     dispatch({ type : GET_ALL_GATEGORIES , payload : resp.data });
};

export const getCategories = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_GATEGORIES});
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/categories`,
         }
 
          axios(config)
          .then(resp => handleCategories(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_GATEGORIES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleCategories = async ( dispatch , resp ) => {
     dispatch({ type : ALL_GATEGORIES , payload : resp.data });
};