import { combineReducers } from 'redux';

import info from './info';

export {
    getMatchInfo
} from './info';

export default combineReducers({
    info
});
