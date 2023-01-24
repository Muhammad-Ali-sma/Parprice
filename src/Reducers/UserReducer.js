import { ACTIVE, USER_DATA, SET_SCHEDULECOUNT, ADD_NOTIFICATIONS, REMOVE_NOTIFICATIONS, SET_COLOR, SET_PRIMRY_COLOR } from "../Actions/ActionTypes"

const initialState = {
    active: 'Home',
    user: {},
    company: {},
    notifications: [],
    scheduleCount: 0,
    statusbarColor: 'black',
    barContent: 'light-content',
    primaryColor: '#FC3300'
}

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVE:
            return {
                ...state,
                active: action.active
            }
        case USER_DATA:
            return {
                ...state,
                user: action.data.user,
                company: action.data.company == null ? state.company : action.data.company
            }
        case ADD_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data
            }
        case REMOVE_NOTIFICATIONS:
            return {
                ...state,
                notifications: []
            }
        case SET_SCHEDULECOUNT:
            return {
                ...state,
                scheduleCount: action.data
            }
        case SET_COLOR:
            return {
                ...state,
                statusbarColor: action.data.barColor,
                barContent: action.data.barContent
            }
        case SET_PRIMRY_COLOR:
            return {
                ...state,
                primaryColor: action.data.color,
            }
        default:
            return state;
    }
}

export default UserReducer
