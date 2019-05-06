import uri from '../../services/uri';
import { ajaxGet } from "../../utilities/action-creators";
import { actionCreatorHandler, createReducer } from "../../utilities/reducerUtils";

export const MATCH_RESULTS = 'MATCH_RESULTS';

export const getMatchResults = matchId => dispatch =>
    dispatch(ajaxGet(MATCH_RESULTS, uri.api.matchResults(matchId)));

export default createReducer({}, {
    [MATCH_RESULTS]: actionCreatorHandler
});
