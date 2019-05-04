import uri from "../../services/uri";
import {createReducer, getActionCreatorHandlersObject} from "../../utilities/reducerUtils";
import { ajaxGet } from "../../utilities/action-creators";

export const CURRENT_SEASON_NEXT_MATCHDAY = 'CURRENT_SEASON_NEXT_MATCHDAY';
export const CURRENT_SEASON_NEXT_MATCHDAY_MATCHES = 'CURRENT_SEASON_NEXT_MATCHDAY_MATCHES';

export const getNextMatchday = () => dispatch =>
    dispatch(ajaxGet(CURRENT_SEASON_NEXT_MATCHDAY, uri.api.nextMatchday));

export const getNextMatchdayMatches = () => dispatch =>
    dispatch(ajaxGet(CURRENT_SEASON_NEXT_MATCHDAY_MATCHES, uri.api.nextMatchdayMatches));

export default createReducer({}, getActionCreatorHandlersObject([
    CURRENT_SEASON_NEXT_MATCHDAY,
    CURRENT_SEASON_NEXT_MATCHDAY_MATCHES
]));
