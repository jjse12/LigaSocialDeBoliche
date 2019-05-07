import { createReducer } from "../../../utilities/reducerUtils";

export const MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD = 'MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD';
export const MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD = 'MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD';

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

function handleSetOfflineScoreboard(state, { team, scoreboard }) {
    const newState = {
        [team]: scoreboard
    };
    return { ...state, newState };
}

export default createReducer(offlineScoreboardInitialState, {
    [MATCH_EDITION_USER_TEAM_OFFLINE_SCOREBOARD]: handleSetOfflineScoreboard,
    [MATCH_EDITION_RIVAL_TEAM_OFFLINE_SCOREBOARD]: handleSetOfflineScoreboard,
});
