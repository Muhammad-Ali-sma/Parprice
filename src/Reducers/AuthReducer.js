import { LOGIN, LOGOUT, LOADER } from '../Actions/ActionTypes';

const initialState = {
    login: 'Logout',
    loading: false
};
const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                login: action.login,
            };
        case LOGOUT:
            return {
                ...state,
                login: 'Logout'
            };
        case LOADER:
            return {
                ...state,
                loading: action.loading,
            };
        default:
            return state;
    }
};

export default AuthReducer;