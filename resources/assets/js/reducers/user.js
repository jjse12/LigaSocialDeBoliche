import uri from "../services/uri";
import { createReducer, actionCreatorHandler } from '../utilities/reducerUtils';
import { ajaxGet } from "../utilities/action-creators";

export const USER = "USER";

export const getUser = () => dispatch =>
    dispatch(ajaxGet(USER, uri.api.user));

export default createReducer({}, {
    [USER]: actionCreatorHandler
});
