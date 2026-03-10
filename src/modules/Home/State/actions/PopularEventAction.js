import { POPULAR_EVENT_HOME_FAILED , POPULAR_EVENT_HOME_INIT, ATTEMPTING_EVENTS_HOME, GET_ALL_HOME_EVENTS, GET_EVENTS_HOME_FAILED } from './Types';

import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';

export const initPopularEvent = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_EVENTS_HOME});
          
         var config = {
             method: 'get',
             url: `${RoutesApi}/events?sort=purchasesCount,DESC&limit=6`,
         }
 
          axios(config)
          .then(resp => handleInitSuccess(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : POPULAR_EVENT_HOME_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleInitSuccess = async ( dispatch , resp ) => {
     dispatch({ type : POPULAR_EVENT_HOME_INIT , payload : resp.data });
};

export const getAllEvents = () => {
     return async(dispatch) => {
 
          dispatch({type : ATTEMPTING_EVENTS_HOME });
  
          var config = {
               method: 'get',
               url: `${RoutesApi}/events?sort=purchasesCount,DESC`,
          }
 
          axios(config)
          .then(resp => handleAllEvents(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_EVENTS_HOME_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleAllEvents = async ( dispatch , resp ) => {
     dispatch({ type : GET_ALL_HOME_EVENTS , payload : resp.data });
};