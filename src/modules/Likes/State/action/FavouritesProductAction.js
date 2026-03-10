import { ATTEMPTING_FAVOURITES, GET_ALL_FAVOURITES, ADD_FAVOURITE, DELETE_FAVOURITE, FAVOURITES_FAILED } from './Types';
import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from '../../../../store/State/actions/AuthAction';

export const getFavourites = () => {
     
     return async(dispatch) => {

          dispatch({ type : ATTEMPTING_FAVOURITES });

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          const Auth = 'Bearer '.concat(user?.token);
          
         var config = {
               method: 'get',
               url: `${RoutesApi}/users/favourites`,
               headers: { 
               'Authorization': Auth
               }
          };
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
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
               dispatch({ type : FAVOURITES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleInitSuccess = async ( dispatch , resp ) => {
     await dispatch({ type : GET_ALL_FAVOURITES , payload : resp.data });
};


export const addFavourite = (id) => {
     return async(dispatch) => {

          dispatch({ type : ATTEMPTING_FAVOURITES });

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          const Auth = 'Bearer '.concat(user?.token);
          
         var config = {
               method: 'post',
               url: `${RoutesApi}/users/favourites/${id}`,
               headers: { 
               'Authorization': Auth
               }
          };
 
          axios(config)
          .then(resp => handleAddFavourite(dispatch , resp ))
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
               dispatch({ type : FAVOURITES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleAddFavourite  = async ( dispatch , resp ) => {
     dispatch({ type : ADD_FAVOURITE });
};

export const deleteFavourite = (id) => {
     return async(dispatch) => {

          dispatch({ type : ATTEMPTING_FAVOURITES });

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
  
          const Auth = 'Bearer '.concat(user?.token);
          
         var config = {
               method: 'delete',
               url: `${RoutesApi}/users/favourites/${id}`,
               headers: { 
               'Authorization': Auth
               }
          };
 
          axios(config)
          .then(resp => handleDeleteFavourite(dispatch , resp ))
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
               dispatch({ type : FAVOURITES_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleDeleteFavourite  = async ( dispatch , resp ) => {
     dispatch({ type : DELETE_FAVOURITE });
};