import { ajaxGet } from "../utilities/action-creators";
import uri from "../services/uri";

export const TEAM_PLAYERS = 'get_team_players';
// export const MATCH_SCOREBOARDS = 'get_match_scoreboards';
// export const MATCH_TEAM_SCOREBOARD = 'get_match_team_scoreboard';

export const getTeamPlayers = (id) => dispatch =>
    dispatch(ajaxGet(TEAM_PLAYERS, uri.api.teamPlayers(id)));
/*

export const getMatchScoreboards = (id) => dispatch =>
    dispatch(ajaxGet(MATCH_SCOREBOARDS, uri.api.matchScoreboards(id)));

export const getMatchTeamScoreboard = (matchId, seasonTeamId) => dispatch =>
    dispatch(ajaxGet(MATCH_TEAM_SCOREBOARD, uri.api.matchTeamScoreboard(matchId, seasonTeamId)));
*/

export function teamPlayersReducer(state = {}, action) {
    switch (action.type) {
        case TEAM_PLAYERS:
            return action.data;
    }
    return state;
}
/*

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
*/
