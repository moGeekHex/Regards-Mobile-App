import axios from 'axios';
import RoutesApi from '../../../../constants/RoutesApi';
import { ATTEMPTING_EVENTS, GET_POPULAR_EVENTS, GET_ALL_EVENTS, GET_EVENTS_FAILED } from './Types'

export const getPopularEvents = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_EVENTS});
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/events?sort=purchasesCount,DESC&limit=4`,
         }
 
          axios(config)
          .then(resp => handlePopularEvents(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_EVENTS_FAILED, errorPayload : err.response.data })
          });
     }
}

const handlePopularEvents = async ( dispatch , resp ) => {
     dispatch({ type : GET_POPULAR_EVENTS , payload : resp.data });
};

export const getAllEvents = () => {
     return async(dispatch) => {
 
         dispatch({type : ATTEMPTING_EVENTS });
  
         var config = {
             method: 'get',
             url: `${RoutesApi}/events`,
         }
 
          axios(config)
          .then(resp => handleAllEvents(dispatch , resp ))
          .catch(function (err) {
               dispatch({ type : GET_EVENTS_FAILED, errorPayload : err.response.data })
          });
     }
}

const handleAllEvents = async ( dispatch , resp ) => {
     dispatch({ type : GET_ALL_EVENTS , payload : resp.data });
};