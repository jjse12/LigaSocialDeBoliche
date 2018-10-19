import uri from "../services/uri";
import {ajaxGet} from "../utilities/action-creators";

export const SEASON_MATCHDAYS = "get_season_matchdays";

const initialState = [];

export const getSeasonMatchdays = (seasonId) => dispatch =>
    dispatch(ajaxGet(SEASON_MATCHDAYS, uri.api.seasonMatchdays(1)));

export default function (state = initialState, action) {
    switch (action.type) {
        case SEASON_MATCHDAYS:
            return action.data;
    }
    return state;
}
