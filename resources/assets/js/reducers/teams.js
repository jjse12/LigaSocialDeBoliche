import { ajaxGet } from "../utilities/action-creators";
import { createReducer, actionCreatorHandler } from "../utilities/reducerUtils";
import uri from "../services/uri";

export const SEASON_TEAM_PLAYERS = 'SEASON_TEAM_PLAYERS';

export const getSeasonTeamPlayers = (id) => dispatch =>
    dispatch(ajaxGet(SEASON_TEAM_PLAYERS, uri.api.teamPlayers(id)));

export default createReducer({}, {
    [SEASON_TEAM_PLAYERS]: actionCreatorHandler
});

