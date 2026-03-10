import { ATTEMPTING_PROMO, PROMO_SUCCESS, PROMO_FAILED, PROMO_RELOAD } from '../action/Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from '../../../../store/State/actions/AuthAction';

export const handleCheckPromo = (codeDiscound) => {

     return async(dispatch) => {
          dispatch({ type : ATTEMPTING_PROMO });

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          const Auth = 'Bearer '.concat(user?.token);

          var config = { 
               method: 'post',
               url: `${RoutesApi}/promo/check`,
               headers: { 
                    'Authorization': Auth
               },
               data : {
                    code : codeDiscound,
               }
          };
 
          axios(config)
          .then(resp => handleCheckReq(dispatch , resp ))
          .catch(function (err) {
               if (err.response.status === 401) {
                    return Promise.reject(
                         dispatch(logoutAction())
                    );
               }else{
                    dispatch({ type : PROMO_FAILED, payload : err.response?.data })
               }
          });
     }
}

const handleCheckReq = async ( dispatch , resp ) => {
     dispatch({ type : PROMO_SUCCESS, payload : resp.data });
};


export const handleCheckPromoReload = () => {
     return async(dispatch) => {
          dispatch({ type : PROMO_RELOAD });
     }
}
