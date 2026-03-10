import { OTP_PAYWALLET_CLEANUP, ATTEMPTING_OTP_PAYWALLET, OTP_PAYWALLET_FAILED, OTP_PAYWALLET_SUCCESS } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from '../../../../store/State/actions/AuthAction';

export const createOtpOrderWallet = (phone) => {
     return async(dispatch) => {

          dispatch({ type : ATTEMPTING_OTP_PAYWALLET });

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          const Auth = 'Bearer '.concat(user?.token);
          
          var config = { 
               method: 'post',
               url: `${RoutesApi}/otp/order`,
               headers: { 
                    'Authorization': Auth
               },
               data : {  
                    phone : `${user?.user?.S_contactPhone}`,
               }
          };
 
          axios(config)
          .then(resp => handleOtpOrderWallet(dispatch , resp ))
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
               dispatch({ type : OTP_PAYWALLET_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleOtpOrderWallet = async ( dispatch , resp ) => {
     // console.log(resp.data , " otp response")
     dispatch({ type : OTP_PAYWALLET_SUCCESS , payload : resp.data });
};

export const cleanUpOtpPayWallet = () => {
     return async(dispatch) => {
          dispatch({ type : OTP_PAYWALLET_CLEANUP });
     }
}