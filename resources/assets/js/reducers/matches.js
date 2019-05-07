import {ajaxGet, ajaxPost} from "../utilities/action-creators";
import uri from "../services/uri";

export const MATCH_RESULTS = 'get_match_results';
export const MATCH_SCOREBOARDS = 'get_match_scoreboards';
export const MATCH_TEAM_SCOREBOARD = 'get_match_team_scoreboard';
export const MATCH_PLAYER_SEASON_TEAM_ID = 'get_match_player_season_team_id';
export const MATCH_MY_TEAM_AVAILABLE_PLAYERS = 'get_match_my_team_available_players';
export const MATCH_MY_TEAM_OFFLINE_SCOREBOARD = 'get_match_my_team_offline_scoreboard';
export const MATCH_RIVAL_TEAM_OFFLINE_SCOREBOARD = 'get_match_rival_team_offline_scoreboard';

export const MATCH_TEAM_END_PHASE = 'post_match_team_end_phase';

export const totalsObject = title => {
    return {
        title: title,
        firstGame: 0,
        secondGame: 0,
        thirdGame: 0,
        total: 0
    }
};

const offlineScoreboardInitialState = {
    playersScores: [],
    gamesTotals: [
        totalsObject('Pin neto'),
        totalsObject('Handicap'),
        totalsObject('Total')
    ]
};

export const getMatchResults = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_RESULTS, uri.api.matchScoreboards(id)));

export const getMatchScoreboards = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_SCOREBOARDS, uri.api.matchScoreboards(id)));

export const getMatchSeasonTeamScoreboard = (matchId, seasonTeamId) => dispatch =>
    dispatch(ajaxGet(MATCH_TEAM_SCOREBOARD, uri.api.matchSeasonTeamScoreboard(matchId, seasonTeamId)));

export const getMatchPlayerSeasonTeamId = (matchId, playerId) => dispatch => {
    return dispatch(ajaxGet(MATCH_PLAYER_SEASON_TEAM_ID, uri.api.matchSeasonTeamScoreboard(matchId, playerId)));
};

export const getMatchMyTeamAvailablePlayers = (matchId, seasonTeamId) => dispatch => {
    return dispatch(ajaxGet(MATCH_MY_TEAM_AVAILABLE_PLAYERS, uri.api.matchTeamAvailablePlayers(matchId, seasonTeamId)));
};

export const setMatchMyTeamOfflineScoreboard = scoreboard => dispatch =>
    dispatch({
        type: MATCH_MY_TEAM_OFFLINE_SCOREBOARD,
        scoreboard: scoreboard
    });

export const setMatchRivalTeamOfflineScoreboard = scoreboard => dispatch =>
    dispatch({
        type: MATCH_RIVAL_TEAM_OFFLINE_SCOREBOARD,
        scoreboard: scoreboard
    });

export const matchSeasonTeamEndPhase = (matchId, seasonTeamId, phase) => dispatch => {
    const data = {
        match: matchId,
        seasonTeamId: seasonTeamId,
        phase: phase
    };
    return dispatch(ajaxPost(MATCH_TEAM_END_PHASE, uri.api.matchSeasonTeamEndPhase, data));
};

export function matchResultsReducer(state = {}, action) {
    switch (action.type) {
        case MATCH_RESULTS:
            return action.data;
    }
    return state;
}

export function matchScoreboardsReducer(state = {}, action) {
    switch (action.type) {
        case MATCH_SCOREBOARDS:
            return action.data;
    }
    return state;
}

export function matchSeasonTeamScoreboardReducer(state = {}, action) {
    switch (action.type) {
        case MATCH_TEAM_SCOREBOARD:
            return action.data;
    }
    return state;
}

export function matchPlayerSeasonTeamIdReducer(state = 0, action) {
    switch (action.type) {
        case MATCH_PLAYER_SEASON_TEAM_ID:
            return action.data.seasonTeamId;
    }
    return state;
}

export function matchMyTeamAvailablePlayersReducer(state = [], action) {
    switch (action.type) {
        case MATCH_MY_TEAM_AVAILABLE_PLAYERS:
            return action.data
    }
    return state;
}

export function matchMyTeamOfflineScoreboardReducer(state = offlineScoreboardInitialState, action) {
    switch (action.type) {
        case MATCH_MY_TEAM_OFFLINE_SCOREBOARD:
            return action.scoreboard
    }
    return state;
}

export function matchRivalTeamOfflineScoreboardReducer(state = offlineScoreboardInitialState, action) {
    switch (action.type) {
        case MATCH_RIVAL_TEAM_OFFLINE_SCOREBOARD:
            return action.scoreboard
    }
    return state;
}
