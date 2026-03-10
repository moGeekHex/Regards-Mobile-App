import { ATTEMPTING_GIFT_PRODUCT_SEARCH , GIFT_PRODUCT_SEARCH, GIFT_PRODUCT_SEARCH_FILTER, GIFT_PRODUCT_SEARCH_FAILED } from './Types';

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const getGiftProduct = (giftId, page = null) => {
     return async(dispatch) => {
         dispatch({type : ATTEMPTING_GIFT_PRODUCT_SEARCH, page : page});
          
         var config = {
             method: 'get',
             url: `${RoutesApi}/products/mobile/products-gift?giftId=${giftId}&page=${page}`,
         }
 
          axios(config)
          .then(resp => handleGetProduct(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GIFT_PRODUCT_SEARCH_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProduct = async ( dispatch , resp ) => {
     dispatch({ type : GIFT_PRODUCT_SEARCH , payload : resp.data });
};

export const getGiftProductByFilter = (searchText, minPriceFilter , maxPriceFilter, lang, sort ) => { 
     // let checkGiftName = lang === "english" ? 'giftFor.nameEn' : 'giftFor.nameAr';

     return async(dispatch) => {
                         
          dispatch({type : ATTEMPTING_GIFT_PRODUCT_SEARCH});
          
          var config = {
               method: 'get',
               url: `${RoutesApi}/products/mobile/search-products-gift?search=${searchText}`,
          }
 
          axios(config)
          .then(resp => handleGetProductByFilter(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GIFT_PRODUCT_SEARCH_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProductByFilter = async ( dispatch , resp ) => {
     dispatch({ type : GIFT_PRODUCT_SEARCH_FILTER , payload : resp.data });
};