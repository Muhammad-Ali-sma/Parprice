import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import AuthReducer from '../Reducers/AuthReducer';
import UserReducer from '../Reducers/UserReducer';
import CategoryReducer from '../Reducers/CategoryReducer';
import JobReducer from '../Reducers/JobReducer';
import ChatReducer from '../Reducers/ChatReducer';

const appReducers = combineReducers({
   AuthReducer,
   UserReducer,
   CategoryReducer,
   JobReducer,
   ChatReducer
});

const rootReducer = (state, action) => appReducers(state, action);

export const store = createStore(rootReducer, applyMiddleware(thunk));