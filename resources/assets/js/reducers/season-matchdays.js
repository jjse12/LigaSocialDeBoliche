import axios from 'axios';
import uri from "../services/uri";

export const ACTION_TYPE_STRING = "get_season_matchdays";

const initialState = [];

export const getSeasonMatchdays = (seasonId) => dispatch => {
    axios.get(uri.api.seasonMatchdays(1))
        .then(response => {
            dispatch({
                type: ACTION_TYPE_STRING,
                seasonMatchdays: response.data
            })
        });
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE_STRING:
            return action.seasonMatchdays;
    }
    return state;
}
