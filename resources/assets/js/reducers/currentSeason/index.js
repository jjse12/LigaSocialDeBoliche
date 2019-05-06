import { combineReducers } from 'redux';
import info from './info';
import matchdays from './matchdays';
import nextMatchday from './nextMatchday';

export {
    getCurrentSeason
} from './info';

export {
    getCurrentSeasonMatchdays
} from './matchdays';

export {
    getCurrentSeasonNextMatchday,
    getCurrentSeasonNextMatchdayMatches,
} from './nextMatchday';

export default combineReducers({
    info,
    matchdays,
    nextMatchday,
});
