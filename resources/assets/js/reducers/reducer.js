import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { currentSeasonReducer, nextMatchdayReducer, nextMatchdayMatchesReducer} from './current-season';
import { matchResultsReducer, matchScoreboardsReducer, matchTeamScoreboardReducer } from "./match";
import seasonMatchdays from './season-matchdays';

export const reducers = {
    routing: routerReducer,
    seasonMatchdays: seasonMatchdays,
    currentSeason: currentSeasonReducer,
    nextMatchday: nextMatchdayReducer,
    nextMatchdayMatches: nextMatchdayMatchesReducer,
    matchResults: matchResultsReducer,
    matchScoreboards: matchScoreboardsReducer,
    matchTeamScoreboard: matchTeamScoreboardReducer
};

export default combineReducers(reducers);
