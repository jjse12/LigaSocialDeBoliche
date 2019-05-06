import uri from '../../services/uri';
import {ajaxGet, ajaxPost} from "../../utilities/action-creators";
import { combineReducers } from "redux";
import {
    createReducer,
    actionCreatorHandler,
} from "../../utilities/reducerUtils";

export const MATCH_EDITION_USER_TEAM_AVAILABLE_PLAYERS = 'MATCH_EDITION_USER_TEAM_AVAILABLE_PLAYERS';
export const MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD = 'MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD';
export const MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD = 'MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD';
export const MATCH_EDITION_USER_TEAM_END_PHASE = 'MATCH_EDITION_USER_TEAM_END_PHASE';

const totalsObject = title => {
    return {
        title: title,
        firstGame: 0,
        secondGame: 0,
        thirdGame: 0,
        total: 0
    }
};

const offlineScoreboardInitialState = {
    userTeam: {
        playersScores: [],
        gamesTotals: [
            totalsObject('Pin neto'),
            totalsObject('Handicap'),
            totalsObject('Total')
        ]
    },
    rivalTeam: {
        playersScores: [],
        gamesTotals: [
            totalsObject('Pin neto'),
            totalsObject('Handicap'),
            totalsObject('Total')
        ]
    }
};

export const getMatchTeamAvailablePlayers = (matchId, seasonTeamId) => dispatch => {
    return dispatch(
        ajaxGet(
            MATCH_EDITION_USER_TEAM_AVAILABLE_PLAYERS,
            uri.api.matchTeamAvailablePlayers(matchId, seasonTeamId)
        )
    );
};

export const setMatchUserTeamOfflineScoreboard = scoreboard => ({
    team: 'userTeam',
    scoreboard: scoreboard,
    type: MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD,
});

export const setMatchRivalTeamOfflineScoreboard = scoreboard => ({
    team: 'rivalTeam',
    scoreboard: scoreboard,
    type: MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD,
});


export const matchTeamEndPhase = (matchId, seasonTeamId, phase) => dispatch => {
    const data = {
        match: matchId,
        seasonTeamId: seasonTeamId,
        phase: phase
    };
    return dispatch(ajaxPost(MATCH_EDITION_USER_TEAM_END_PHASE, uri.api.matchTeamEndPhase, data));
};

const userTeamAvailablePlayers = createReducer({}, {
    [MATCH_EDITION_USER_TEAM_AVAILABLE_PLAYERS]: actionCreatorHandler
});

function handleSetOfflineScoreboard(state, { team, scoreboard }) {
    const newState = {
        [team]: scoreboard
    };
    return { ...state, newState };
}

const offlineScoreboards = createReducer(offlineScoreboardInitialState, {
    [MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD]: handleSetOfflineScoreboard,
    [MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD]: handleSetOfflineScoreboard,
});

export default combineReducers({
    userTeamAvailablePlayers,
    offlineScoreboards,
});
