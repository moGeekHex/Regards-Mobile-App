import { ATTEMPTING_LOCATION, GET_LOCATION } from './Types';

export const addLocation = ( lat, long, country, city, address ) => {
    return async(dispatch) => {
        dispatch({type : ATTEMPTING_LOCATION});

        dispatch({ type : GET_LOCATION, lat : lat, long : long, country : country, city : city, address : address})

    }
}
