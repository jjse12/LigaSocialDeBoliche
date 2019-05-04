import uri from "../services/uri";
import {ajaxGet} from "../utilities/action-creators";
import {actionCreatorHandler, createReducer} from "../utilities/reducerUtils";

export const SEASON_MATCHDAYS = "SEASON_MATCHDAYS";

export const getSeasonMatchdays = (seasonId) => dispatch =>
    dispatch(ajaxGet(SEASON_MATCHDAYS, uri.api.seasonMatchdays(1)));

export default createReducer([], {
    [SEASON_MATCHDAYS]: actionCreatorHandler
});
