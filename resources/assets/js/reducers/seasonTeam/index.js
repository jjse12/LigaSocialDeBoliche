import { combineReducers } from 'redux';
import info from './info';
import players from './players';

export {
    getSeasonTeamInfo
} from './info';

export {
    SEASON_TEAM_PLAYERS,
    getSeasonTeamPlayers
} from './players';

export default combineReducers({
    info,
    players,
});
