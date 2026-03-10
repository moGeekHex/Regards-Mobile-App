import { ATTEMPTING_PAYMENTS , PAYMENTS_SUCCESS, PAYMENTS_ORDER, PAYMENTS_FAILED, PAYMENTS_CLEANUP } from '../action/Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from '../../../../store/State/actions/AuthAction';

export const addOrder = (payType, productId, quantity, giftHolderName = "", giftHolderPhone, giftSenderName = "", message = "", type, codeDiscound, walletPrivateToggle, walletCorporateToggle, address) => {
     return async(dispatch) => {
          dispatch({ type : ATTEMPTING_PAYMENTS });

          console.log({address, productId, quantity})

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          const Auth = 'Bearer '.concat(user?.token);
          
          var config = { 
               method: 'post',
               url: `${RoutesApi}/orders`,
               headers: { 
                    'Authorization': Auth
               },
               data : {  
                    payment_type : payType === "cradit" || payType === "apple" ? "TAP_PAY" : payType === "tamara" ? "TAMARA" : "" ,
                    productId : productId,
                    quantity : quantity,
                    receiverName : giftHolderName ? giftHolderName : " ",
                    receiverPhone : type == "SMS" ? giftHolderPhone : null,
                    nameOnGift : giftSenderName ? giftSenderName : " ",
                    message :  message ? message : " ",
                    type : type,
                    promoCode : codeDiscound ? codeDiscound : null,
                    walletAmount : walletPrivateToggle || walletCorporateToggle ? true : false,
                    walletType : walletPrivateToggle ? "PRIVATE" : walletCorporateToggle ? "CORPORATE" : null,
                    address : address
               }
          };
 
          axios(config)
          .then(resp => handleCreateOrder(dispatch , resp ))
          .catch(function (err) {
               axios.interceptors.response.use((response)=>{
                    return response
               }, (error) => {
                    if (error && error.response && error.response.status === 401) {
                         return Promise.reject(
                              dispatch(logoutAction())
                         );
                    }
               }) 
               dispatch({ type : PAYMENTS_FAILED, errorPayload : err.response })
          });
     }
}

const handleCreateOrder = async ( dispatch , resp ) => {
     dispatch({ type : PAYMENTS_ORDER , payload : resp.data });
};

export const checkOrder = (orderId, paymentToken, type) => {
     return async(dispatch) => {

          dispatch({ type : ATTEMPTING_PAYMENTS });
          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
          const Auth = 'Bearer '.concat(user?.token);
          
          var config = {
               method: 'post',
               url: `${RoutesApi}/orders/checkOrder`,
               headers: { 
                    'Authorization': Auth
               },
               data : {
                    id : orderId,
                    paymentToken : paymentToken,
                    type : type
               }
          };
 
          axios(config)
          .then(resp => handleChecksuccess(dispatch , resp ))
          .catch(function (err) {
               axios.interceptors.response.use((response)=>{
                    return response
               }, (error) => {
                    if (error && error.response && error.response.status === 401) {
                         return Promise.reject(
                              dispatch(logoutAction())
                         );
                    }
               }) 
               dispatch({ type : PAYMENTS_FAILED, errorPayload : err.response })
          });
     }
}

const handleChecksuccess = async ( dispatch , resp ) => {
     dispatch({ type : PAYMENTS_SUCCESS , payload : resp.data });
};


export const createOrderWithWallet = (productId, quantity, giftHolderName = "", giftHolderPhone, giftSenderName = "", message = "", type, walletType, codeDiscound) => {
     return async(dispatch) => {

          console.log(walletType)

          dispatch({ type : ATTEMPTING_PAYMENTS });
          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
          const Auth = 'Bearer '.concat(user?.token);
          
          var config = {
               method: 'post',
               url: `${RoutesApi}/orders/wallet`,
               headers: { 
                    'Authorization': Auth
               },
               data : {
                    productId : productId,
                    quantity : quantity,
                    receiverName : giftHolderName ? giftHolderName : " ",
                    receiverPhone : type == "SMS" ? giftHolderPhone : null,
                    nameOnGift : giftSenderName ? giftSenderName : " ",
                    message :  message ? message : " ",
                    type : type,
                    promoCode : codeDiscound ? codeDiscound : null,
                    walletType : walletType
               }
          };
 
          axios(config)
          .then(resp => handleCreateOrderWithWallet(dispatch , resp ))
          .catch(function (err) {
               axios.interceptors.response.use((response)=>{
                    return response
               }, (error) => {
                    if (error && error.response && error.response.status === 401) {
                         return Promise.reject(
                              dispatch(logoutAction())
                         );
                    }
               }) 
               dispatch({ type : PAYMENTS_FAILED, errorPayload : err.response })
          });
     }
}

const handleCreateOrderWithWallet = async ( dispatch , resp ) => {
     dispatch({ type : PAYMENTS_SUCCESS , payload : resp.data });
};

export const cleanUpPayment = () => {
     return async(dispatch) => {

          dispatch({ type : PAYMENTS_CLEANUP });
     }
}

