import { combineReducers } from 'redux';

import summary, {MATCH_SUMMARY} from './summary';
import scoreboards from './scoreboards';
import edition from './edition';

export {
    MATCH_SUMMARY,
    getMatchSummary
} from './summary';

export {
    MATCH_SCOREBOARDS,
    getMatchScoreboards
} from './scoreboards';

export {
    MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS,
    MATCH_PLAYER_SELECTION_LAST_GAME_PLAYERS,
    setPlayersSelectionDialogOpen,
    getMatchTeamAvailablePlayers,
    getMatchTeamLastGamePlayers,
    setNewGameDialogOpen,
    MATCH_CREATE_NEW_GAME_SCORES,
    MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS,
    MATCH_CREATE_SCORE,
    MATCH_UPDATE_SCORE,
    MATCH_DELETE_SCORE,
    createMatchNewGameScores,
    createMatchNewGameScoresForLastGamePlayers,
    createScore,
    updateScore,
    deleteScore,
    setEndPhaseDialogOpen,
    matchTeamEndPhase,
    setMatchUserTeamOfflineScoreboard,
    setMatchRivalTeamOfflineScoreboard,
} from './edition';

export default combineReducers({
    summary,
    scoreboards,
    edition,
});
