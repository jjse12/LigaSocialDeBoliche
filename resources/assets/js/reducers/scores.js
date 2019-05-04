import { ajaxPost, ajaxPatch, ajaxDelete } from "../utilities/action-creators";
import uri from "../services/uri";

export const CREATE_MATCH_NEW_GAME_SCORES = 'create_match_new_game_scores';
export const CREATE_MATCH_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS = 'create_match_new_game_scores_for_last_game_players';
export const CREATE_SCORE = 'CREATE_SCORE';
export const UPDATE_SCORE = 'UPDATE_SCORE';
export const DELETE_SCORE = 'DELETE_SCORE';

export const createMatchNewGameScores = (matchId, seasonTeamId, scoresData) => dispatch => {
    const data = {
        matchId: matchId,
        seasonTeamId: seasonTeamId,
        scores: scoresData,
    };
    return dispatch(ajaxPost(CREATE_MATCH_NEW_GAME_SCORES, uri.api.createMatchNewGameScores, data));
};

export const createMatchNewGameScoresForLastGamePlayers = (matchId, seasonTeamId) => dispatch => {
    const data = {
        matchId: matchId,
        seasonTeamId: seasonTeamId,
    };
    return dispatch(ajaxPost(CREATE_MATCH_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS, uri.api.createMatchNewGameScoresForLastGamePlayers, data));
};

export const createScore = (matchId, seasonPlayerId, score, handicap) => dispatch => {
    const data = {
        match_id: matchId,
        season_player_id: seasonPlayerId,
        score: score,
        handicap: handicap
    };
    dispatch(ajaxPost(CREATE_SCORE, uri.api.score, data));
};

export const updateScore = (scoreId, score = null, seasonPlayerId = null, handicap = null) => dispatch => {
    let data = { id: scoreId };
    if (seasonPlayerId != null)
        data.season_player_id = seasonPlayerId;
    if (score != null)
        data.score = score;
    if (handicap != null)
        data.handicap = handicap;

    return dispatch(ajaxPatch(UPDATE_SCORE, uri.api.score, data));
};

export const deleteScore = (scoreId) => dispatch =>
    dispatch(ajaxDelete(DELETE_SCORE, uri.api.scoreDelete(scoreId)));

export function scoreCreateReducer(state = {}, action) {
    switch (action.type) {
        case CREATE_SCORE:
            return action.data;
    }
    return state;
}

export function scoreUpdateReducer(state = {}, action) {
    switch (action.type) {
        case UPDATE_SCORE:
            return action.data;
    }
    return state;
}

export function scoreDeleteReducer(state = {}, action) {
    switch (action.type) {
        case DELETE_SCORE:
            return action.data;
    }
    return state;
}
