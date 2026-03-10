import axios from "axios";
import {goToLogin, goToError} from "./Helpers"

axios.interceptors.response.use((response)=>{
    return response
}, (error) => {
    if(error && error.response == undefined){
        return Promise.reject(
            goToError()
        )
    } else if (error && error.response && error.response.status === 401) {
        return Promise.reject(
            goToLogin()
        );
    }
}) 