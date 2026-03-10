import { ATTEMPTING_REPORT , SEND_REPORT, SEND_REPORT_FAILED } from './Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesApi from '../../../../constants/RoutesApi';

import axios from 'axios';

export const sendReport = () => {
     return async(dispatch) => {
         dispatch({type : ATTEMPTING_REPORT});
  
         const userData = await AsyncStorage.getItem('user')
         const user = JSON.parse(userData)

         const Auth = 'Bearer '.concat(user?.token);

         var config = {
               method: 'post',
               url: `${RoutesApi}/reports`,
               headers: { 
                    'Authorization': Auth
               },
               data : {
                    
               }
         }
 
          axios(config)
          .then(resp => handleSendReport(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : SEND_REPORT_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleSendReport = async ( dispatch , resp ) => {
     dispatch({ type : SEND_REPORT , payload : resp.data });
};