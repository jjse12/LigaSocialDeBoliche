import uri from "../../services/uri";
import { createReducer, actionCreatorHandler } from "../../utilities/reducerUtils";
import { ajaxGet } from "../../utilities/action-creators";

export const SEASON_TEAM_INFO = 'SEASON_TEAM_INFO';

export const getSeasonTeamInfo = id => dispatch =>
    dispatch(ajaxGet(SEASON_TEAM_INFO, uri.api.seasonTeamInfo));

export default createReducer({}, {
    [SEASON_TEAM_INFO]: actionCreatorHandler
});
