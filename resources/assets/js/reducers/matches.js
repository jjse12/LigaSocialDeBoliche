import { ajaxGet } from "../utilities/action-creators";
import uri from "../services/uri";

export const MATCH_RESULTS = 'get_match_results';
export const MATCH_SCOREBOARDS = 'get_match_scoreboards';
export const MATCH_TEAM_SCOREBOARD = 'get_match_team_scoreboard';

export const getMatchResults = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_RESULTS, uri.api.matchResults(id)));

export const getMatchScoreboards = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_SCOREBOARDS, uri.api.matchScoreboards(id)));

export const getMatchTeamScoreboard = (matchId, seasonTeamId) => dispatch =>
    dispatch(ajaxGet(MATCH_TEAM_SCOREBOARD, uri.api.matchTeamScoreboard(matchId, seasonTeamId)));

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
