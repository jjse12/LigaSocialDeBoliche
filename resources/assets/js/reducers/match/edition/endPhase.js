import { createReducer, actionCreatorHandler } from "../../../utilities/reducerUtils";
import {ajaxPost} from "../../../utilities/action-creators";
import uri from "../../../services/uri";
import {MATCH_NEW_GAME_DIALOG_OPEN} from "./newGame";

const initialState = {
    isDialogOpen: false,
};

const MATCH_TEAM_END_PHASE_DIALOG_OPEN = 'MATCH_TEAM_END_PHASE_DIALOG_OPEN';
const MATCH_TEAM_END_PHASE = 'MATCH_TEAM_END_PHASE';

export const setEndPhaseDialogOpen = isDialogOpen => ({
    isDialogOpen,
    type: MATCH_TEAM_END_PHASE_DIALOG_OPEN,
});

export const matchTeamEndPhase = (matchId, seasonTeamId, phase) => dispatch => {
    const data = {
        match: matchId,
        seasonTeamId: seasonTeamId,
        phase: phase
    };
    return dispatch(ajaxPost(MATCH_TEAM_END_PHASE, uri.api.matchTeamEndPhase, data));
};

function handleSetDialogOpen(state, { isDialogOpen }) {
    return { ...state, isDialogOpen };
}

export default createReducer(initialState, {
    [MATCH_TEAM_END_PHASE_DIALOG_OPEN]: handleSetDialogOpen,
    [MATCH_TEAM_END_PHASE]: actionCreatorHandler
});
