import uri from "../services/uri";
import {ajaxGet} from "../utilities/action-creators";

export const LOGGED_IN_PLAYER = "get_logged_in_player";

const initialState = {};

export const getLoggedInPlayer = () => dispatch =>
    dispatch(ajaxGet(LOGGED_IN_PLAYER, uri.api.loggedInPlayer));

export function loggedInPlayerReducer(state = initialState, action) {
    switch (action.type) {
        case LOGGED_IN_PLAYER:
            return action.data;
    }
    return state;
}
