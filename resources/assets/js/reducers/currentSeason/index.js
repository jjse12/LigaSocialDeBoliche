import { combineReducers } from 'redux';
import info from './info';
import nextMatchday from './nextMatchday';

export {
    getCurrentSeason
} from './info';

export default combineReducers({
    info,
    nextMatchday,
});
