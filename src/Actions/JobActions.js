import { ADD_PRODUCT_TO_CART, REPLACE_CART, CLEAR_CART, UPDATE_PRODUCT_QUANTITY, REMOVE_PRODUCT_FROM_CART, UPDATE_CLIENT, UPDATE_TITLE, UPDATE_JOBID, UPDATE_DEPOSIT, UPDATE_MANUAL_DISCOUNT, CLEAR_JOB, LOAD_JOB, LOAD_JOB_OBJ, LOAD_QUOTE_OBJ,CLEAR_QUOTE } from "./ActionTypes";

export const addProductToCart = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADD_PRODUCT_TO_CART,
            data: data
        })
    }
};

export const reloadProductToCart = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: REPLACE_CART,
            data: data
        })
    }
};

export const removeProductFromCart = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: REMOVE_PRODUCT_FROM_CART,
            data: data
        })
    }
};

export const clearCart = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_CART,
        })
    }
};

export const updateProductQty = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_PRODUCT_QUANTITY,
            data: data
        })
    }
};

export const updateClient = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_CLIENT,
            data: data
        })
    }
};

export const updateTitle = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_TITLE,
            data: data
        })
    }
};

export const updateJobId = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_JOBID,
            data: data
        })
    }
};

export const updateDeposit = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_DEPOSIT,
            data: data
        })
    }
};

export const updateManualDiscount = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: UPDATE_MANUAL_DISCOUNT,
            data: data
        })
    }
};

export const clearJobDetails = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_JOB,
        })
    }
};

export const clearQuoteDetails = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: CLEAR_QUOTE,
        })
    }
};

export const loadJobDetails = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: LOAD_JOB,
            data: data
        })
    }
};

export const loadJobDetailsObject = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: LOAD_JOB_OBJ,
            data: data
        })
    }
};

export const loadQuoteDetailsObject = (data) => {
    return (dispatch, getState) => {
        dispatch({
            type: LOAD_QUOTE_OBJ,
            data: data
        })
    }
};