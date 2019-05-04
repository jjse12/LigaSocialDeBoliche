import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';
import { isFetchingReducer as isFetching } from '../utilities/action-creators';
import player from "./players";
import currentSeason from './currentSeason';
import { seasonTeamPlayersReducer } from "./teams";
import { matchResultsReducer, matchScoreboardsReducer, matchSeasonTeamScoreboardReducer, matchMyTeamAvailablePlayersReducer,
    matchPlayerSeasonTeamIdReducer, matchMyTeamOfflineScoreboardReducer, matchRivalTeamOfflineScoreboardReducer} from "./matches";
import { scoreCreateReducer, scoreUpdateReducer, scoreDeleteReducer } from "./scores";
import seasonMatchdays from './season-matchdays';
import match from './match';

export const reducers = {
    routing: routerReducer,
    loggedInPlayer: player,
    seasonMatchdays,
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
    teamPlayers: seasonTeamPlayersReducer,
    match,

    isFetching,
};

export default combineReducers(reducers);
