/**
 * Created by Jenner Sanchez on 09/11/2018.
 */

export const webBaseUrl = '/app';
export const apiBaseUrl = '/api';

const uris = {
    web: {
        home: '/home',
        login: '/login',
        matchScoreboards: id => `/match/${id}/scoreboards`,
        matchSeasonTeamScoreboard: (matchId, seasonTeamId) => `/match/${matchId}/scoreboard/team/${seasonTeamId}`,
        error: '/error',
    },
    api: {
        // Current logged in player
        loggedInPlayer: '/player/auth-player',

        // Seasons data:
        seasons: '/season/index',
        currentSeason: '/season/current',
        seasonMatchdays: id => `/season/${id}/matchdays`,
        nextMatchday: '/season/next-matchday',
        nextMatchdayMatches: '/season/next-matchday-matches',

        // Teams data:
        teamPlayers: id => `/season-team/${id}/players`,

        // Matches data:
        matchResults: id => `/match/${id}/results`,
        matchScoreboards: id => `/match/${id}/scoreboards`,
        matchPlayerSeasonTeamId: (matchId, playerId) => `/match/${matchId}/player/${playerId}/season-team-id`,
        matchSeasonTeamScoreboard: (matchId, seasonTeamId) => `/match/${matchId}/season-team/${seasonTeamId}/scoreboard`,
        matchMyTeamAvailablePlayers: (matchId, seasonTeamId) => `/match/${matchId}/season-team/${seasonTeamId}/available-players`,
        matchSeasonTeamEndPhase: '/match/season-team-end-phase',

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
