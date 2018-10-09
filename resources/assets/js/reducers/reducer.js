import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { isFetchingReducer as isFetching } from '../utilities/action-creators';
import { loggedInPlayerReducer } from "./players";
import { currentSeasonReducer, nextMatchdayReducer, nextMatchdayMatchesReducer} from './current-season';
import { seasonTeamPlayersReducer } from "./teams";
import { matchResultsReducer, matchScoreboardsReducer, matchSeasonTeamScoreboardReducer, matchMyTeamAvailablePlayersReducer,
    matchPlayerSeasonTeamIdReducer, matchMyTeamOfflineScoreboardReducer, matchRivalTeamOfflineScoreboardReducer} from "./matches";
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
    matchMyTeamAvailablePlayers: matchMyTeamAvailablePlayersReducer,
    matchMyTeamOfflineScoreboard: matchMyTeamOfflineScoreboardReducer,
    matchRivalTeamOfflineScoreboard: matchRivalTeamOfflineScoreboardReducer,
    matchResults: matchResultsReducer,
    matchScoreboards: matchScoreboardsReducer,
    matchSeasonTeamScoreboard: matchSeasonTeamScoreboardReducer,
    createScore: scoreCreateReducer,
    updateScore: scoreUpdateReducer,
    deleteScore: scoreDeleteReducer,

    teamPlayers: seasonTeamPlayersReducer,
    isFetching,
};

export default combineReducers(reducers);
