import { combineReducers } from 'redux';

import info from './info';
import results from './results';
import scoreboards from './scoreboards';
import edition from './edition';

export {
    getMatchInfo
} from './info';

export {
    getMatchResults
} from './results';

export {
    getMatchScoreboards
} from './scoreboards';

export {
    matchTeamEndPhase,
    getMatchTeamAvailablePlayers,
    setMatchUserTeamOfflineScoreboard,
    setMatchRivalTeamOfflineScoreboard,
} from './edition';

export default combineReducers({
    info,
    results,
    scoreboards,
    edition
});
