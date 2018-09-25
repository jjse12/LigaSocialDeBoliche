import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { isFetchingReducer as isFetching } from '../utilities/action-creators';
import { loggedInPlayerReducer } from "./players";
import { currentSeasonReducer, nextMatchdayReducer, nextMatchdayMatchesReducer} from './current-season';
import { teamPlayersReducer } from "./teams";
import { matchResultsReducer, matchScoreboardsReducer, matchTeamScoreboardReducer, matchPlayerSeasonTeamIdReducer } from "./matches";
import { scoreCreateReducer, scoreUpdateReducer, scoreDeleteReducer } from "./scores";
import seasonMatchdays from './season-matchdays';

export const reducers = {
    routing: routerReducer,
    loggedInPlayer: loggedInPlayerReducer,
    seasonMatchdays: seasonMatchdays,
    currentSeason: currentSeasonReducer,
    nextMatchday: nextMatchdayReducer,
    nextMatchdayMatches: nextMatchdayMatchesReducer,
    matchPlayerSeasonTeamId: matchPlayerSeasonTeamIdReducer,
    matchResults: matchResultsReducer,
    matchScoreboards: matchScoreboardsReducer,
    matchTeamScoreboard: matchTeamScoreboardReducer,
    createScore: scoreCreateReducer,
    updateScore: scoreUpdateReducer,
    deleteScore: scoreDeleteReducer,

    teamPlayers: teamPlayersReducer,
    isFetching,
};

export default combineReducers(reducers);
