import { ATTEMPTING_PAYWALLET , PAYWALLET_SUCCESS, PAYWALLET_FAILED, PAYWALLET_CLEANUP } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from '../../../../store/State/actions/AuthAction';

export const createOrderWallet = (productId, quantity, giftHolderName = "", giftHolderPhone, giftSenderName = "", message = "", type, code, walletType) => {
     return async(dispatch) => {

          dispatch({ type : ATTEMPTING_PAYWALLET });

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          console.log(user.user.role)

          const Auth = 'Bearer '.concat(user?.token);
          
          var config = { 
               method: 'post',
               url: `${RoutesApi}/otp/validate/order`,
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
                    code : `${code}`,
                    walletType : user.user.role === "company" ? "CORPORATE" : walletType
               }
          };
 
          axios(config)
          .then(resp => handleCreateOrderWallet(dispatch , resp ))
          .catch(function (err) {
               // axios.interceptors.response.use((response)=>{
               //      return response
               // }, (error) => {
               //      if (error && error.response && error.response.status === 401) {
               //           return Promise.reject(
               //                dispatch(logoutAction())
               //           );
               //      }
               // }) 
               console.log("err ", err)
               dispatch({ type : PAYWALLET_FAILED, errorPayload : err.response })
          });
     }
}

const handleCreateOrderWallet = async ( dispatch , resp ) => {
     console.log("resp.data ", resp.data)
     dispatch({ type : PAYWALLET_SUCCESS , payload : resp.data });
};

export const cleanUpPayWallet = () => {
     return async(dispatch) => {

          dispatch({ type : PAYWALLET_CLEANUP });
     }
}