import { ATTEMPTING_ADD_FAVOURITE,  ADD_FAVOURITE_SUCCESS, ADD_FAVOURITE_FAILED } from './Types';
import axios from 'axios';
import RoutesApi from '../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutAction } from './AuthAction';

export const addFavourites = ( phone ) => {
    return async(dispatch) => {
          dispatch({type : ATTEMPTING_ADD_FAVOURITE});

          const tokenData = await AsyncStorage.getItem('token')
          const token = JSON.parse(tokenData)
  
          const Auth = 'Bearer '.concat(token);
  
          var config = {
              method: 'post',
              url: `${RoutesApi}/users/me`,
              headers: { 
                'Authorization': Auth
              }
          };

          axios(config)  
          .then(resp => handleFavourites(dispatch , resp ))
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
               dispatch({ type : ADD_FAVOURITE_FAILED, errorRes : err.response.data })
          });
    }
}

const handleFavourites = async ( dispatch , resp ) => {
    //  console.log(resp.data)
     dispatch({ type : ADD_FAVOURITE_SUCCESS });
};