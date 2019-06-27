import uri from '../../../services/uri';
import { ajaxGet } from "../../../utilities/action-creators";
import {
    createReducer,
    actionCreatorHandler,
} from "../../../utilities/reducerUtils";

const initialState = {
    isDialogOpen: false,
    availablePlayers: [],
    lastGamePlayers: [],
};

export const MATCH_PLAYER_SELECTION_DIALOG_OPEN = 'MATCH_EDITION_PLAYER_SELECTION_DIALOG_OPEN';
export const MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS = 'MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS';
export const MATCH_PLAYER_SELECTION_LAST_GAME_PLAYERS = 'MATCH_PLAYER_SELECTION_LAST_GAME_PLAYERS';

export const setPlayersSelectionDialogOpen = isDialogOpen => ({
   isDialogOpen,
   type: MATCH_PLAYER_SELECTION_DIALOG_OPEN
});

export const getMatchTeamAvailablePlayers = (matchId, seasonTeamId) => dispatch => (
    dispatch(ajaxGet(
        MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS,
        uri.api.matchTeamAvailablePlayers(matchId, seasonTeamId)
    ))
);

export const getMatchTeamLastGamePlayers = (matchId, seasonTeamId) => dispatch => (
    dispatch(ajaxGet(
        MATCH_PLAYER_SELECTION_LAST_GAME_PLAYERS,
        uri.api.matchTeamLastGamePlayers(matchId, seasonTeamId)
    ))
);

function handleSetDialogOpen(state, { isDialogOpen }) {
    return { ...state, isDialogOpen };
}

function handleSetAvailablePlayers(state, { data: availablePlayers}) {
    return { ...state, availablePlayers };
}

function handleSetLastGamePlayers(state, { data: lastGamePlayers}) {
    return { ...state, lastGamePlayers };
}

export default createReducer(initialState, {
    [MATCH_PLAYER_SELECTION_DIALOG_OPEN]: handleSetDialogOpen,
    [MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS]: handleSetAvailablePlayers,
    [MATCH_PLAYER_SELECTION_LAST_GAME_PLAYERS]: handleSetLastGamePlayers,
});
