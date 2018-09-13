import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import CurrentSeason from './current-season';
import SeasonMatchdays from './season-matchdays';

export const reducers = {
    routing: routerReducer,
    seasonMatchdays: SeasonMatchdays,
    currentSeason: CurrentSeason,
};

export default combineReducers(reducers);
