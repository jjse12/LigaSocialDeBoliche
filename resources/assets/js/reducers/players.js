import uri from "../services/uri";
import { createReducer, actionCreatorHandler } from '../utilities/reducerUtils';
import {ajaxGet} from "../utilities/action-creators";

export const LOGGED_IN_PLAYER = "USER";

export const getLoggedInPlayer = () => dispatch =>
    dispatch(ajaxGet(LOGGED_IN_PLAYER, uri.api.loggedInPlayer));

export default createReducer({}, {
    [LOGGED_IN_PLAYER]: actionCreatorHandler
});
