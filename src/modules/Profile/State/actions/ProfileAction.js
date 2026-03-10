import { ATTEMPTING_GET_PROFILE , GET_PROFILE, CLEAR_PROFILE, UPDATE_PROFILE, DELETE_PROFILE, GET_PROFILE_FAILED } from './Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesApi from '../../../../constants/RoutesApi';
import { logoutAction } from '../../../../store/State/actions/AuthAction';
import { Platform } from 'react-native';
import axios from 'axios';

export const getProfile = () => {
     return async(dispatch) => {
         dispatch({type : ATTEMPTING_GET_PROFILE});
  
         const userData = await AsyncStorage.getItem('user')
         const user = JSON.parse(userData)

         const Auth = 'Bearer '.concat(user?.token);

         var config = {
               method: 'get',
               url: `${RoutesApi}/users/me`,
               headers: { 
                    'Authorization': Auth
               },
         }
 
         
          axios(config)
          .then(resp => handleGetProfile(dispatch , resp ))
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
               dispatch({ type : GET_PROFILE_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleGetProfile = async ( dispatch , resp ) => {
     dispatch({ type : GET_PROFILE , payload : resp.data.user });
};


export const clearProfile = () => {
     return async(dispatch) => {
         dispatch({type : CLEAR_PROFILE});
     }
}

export const addProfile = (firstName, lastName, phone, email) => {
     return async(dispatch) => {
          dispatch({type : ATTEMPTING_GET_PROFILE});
     
          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)

          const Auth = 'Bearer '.concat(user?.token);

          var config = {
               method: 'post',
               url: `${RoutesApi}/users/me/update`,
               headers: { 
                    'Authorization': Auth
               },
               data : {
                    firstName : firstName,
                    lastName : lastName,
                    email : email
               }
          }
 
          axios(config)
          .then(resp => handleAddProfile(dispatch , resp, Auth ))
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
               dispatch({ type : GET_PROFILE_FAILED, errorPayload : err.response.data })
          });
          
     }
}

const handleAddProfile = async ( dispatch, resp, Auth ) => {

     axios.get(`${RoutesApi}/users/me`,{
          headers : {
               Authorization : Auth
          }
     })
     .then(res => {
          try {
               const user = JSON.stringify(res.data);
               AsyncStorage.setItem('user',user);
          } catch (e) {
       
          }
     })

     dispatch({ type : UPDATE_PROFILE });
};


export const deleteProfileAction = () => {
     return async(dispatch) => {
         dispatch({type : ATTEMPTING_GET_PROFILE});
  
         const userData = await AsyncStorage.getItem('user')
         const user = JSON.parse(userData)

         const Auth = 'Bearer '.concat(user?.token);

         var config = {
               method: 'delete',
               url: `${RoutesApi}/users`,
               headers: { 
                    'Authorization': Auth
               },
         }
 
          axios(config)
          .then(resp => handleDeleteProfile(dispatch , resp ))
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
               dispatch({ type : GET_PROFILE_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleDeleteProfile = async ( dispatch , resp ) => {
     try {
          await AsyncStorage.removeItem('user');
     } catch (e) {
  
     }

     dispatch({ type : DELETE_PROFILE , payload : resp.data });
};