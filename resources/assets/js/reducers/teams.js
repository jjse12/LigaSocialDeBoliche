import { ajaxGet } from "../utilities/action-creators";
import uri from "../services/uri";

export const SEASON_TEAM_PLAYERS = 'get_team_players';

export const getSeasonTeamPlayers = (id) => dispatch =>
    dispatch(ajaxGet(SEASON_TEAM_PLAYERS, uri.api.teamPlayers(id)));

export function seasonTeamPlayersReducer(state = {}, action) {
    switch (action.type) {
        case SEASON_TEAM_PLAYERS:
            return action.data;
    }
    return state;
}
