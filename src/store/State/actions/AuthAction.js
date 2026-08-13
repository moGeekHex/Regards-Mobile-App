import { ATTEMPTING_OTP,  SEND_OTP_SUCCESS, CHECK_OTP_SUCCESS, OTP_FAILED, LOGOUT, RESEND_OTP_SUCCESS } from './Types';
import axios from 'axios';
import RoutesApi from '../../../constants/RoutesApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appEvents } from '../../../events/appEvents';
import { snapchatLoginEvent, snapchatSignUpEvent } from '../../../events/snapchatEvents';

export const sendOtp = ( phone ) => {
    return async(dispatch) => {
        dispatch({type : ATTEMPTING_OTP});
        try { appEvents({ eventName: "otp_requested" }); } catch (e) {}

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
        try { appEvents({ eventName: "otp_resent" }); } catch (e) {}
        
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
        .then(resp => handleCheckOtp(dispatch , resp, phone ))
        .catch(function (err) {
            console.warn(err.response)
            dispatch({ type : OTP_FAILED, errorRes : err.response.data })
        });
     }
 }
 
 const handleCheckOtp = async ( dispatch , resp, phone ) => {
     const userData = resp.data;
     const user = JSON.stringify(userData);
     // Same new-account heuristic the GA4 sign_up event already relies on.
     const isNewUser = userData?.user?.firstName === null || userData?.isNewUser;

     try {
         await AsyncStorage.setItem('user',user);
         try { appEvents({ eventName: "login", payload: { method: "SMS" } }); } catch(e){}
         // If a new account is registered, usually APIs return an indicator.
         // Assuming userData.isNewUser or similar, fall back to checking if name is empty as a proxy if explicit flag missing.
         if(isNewUser) {
             try { appEvents({ eventName: "sign_up", payload: { method: "SMS" } }); } catch(e){}
         }
     } catch (e) {

     }

     // Snapchat CAPI. Fired here rather than in the screen so it only runs on a
     // validated OTP, and so the phone is available as a match key. The number
     // is hashed server-side and never reaches Snap in clear.
     snapchatLoginEvent({ phone });
     if(isNewUser) {
         snapchatSignUpEvent({ phone });
     }
     dispatch({ type : CHECK_OTP_SUCCESS, payload : userData });
 };



export const logoutAction = () => { 
    return async (dispatch) => {
        dispatch({type : ATTEMPTING_OTP});

        try {
            await AsyncStorage.removeItem('user');
            appEvents({ eventName: "logout" });
        } catch (e) {
    
        }
        dispatch({ type : LOGOUT });
    };
}