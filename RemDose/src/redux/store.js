import {createStore, combineReducers, applyMiddleware }from 'redux';
import thunk from 'redux-thunk';
import pillReducer from './reducers';

const rootReducer = combineReducers({pillReducer});

export const Store = createStore(rootReducer, applyMiddleware(thunk));

//RESOURCES
/***************************************************************************************
*    
*    Title: React Native Tutorial #26 (2021) - Redux - State Management
*    Author: Programming with Mash
*    Availability: https://www.youtube.com/watch?v=BtJoy4G3N8U
*
***************************************************************************************/