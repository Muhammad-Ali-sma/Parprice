import {LOGIN, LOGOUT, LOADER } from './ActionTypes';


export const UserLogin = (login) => {
    return async (dispatch, getState) => {
        dispatch({
            type: LOGIN,
            login: login
        })
    }
};

export const UserLogout = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: LOGOUT
        })
    }
};


export const ChangeLoader = (loading) => {
    return (dispatch, getState) => {
        dispatch({
            type: LOADER,
            loading: loading
        })
    }
};

