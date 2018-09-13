import axios from 'axios';
import uri from "../services/uri";

export const ACTION_TYPE_CURRENT_SEASON = 'get_current_season';
export const ACTION_TYPE_NEXT_MATCHDAY = 'get_next_matchday';
export const ACTION_TYPE_NEXT_MATCHDAY_MATCHES = 'get_next_matchday_matches';

const initialState = [];

export const getCurrentSeason = () => dispatch => {
    axios.get(uri.api.currentSeason)
        .then(response => {
            dispatch({
                type: ACTION_TYPE_CURRENT_SEASON,
                currentSeason: response.data
            })
        });
};

export const getNextMatchday = () => dispatch => {
    axios.get(uri.api.nextMatchday)
        .then(response => {
            dispatch({
                type: ACTION_TYPE_NEXT_MATCHDAY,
                nextMatchday: response.data
            })
        });
};

export const getNextMatchdayMatches = () => dispatch => {
    axios.get(uri.api.nextMatchdayMatches)
        .then(response => {
            dispatch({
                type: ACTION_TYPE_NEXT_MATCHDAY_MATCHES,
                nextMatchdayMatches: response.data
            })
        });
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE_CURRENT_SEASON:
            return action.currentSeason;
        case ACTION_TYPE_NEXT_MATCHDAY:
            return action.nextMatchday;
        case ACTION_TYPE_NEXT_MATCHDAY_MATCHES:
            return action.nextMatchdayMatches;
    }
    return state;
}
