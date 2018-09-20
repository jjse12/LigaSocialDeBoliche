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
        matchTeamScoreboard: (matchId, seasonTeamId) => `/match/${matchId}/scoreboard/team/${seasonTeamId}`,
        error: '/error',
    },
    api: {
        // Seasons data:
        seasons: '/season/index',
        currentSeason: '/season/current',
        seasonMatchdays: id => `/season/${id}/matchdays`,
        nextMatchday: '/season/next-matchday',
        nextMatchdayMatches: '/season/next-matchday-matches',
        // Teams data:
        teamPlayers: id => `/team/${id}/players`,
        // Matches data:
        matchResults: id => `/match/${id}/results`,
        matchScoreboards: id => `/match/${id}/scoreboards`,
        matchTeamScoreboard: (matchId, seasonTeamId) => `/match/${matchId}/scoreboard/team/${seasonTeamId}`,
        // Scores
        score: '/score',
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
