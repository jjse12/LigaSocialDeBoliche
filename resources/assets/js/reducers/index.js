import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { isFetchingReducer as isFetching } from '../utilities/action-creators';
import user from "./user";
import currentSeason from './currentSeason';
import seasonTeam from "./seasonTeam";
import match from './match';
import { matchResultsReducer, matchScoreboardsReducer, matchSeasonTeamScoreboardReducer, matchMyTeamAvailablePlayersReducer,
    matchPlayerSeasonTeamIdReducer, matchMyTeamOfflineScoreboardReducer, matchRivalTeamOfflineScoreboardReducer} from "./matches";
import { scoreCreateReducer, scoreUpdateReducer, scoreDeleteReducer } from "./scores";

export const reducers = {
    routing: routerReducer,
    user,
    currentSeason,
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
    seasonTeam,
    match,
    isFetching,
};

export default combineReducers(reducers);
