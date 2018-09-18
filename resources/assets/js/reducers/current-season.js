import uri from "../services/uri";
import {ajaxGet} from "../utilities/action-creators";

export const ACTION_TYPE_CURRENT_SEASON = 'get_current_season';
export const ACTION_TYPE_NEXT_MATCHDAY = 'get_next_matchday';
export const ACTION_TYPE_NEXT_MATCHDAY_MATCHES = 'get_next_matchday_matches';

export const getCurrentSeason = () => dispatch =>
    dispatch(ajaxGet(ACTION_TYPE_CURRENT_SEASON, uri.api.currentSeason));

export const getNextMatchday = () => dispatch =>
    dispatch(ajaxGet(ACTION_TYPE_NEXT_MATCHDAY, uri.api.nextMatchday));

export const getNextMatchdayMatches = () => dispatch =>
    dispatch(ajaxGet(ACTION_TYPE_NEXT_MATCHDAY_MATCHES, uri.api.nextMatchdayMatches));

export function currentSeasonReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_CURRENT_SEASON:
            return action.data;
    }
    return state;
}

export function nextMatchdayReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_NEXT_MATCHDAY:
            return action.data;
    }
    return state;
}

export function nextMatchdayMatchesReducer(state = [], action) {
    switch (action.type) {
        case ACTION_TYPE_NEXT_MATCHDAY_MATCHES:
            return action.data;
    }
    return state;
}
