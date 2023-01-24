import CommonServices from "../Services/CommonServices";
import { ACTIVE, ADD_NOTIFICATIONS, SET_SCHEDULECOUNT, SET_COLOR, USER_DATA, REMOVE_NOTIFICATIONS, SET_PRIMRY_COLOR } from "./ActionTypes";

export const handleActive = (active) => {
    return (dispatch, getState) => {
        dispatch({
            type: ACTIVE,
            active: active
        })
    }
};

export const userData = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: USER_DATA,
            data: data
        })
    }
};

export const SetScheduleCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_SCHEDULECOUNT,
            data: data
        })
    }
};
export const AddNotification = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADD_NOTIFICATIONS,
            data: data
        })
    }
};
export const removeNotification = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_NOTIFICATIONS,
        })
    }
};
export const changeBarColor = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_COLOR,
            data: data
        })
    }
};
export const changePrimaryColor = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_PRIMRY_COLOR,
            data: data
        })
    }
};