import { ajaxGet } from "../../utilities/action-creators";
import { createReducer, actionCreatorHandler } from '../../utilities/reducerUtils';
import uri from '../../services/uri';

const initialState = {};

export const MATCH_INFO = 'MATCH_INFO';

export const getMatchInfo = id => dispatch => dispatch(ajaxGet(MATCH_INFO, uri.api.matchInfo(id)));

export default createReducer(initialState, {
    [MATCH_INFO]: actionCreatorHandler
});
