import { ajaxGet } from "../utilities/action-creators";
import uri from "../services/uri";

export const ACTION_TYPE_MATCH_RESULTS = 'get_match_results';
export const ACTION_TYPE_MATCH_SCOREBOARDS = 'get_match_scoreboards';
export const ACTION_TYPE_MATCH_TEAM_SCOREBOARD = 'get_match_team_scoreboard';

export const getMatchResults = (id) => dispatch =>
    dispatch(ajaxGet(ACTION_TYPE_MATCH_RESULTS, uri.api.matchResults(id)));

export const getMatchScoreboards = (id) => dispatch =>
    dispatch(ajaxGet(ACTION_TYPE_MATCH_SCOREBOARDS, uri.api.matchScoreboards(id)));

export const getMatchTeamScoreboard = (matchId, seasonTeamId) => dispatch =>
    dispatch(ajaxGet(ACTION_TYPE_MATCH_TEAM_SCOREBOARD, uri.api.matchTeamScoreboard(matchId, seasonTeamId)));

export function matchResultsReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_MATCH_RESULTS:
            return action.data;
    }
    return state;
}

export function matchScoreboardsReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_MATCH_SCOREBOARDS:
            return action.data;
    }
    return state;
}

export function matchTeamScoreboardReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_MATCH_TEAM_SCOREBOARD:
            return action.data;
    }
    return state;
}
