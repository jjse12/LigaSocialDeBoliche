import uri from '../../../services/uri';
import { ajaxGet } from "../../../utilities/action-creators";
import {
    createReducer,
    actionCreatorHandler,
} from "../../../utilities/reducerUtils";

const initialState = {
    availablePlayers: [],
    isDialogOpen: false,
};

export const MATCH_PLAYER_SELECTION_DIALOG_OPEN = 'MATCH_EDITION_PLAYER_SELECTION_DIALOG_OPEN';
export const MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS = 'MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS';

export const setPlayerSelectionDialogOpen = isDialogOpen => ({
   isDialogOpen,
   type: MATCH_PLAYER_SELECTION_DIALOG_OPEN
});

export const setAvailablePlayers = ( availablePlayers = [] ) => ({
    availablePlayers,
    type: MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS
});

export const getMatchTeamAvailablePlayers = (matchId, seasonTeamId) => dispatch => (
    dispatch(ajaxGet(
        MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS,
        uri.api.matchTeamAvailablePlayers(matchId, seasonTeamId)
    ))
);

function handleSetDialogOpen(state, { isDialogOpen }) {
    return { ...state, isDialogOpen };
}

function handleSetAvailablePlayers(state, { data: availablePlayers}) {
    return { ...state, availablePlayers };
}

export default createReducer(initialState, {
    [MATCH_PLAYER_SELECTION_DIALOG_OPEN]: handleSetDialogOpen,
    [MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS]: handleSetAvailablePlayers
});
