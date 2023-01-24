import { ADD_PRODUCT_TO_CART, REPLACE_CART, UPDATE_PRODUCT_QUANTITY, CLEAR_CART, REMOVE_PRODUCT_FROM_CART, UPDATE_JOBID, UPDATE_CLIENT, UPDATE_TITLE, UPDATE_MANUAL_DISCOUNT, UPDATE_DEPOSIT, LOAD_JOB, CLEAR_JOB, LOAD_QUOTE, CLEAR_QUOTE, LOAD_QUOTE_OBJ, LOAD_JOB_OBJ } from "../Actions/ActionTypes"

const initialState = {
    job: {
        jobId: null,
        client: null,
        title: "",
        cart: [],
        manualDiscount: "",
        deposit: "",
        startDate: "",
        startTime: ""
    },
    quote: {
        jobId: null,
        client: null,
        title: "",
        cart: [],
        manualDiscount: "",
        deposit: "",
        startDate: "",
        startTime: ""
    }
    
}

const JobReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PRODUCT_TO_CART:
            return {
                ...state,
                job: {
                    ...state.job,
                    cart: [...state.job.cart, action.data]
                }
            }
        case REPLACE_CART:
            return {
                ...state,
                job: {
                    ...state.job,
                    cart: action.data
                }
            }
        case UPDATE_PRODUCT_QUANTITY:
            return {
                ...state,
                job: {
                    ...state.job,
                    cart: state.job.cart.filter(x => { if(x.id == action.data.id) { x.quantity = action.data.quantity; } return x; })
                }
            }
        case REMOVE_PRODUCT_FROM_CART:
            return {
                ...state,
                job: {
                    ...state.job,
                    cart: state.job.cart.filter(x => x.id != action.data.id)
                }
            } 
        case CLEAR_CART:
            return {
                ...state,
                job: {
                    ...state.job,
                    cart: []
                }
            }
        case UPDATE_JOBID:
            return {
                ...state,
                job: {
                    ...state.job,
                    jobId: action.data
                }
            }  
        case UPDATE_CLIENT:
            return {
                ...state,
                job: {
                    ...state.job,
                    client: action.data
                }
            }  
        case UPDATE_TITLE:
            return {
                ...state,
                job: {
                    ...state.job,
                    title: action.data
                }
            } 
        case UPDATE_MANUAL_DISCOUNT:
            return {
                ...state,
                job: {
                    ...state.job,
                    manualDiscount: action.data
                }
            }
        case UPDATE_DEPOSIT:
            return {
                ...state,
                job: {
                    ...state.job,
                    deposit: action.data
                }
            }
        case LOAD_JOB:
            return {
                ...state,
                job: {
                    ...state.job,
                    jobId: action.data.jobId,
                    title: action.data.title,
                    client: action.data.client,
                    manualDiscount: action.data.manualDiscount,
                    deposit: action.data.deposit,
                    cart: action.data.cart,
                    startDate: action.data.startDate,
                    startTime: action.data.startTime,
                }
            }
        case LOAD_JOB_OBJ:
            return {
                ...state,
                job: {
                    ...state.job,
                    ...action.data
                }
            }
        case CLEAR_JOB:
            return {
                ...state,
                job: {
                    ...state.job,
                    jobId: null,
                    client: null,
                    title: "",
                    cart: [],
                    manualDiscount: "",
                    deposit: "",
                    startDate: "",
                    startTime: ""
                }
            }
        case LOAD_QUOTE_OBJ:
            return {
                ...state,
                quote: {
                    ...state.quote,
                    ...action.data
                }
            }
        case LOAD_QUOTE:
            return {
                ...state,
                quote: {
                    ...state.quote,
                    jobId: action.data.jobId,
                    title: action.data.title,
                    client: action.data.client,
                    manualDiscount: action.data.manualDiscount,
                    deposit: action.data.deposit,
                    cart: action.data.cart,
                    startDate: action.data.startDate,
                    startTime: action.data.startTime,
                }
            }
        case CLEAR_QUOTE:
            return {
                ...state,
                quote: {
                    ...state.quote,
                    jobId: null,
                    client: null,
                    title: "",
                    cart: [],
                    manualDiscount: "",
                    deposit: "",
                    startDate: "",
                    startTime: ""
                }
            }
        default:
            return state;
    }
}

export default JobReducer
