/**
 * Created by Jenner Sanchez on 09/11/2018.
 */

export const webBaseUrl = '/app';
export const apiBaseUrl = '/api';

const uris = {
    web: {
        login: '/login',
        home: '/home',

        error: '/error',
    },
    api: {
        seasons: '/season/index',
        seasonMatchdays: id => `/season/${id}/matchdays`,
        nextMatchday: '/season/next-matchday',
        nextMatchdayMatches: '/season/next-matchday-matches',
        match: '/match',
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
