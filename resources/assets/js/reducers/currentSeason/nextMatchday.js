import uri from "../../services/uri";
import {createReducer, getActionCreatorHandlersObject} from "../../utilities/reducerUtils";
import { ajaxGet } from "../../utilities/action-creators";

export const CURRENT_SEASON_NEXT_MATCHDAY = 'CURRENT_SEASON_NEXT_MATCHDAY';
export const CURRENT_SEASON_NEXT_MATCHDAY_MATCHES = 'CURRENT_SEASON_NEXT_MATCHDAY_MATCHES';

export const getCurrentSeasonNextMatchday = () => dispatch =>
    dispatch(ajaxGet(CURRENT_SEASON_NEXT_MATCHDAY, uri.api.currentSeasonNextMatchday));

export const getCurrentSeasonNextMatchdayMatches = () => dispatch =>
    dispatch(ajaxGet(CURRENT_SEASON_NEXT_MATCHDAY_MATCHES, uri.api.currentSeasonNextMatchdayMatches));

export default createReducer({}, getActionCreatorHandlersObject([
    CURRENT_SEASON_NEXT_MATCHDAY,
    CURRENT_SEASON_NEXT_MATCHDAY_MATCHES
]));
