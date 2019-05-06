import uri from '../../services/uri';
import { ajaxGet } from "../../utilities/action-creators";
import { actionCreatorHandler, createReducer } from "../../utilities/reducerUtils";

export const MATCH_SCOREBOARDS = 'MATCH_SCOREBOARDS';

export const getMatchScoreboards = matchId => dispatch =>
    dispatch(ajaxGet(MATCH_SCOREBOARDS, uri.api.matchScoreboards(matchId)));

export default createReducer({}, {
    [MATCH_SCOREBOARDS]: actionCreatorHandler
});
