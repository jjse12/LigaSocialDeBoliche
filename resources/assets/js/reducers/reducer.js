import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import SeasonMatchdays from './season-matchdays';

export const reducers = {
    routing: routerReducer,
    seasonMatchdays: SeasonMatchdays
};

export default combineReducers(reducers);
