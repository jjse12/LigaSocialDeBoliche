import uri from "../../services/uri";
import {ajaxGet} from "../../utilities/action-creators";
import {actionCreatorHandler, createReducer} from "../../utilities/reducerUtils";

export const CURRENT_SEASON_MATCHDAYS = "CURRENT_SEASON_MATCHDAYS";

export const getCurrentSeasonMatchdays = () => dispatch =>
    dispatch(ajaxGet(CURRENT_SEASON_MATCHDAYS, uri.api.currentSeasonMatchdays(1)));

export default createReducer([], {
    [CURRENT_SEASON_MATCHDAYS]: actionCreatorHandler
});
