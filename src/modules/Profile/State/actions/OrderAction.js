import { ATTEMPTING_ORDERS , GET_ORDERS, ORDERS_FAILED } from './Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesApi from '../../../../constants/RoutesApi';
import { logoutAction } from '../../../../store/State/actions/AuthAction';
import axios from 'axios';

export const getOrder = () => {
     return async(dispatch) => {
         dispatch({type : ATTEMPTING_ORDERS});
  
         const userData = await AsyncStorage.getItem('user')
         const user = JSON.parse(userData)

         const Auth = 'Bearer '.concat(user?.token);

         var config = {
               method: 'get',
               url: `${RoutesApi}/orders?sort=id,DESC`,
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
               dispatch({ type : ORDERS_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetOrders = async ( dispatch , resp ) => {
     // console.log(resp.data, " orders")
     dispatch({ type : GET_ORDERS , payload : resp.data });
};


