import { createReducer } from "../../../utilities/reducerUtils";

const initialState = {
    isDialogOpen: false,
};

export const MATCH_NEW_GAME_DIALOG_OPEN = 'MATCH_NEW_GAME_DIALOG_OPEN';

export const setNewGameDialogOpen = isDialogOpen => ({
   isDialogOpen,
   type: MATCH_NEW_GAME_DIALOG_OPEN
});

function handleSetDialogOpen(state, { isDialogOpen }) {
    return { ...state, isDialogOpen };
}

export default createReducer(initialState, {
    [MATCH_NEW_GAME_DIALOG_OPEN]: handleSetDialogOpen
});
