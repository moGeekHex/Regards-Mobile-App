import { ATTEMPTING_IMAGE_PROFILE , IMAGE_PROFILE_SUCCESS, IMAGE_PROFILE_FAILED } from './Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesApi from '../../../../constants/RoutesApi';
import { Platform } from 'react-native';
import axios from 'axios';
import { logoutAction } from '../../../../store/State/actions/AuthAction';

export const uploadImage = ( image ) => {
     return async (dispatch) => {
          dispatch({type : ATTEMPTING_IMAGE_PROFILE});

          const userData = await AsyncStorage.getItem('user')
          const user = JSON.parse(userData)
          const Auth = 'Bearer '.concat(user?.token);

          const imageName = image.filename || image.path.split('/').pop()
          const formData = new FormData();
          formData.append('file', {
               name: imageName,
               type: image.mime,
               uri : image.path
          }); 

          var config = {
               method: 'patch',
               url: `${RoutesApi}/users/thumb/${user.user.id}`,
               headers: { 
                    'Authorization': Auth
               },
               data : formData
          };
 
     //      axios(config)
     //      .then(function (response) {
     //           console.log(response.data)
     //           dispatch({ type : IMAGE_PROFILE_SUCCESS });
     //      })
     //     .catch(function (error) {
     //           console.log(error.response.data)
     //           dispatch({ type : IMAGE_PROFILE_FAILED });
     //     });

         fetch(`${RoutesApi}/users/thumb/${user.user.id}`,{
               method: 'patch',
               headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': Auth
               },
               body: formData
          }).then(response => {
               dispatch({ type : IMAGE_PROFILE_SUCCESS });
          }).catch(err => {
               axios.interceptors.response.use((response)=>{
                    return response
               }, (error) => {
                    if (error && error.response && error.response.status === 401) {
                         return Promise.reject(
                              dispatch(logoutAction())
                         );
                    }
               }) 
               dispatch({ type : IMAGE_PROFILE_FAILED });
          })  
     }
}