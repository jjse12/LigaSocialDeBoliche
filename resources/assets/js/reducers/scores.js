import { ajaxPost, ajaxPatch, ajaxDelete } from "../utilities/action-creators";
import uri from "../services/uri";

export const SCORE_CREATE = 'score_create';
export const SCORE_UPDATE = 'score_update';
export const SCORE_DELETE = 'score_delete';

export const createScore = (seasonPlayerId, matchId, score, handicap) => dispatch => {
    const data = {
        season_player_id: seasonPlayerId,
        match_id: matchId,
        score: score,
        handicap: handicap
    };
    dispatch(ajaxPost(SCORE_CREATE, uri.api.score, data));
}

export const updateScore = (scoreId, score = null, seasonPlayerId = null, handicap = null) => dispatch => {
    let data = { id: scoreId };
    if (seasonPlayerId != null)
        data.season_player_id = seasonPlayerId;
    if (score != null)
        data.score = score;
    if (handicap != null)
        data.handicap = handicap;

    return dispatch(ajaxPatch(SCORE_UPDATE, uri.api.score, data));
};

export const deleteScore = (matchId, seasonTeamId) => dispatch =>
    dispatch(ajaxDelete(MATCH_TEAM_SCOREBOARD, uri.api.matchTeamScoreboard(matchId, seasonTeamId)));

export function scoreCreateReducer(state = {}, action) {
    switch (action.type) {
        case SCORE_CREATE:
            return action.data;
    }
    return state;
}

export function scoreUpdateReducer(state = {}, action) {
    switch (action.type) {
        case SCORE_UPDATE:
            return action.data;
    }
    return state;
}

export function scoreDeleteReducer(state = {}, action) {
    switch (action.type) {
        case SCORE_DELETE:
            return action.data;
    }
    return state;
}
