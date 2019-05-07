import { createReducer, getActionCreatorHandlersObject } from "../../../utilities/reducerUtils";
import { ajaxPost, ajaxPatch, ajaxDelete } from "../../../utilities/action-creators";
import uri from "../../../services/uri";

export const MATCH_CREATE_NEW_GAME_SCORES = 'MATCH_CREATE_NEW_GAME_SCORES';
export const MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS = 'MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS';
export const MATCH_CREATE_SCORE = 'MATCH_CREATE_SCORE';
export const MATCH_UPDATE_SCORE = 'MATCH_UPDATE_SCORE';
export const MATCH_DELETE_SCORE = 'MATCH_DELETE_SCORE';

export const createMatchNewGameScores = (matchId, seasonTeamId, scoresData) => dispatch => {
    const data = {
        matchId: matchId,
        seasonTeamId: seasonTeamId,
        scores: scoresData,
    };
    return dispatch(ajaxPost(MATCH_CREATE_NEW_GAME_SCORES, uri.api.createMatchNewGameScores, data));
};

export const createMatchNewGameScoresForLastGamePlayers = (matchId, seasonTeamId) => dispatch => {
    const data = {
        matchId: matchId,
        seasonTeamId: seasonTeamId,
    };
    return dispatch(ajaxPost(MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS, uri.api.createMatchNewGameScoresForLastGamePlayers, data));
};

export const createScore = (matchId, seasonPlayerId, score, handicap) => dispatch => {
    const data = {
        match_id: matchId,
        season_player_id: seasonPlayerId,
        score: score,
        handicap: handicap
    };
    dispatch(ajaxPost(MATCH_CREATE_SCORE, uri.api.score, data));
};

export const updateScore = (scoreId, score = null, seasonPlayerId = null, handicap = null) => dispatch => {
    let data = { id: scoreId };
    if (seasonPlayerId != null)
        data.season_player_id = seasonPlayerId;
    if (score != null)
        data.score = score;
    if (handicap != null)
        data.handicap = handicap;

    return dispatch(ajaxPatch(MATCH_UPDATE_SCORE, uri.api.score, data));
};

export const deleteScore = (scoreId) => dispatch =>
    dispatch(ajaxDelete(MATCH_DELETE_SCORE, uri.api.scoreDelete(scoreId)));


export default createReducer({},{

        ...getActionCreatorHandlersObject([
            MATCH_CREATE_SCORE,
            MATCH_UPDATE_SCORE,
            MATCH_DELETE_SCORE
        ])
    }
);
