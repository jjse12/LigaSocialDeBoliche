import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { currentSeasonReducer, nextMatchdayReducer, nextMatchdayMatchesReducer} from './current-season';
import { teamPlayersReducer } from "./teams";
import { matchResultsReducer, matchScoreboardsReducer, matchTeamScoreboardReducer } from "./matches";
import seasonMatchdays from './season-matchdays';

export const reducers = {
    routing: routerReducer,
    seasonMatchdays: seasonMatchdays,
    currentSeason: currentSeasonReducer,
    nextMatchday: nextMatchdayReducer,
    nextMatchdayMatches: nextMatchdayMatchesReducer,
    matchResults: matchResultsReducer,
    matchScoreboards: matchScoreboardsReducer,
    matchTeamScoreboard: matchTeamScoreboardReducer,
    teamPlayers: teamPlayersReducer
};

export default combineReducers(reducers);
