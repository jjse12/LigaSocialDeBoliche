import { combineReducers } from 'redux';

import newGame from './newGame';
import playerSelection from './playerSelection';
import scores from './scores';
import endPhase from './endPhase';
import offlineScoreboards from './offlineScoreboards';

export {
    setNewGameDialogOpen,
} from './newGame';

export {
    MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS,
    getMatchTeamAvailablePlayers,
    setPlayerSelectionDialogOpen,
} from './playerSelection';

export {
    MATCH_CREATE_NEW_GAME_SCORES,
    MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS,
    MATCH_CREATE_SCORE,
    MATCH_DELETE_SCORE,
    MATCH_UPDATE_SCORE,
    createMatchNewGameScores,
    createMatchNewGameScoresForLastGamePlayers,
    createScore,
    deleteScore,
    updateScore,
} from "./scores";

export {
    setEndPhaseDialogOpen,
    matchTeamEndPhase
} from './endPhase';

export {
    setMatchUserTeamOfflineScoreboard,
    setMatchRivalTeamOfflineScoreboard,
} from './offlineScoreboards';

export default combineReducers({
    newGame,
    playerSelection,
    scores,
    endPhase,
    offlineScoreboards,
});
