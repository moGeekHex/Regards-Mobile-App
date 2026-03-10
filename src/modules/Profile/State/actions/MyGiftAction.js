import { ATTEMPTING_MyGIFT , MyGIFT_ORDERS, MyGIFT_FAILED } from '../actions/Types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesApi from '../../../../constants/RoutesApi';
import { logoutAction } from '../../../../store/State/actions/AuthAction';
import axios from 'axios';

export const getGift = () => {
     return async(dispatch) => {
         dispatch({type : ATTEMPTING_MyGIFT});
  
         const userData = await AsyncStorage.getItem('user')
         const user = JSON.parse(userData)

         const Auth = 'Bearer '.concat(user?.token);

         var config = {
               method: 'get',
               url: `${RoutesApi}/orders/gift`,
               headers: { 
                    'Authorization': Auth
               },
         }
 
          axios(config)
          .then(resp => handleGetOrders(dispatch , resp ))
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
               dispatch({ type : MyGIFT_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetOrders = async ( dispatch , resp ) => {
    dispatch({ type : MyGIFT_ORDERS , payload : resp.data });
};


