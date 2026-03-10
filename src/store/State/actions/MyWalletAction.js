import { ATTEMPTING_MYWALLET , MYWALLET_FAILED , GET_MYWALLET , CLEAR_MYWALLET} from './Types';
import axios from 'axios';
import RoutesApi from '../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from './AuthAction';

export const getMyWallet = () => {
     return async(dispatch) => {
          dispatch({type : ATTEMPTING_MYWALLET});
          
          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)  
          const Auth = 'Bearer '.concat(user?.token);

          var config = {
          method: 'get',
          url: `${RoutesApi}/wallet/mywallet`,
               headers: { 
                    'Authorization': Auth
               }
          };

          axios(config)  
          .then(resp => handleGetMyWallet(dispatch , resp ))
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
               dispatch({ type : MYWALLET_FAILED, errorRes : err.response.data })
          });
     }
}

const handleGetMyWallet = async ( dispatch , resp ) => {
     dispatch({ type : GET_MYWALLET, payload : resp.data });
};

export const clearWallet = () => {
     return async(dispatch) => {
          dispatch({type : CLEAR_MYWALLET}); 
     }
}
