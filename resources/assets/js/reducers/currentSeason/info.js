import uri from "../../services/uri";
import { createReducer, actionCreatorHandler } from "../../utilities/reducerUtils";
import { ajaxGet } from "../../utilities/action-creators";

export const CURRENT_SEASON_INFO = 'CURRENT_SEASON_INFO';

export const getCurrentSeason = () => dispatch => dispatch(ajaxGet(CURRENT_SEASON_INFO, uri.api.currentSeason));

export default createReducer({}, {
    [CURRENT_SEASON_INFO]: actionCreatorHandler
});
