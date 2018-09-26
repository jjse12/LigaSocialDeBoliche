import { ajaxGet } from "../utilities/action-creators";
import uri from "../services/uri";

export const MATCH_RESULTS = 'get_match_results';
export const MATCH_SCOREBOARDS = 'get_match_scoreboards';
export const MATCH_TEAM_SCOREBOARD = 'get_match_team_scoreboard';
export const MATCH_PLAYER_SEASON_TEAM_ID = 'get_match_player_season_team_id';
export const MATCH_MY_TEAM_OFFLINE_SCOREBOARD = 'get_match_my_team_offline_scoreboard';
export const MATCH_RIVAL_TEAM_OFFLINE_SCOREBOARD = 'get_match_rival_team_offline_scoreboard';

export const getMatchResults = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_RESULTS, uri.api.matchResults(id)));

export const getMatchScoreboards = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_SCOREBOARDS, uri.api.matchScoreboards(id)));

export const getMatchTeamScoreboard = (matchId, seasonTeamId) => dispatch =>
    dispatch(ajaxGet(MATCH_TEAM_SCOREBOARD, uri.api.matchTeamScoreboard(matchId, seasonTeamId)));

export const getMatchPlayerSeasonTeamId = (matchId, playerId) => dispatch => {
    return dispatch(ajaxGet(MATCH_PLAYER_SEASON_TEAM_ID, uri.api.matchPlayerSeasonTeamId(matchId, playerId)));
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

export function matchTeamScoreboardReducer(state = {}, action) {
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

export function matchMyTeamOfflineScoreboardReducer(state = {}, action) {
    switch (action.type) {
        case MATCH_MY_TEAM_OFFLINE_SCOREBOARD:
            return action.scoreboard
    }
    return state;
}

export function matchRivalTeamOfflineScoreboardReducer(state = {}, action) {
    switch (action.type) {
        case MATCH_RIVAL_TEAM_OFFLINE_SCOREBOARD:
            return action.scoreboard
    }
    return state;
}
