import { ATTEMPTING_OTP,  SEND_OTP_SUCCESS, CHECK_OTP_SUCCESS, OTP_FAILED, LOGOUT, RESEND_OTP_SUCCESS } from './Types';
import axios from 'axios';
import RoutesApi from '../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendOtp = ( phone ) => {
    return async(dispatch) => {
        dispatch({type : ATTEMPTING_OTP});

        axios.post(`${RoutesApi}/otp`, {
            phone,
        })
        .then(resp => handleSendOtp(dispatch , resp, phone ))
        .catch(function (err) {
            axios.interceptors.response.use((response)=>{
                 return response
            }, (error) => {
                if (error && error.response && error.response.status === 401 || error && error.response && error.response.status === 400) {
                    return Promise.reject(
                        dispatch({ type : OTP_FAILED, errorRes : err?.response?.data })
                    );
                }
            }) 
            dispatch({ type : MYWALLET_FAILED, errorRes : err.response.data })
        });

    }
}

const handleSendOtp = async ( dispatch , resp, phone ) => {
    dispatch({ type : SEND_OTP_SUCCESS, payload : phone });
};

export const reSendOtp = ( phone ) => {
    return (dispatch) => {
        dispatch({type : ATTEMPTING_OTP});
        axios.post(`${RoutesApi}/otp`, {
            phone,
        })
        .then(resp => handleReSendOtp(dispatch , resp, phone ))
        .catch(function (err) {
            dispatch({ type : OTP_FAILED, errorRes : err.response.data })
        });
    }
}

const handleReSendOtp = async ( dispatch , resp, phone ) => {
    dispatch({ type : RESEND_OTP_SUCCESS, payload : phone });
};

export const checkOtp = ( phone, code ) => {
    return (dispatch) => {
        dispatch({type : ATTEMPTING_OTP});
        axios.post(`${RoutesApi}/otp/validate`, {
            phone,
            code
        })
        .then(resp => handleCheckOtp(dispatch , resp ))
        .catch(function (err) {
            console.warn(err.response)
            dispatch({ type : OTP_FAILED, errorRes : err.response.data })
        });
     }
 }
 
 const handleCheckOtp = async ( dispatch , resp ) => {
     const userData = resp.data;
     const user = JSON.stringify(userData);
 
     try {
         await AsyncStorage.setItem('user',user);
     } catch (e) {
 
     }
     dispatch({ type : CHECK_OTP_SUCCESS, payload : userData });
 };



export const logoutAction = () => { 
    return async (dispatch) => {
        dispatch({type : ATTEMPTING_OTP});

        try {
            await AsyncStorage.removeItem('user');
        } catch (e) {
    
        }
        dispatch({ type : LOGOUT });
    };
}