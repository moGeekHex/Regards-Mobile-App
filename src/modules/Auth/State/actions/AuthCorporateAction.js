import { ATTEMPTING_LOGIN_CORPORATE,  SUCCESS_LOGIN_CORPORATE, FAILED_LOGIN_CORPORATE, CLEANUP_LOGIN_CORPORATE } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginCorporate = ( email, password ) => {
     return (dispatch) => {
          dispatch({type : ATTEMPTING_LOGIN_CORPORATE});
     
          axios.post(`${RoutesApi}/auth/login`, {
               username : email,
               password
          })
          .then(resp => handleLoginCorporate(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : FAILED_LOGIN_CORPORATE, errorRes : err.response.data })
          });
     }
 }
 
 const handleLoginCorporate = async ( dispatch , resp ) => {
     const userData = resp.data;
     const user = JSON.stringify(userData);
 
     try {
         await AsyncStorage.setItem('user',user);
     } catch (e) {
 
     }
     dispatch({ type : SUCCESS_LOGIN_CORPORATE, payload : userData });
 };



export const cleanUpLoginCorporate = () => { 
    return async (dispatch) => {
        dispatch({type : CLEANUP_LOGIN_CORPORATE});
    };
}