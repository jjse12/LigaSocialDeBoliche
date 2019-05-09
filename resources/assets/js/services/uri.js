/**
 * Created by Jenner Sanchez on 09/11/2018.
 */

export const webBaseUrl = '/app';
export const apiBaseUrl = '/api';

const uris = {
    web: {
        home: '/home',
        login: '/login',
        match: id => `/match/${id}`,
        matchSeasonTeamScoreboard: (matchId, seasonTeamId) => `/match/${matchId}/scoreboard/team/${seasonTeamId}`,
        error: '/error',
    },
    api: {
        // Current logged in user (a player)
        user: '/player/auth-player',

        // Seasons data:
        seasons: '/season/index',
        currentSeason: '/season/current',
        currentSeasonMatchdays: '/season/current/matchdays',
        currentSeasonNextMatchday: '/season/current/next-matchday',
        currentSeasonNextMatchdayMatches: '/season/current/next-matchday-matches',

        // Season Teams data:
        seasonTeamInfo: id => `/season-team/${id}/`,
        seasonTeamPlayers: id => `/season-team/${id}/players`,

        // Matches data:
        matchSummary: id => `/match/${id}/summary`,
        matchScoreboards: id => `/match/${id}/scoreboards`,
        matchTeamAvailablePlayers: (matchId, seasonTeamId) =>
            `/match/${matchId}/season-team/${seasonTeamId}/available-players`,
        matchTeamLastGamePlayers: (matchId, seasonTeamId) =>
            `/match/${matchId}/season-team/${seasonTeamId}/last-game-players`,
        matchSeasonTeamScoreboard: (matchId, seasonTeamId) =>
            `/match/${matchId}/season-team/${seasonTeamId}/scoreboard`,
        matchTeamEndPhase: '/match/team-end-phase',

        // Scores
        createMatchNewGameScores: '/score/match-new-game-scores',
        createMatchNewGameScoresForLastGamePlayers: '/score/match-new-game-scores-for-last-game-players',
        score: '/score',
        scoreDelete: scoreId => `/score/${scoreId}`,
    }
};


function prependBaseUrl(baseUrl, object) {
    if (!object) {
        return {};
    }
    return Object.keys(object).reduce((newObject, key) => ({
        ...newObject,
        [key]: typeof object[key] === 'function' ? (...args) => `${baseUrl}${object[key](...args)}`: `${baseUrl}${object[key]}`,
    }), {});
}

export default {
    web: prependBaseUrl(webBaseUrl, uris.web),
    api: {...prependBaseUrl(apiBaseUrl, uris.api)}
};
