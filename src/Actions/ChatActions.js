import { SET_CHATS, CLEAR_CHATS, UPDATE_CHATS, APPEND_CHATS, CHAT_COUNT, CLIENT_MSG_COUNT, USER_MSG_COUNT, SEEN_USER_MSG_COUNT, SEEN_CLIENT_MSG_COUNT, REMOVE_CLIENT_MSG_COUNT, REMOVE_USER_MSG_COUNT, UPDATE_CLIENT_MSG_COUNT, UPDATE_USER_MSG_COUNT, SET_USER_LAST_MESSAGE, SET_CLIENT_LAST_MESSAGE } from "./ActionTypes";

export const addChats = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_CHATS,
            data: data
        })
    }
};
export const clearChats = () => {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_CHATS,
        })
    }
};
export const updateChats = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_CHATS,
            data: data
        })
    }
};
export const appendChats = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: APPEND_CHATS,
            data: data
        })
    }
};
export const setChatCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: CHAT_COUNT,
            data: data
        })
    }
};

export const setClientMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: CLIENT_MSG_COUNT,
            data: data
        })
    }
};

export const setUserMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: USER_MSG_COUNT,
            data: data
        })
    }
};
export const setSeenUserMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SEEN_USER_MSG_COUNT,
            data: data
        })
    }
};
export const setSeenClientMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SEEN_CLIENT_MSG_COUNT,
            data: data
        })
    }
};
export const removeSeenClientMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_CLIENT_MSG_COUNT,
            data: data
        })
    }
};
export const removeSeenUserMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_USER_MSG_COUNT,
            data: data
        })
    }
};
export const updateSeenClientMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_CLIENT_MSG_COUNT,
            data: data
        })
    }
};
export const updateSeenUserMsgCount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_USER_MSG_COUNT,
            data: data
        })
    }
};
export const setUserLastMessage = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_USER_LAST_MESSAGE,
            data: data
        })
    }
};
export const setClientLastMessage = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: SET_CLIENT_LAST_MESSAGE,
            data: data
        })
    }
};
