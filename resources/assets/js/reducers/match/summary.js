import { ajaxGet } from "../../utilities/action-creators";
import { createReducer, actionCreatorHandler } from '../../utilities/reducerUtils';
import uri from '../../services/uri';

const initialState = {
    id: 0,
    statusData: {
        status: '',
        phase: '',
        diffForHumans: '',
    },
    date: '',
    matchdayNumber: 0,
    isRedPinGame: false,
    isVirtualGame: false,
    results: {
        team1: {
            name: '',
            category: '',
            points: 0,
            pins: 0,
            lane: 0
        },
        team2: {
            name: '',
            category: '',
            points: 0,
            pins: 0,
            lane: 0
        }
    }
};

export const MATCH_SUMMARY = 'MATCH_SUMMARY';

export const getMatchSummary = id => dispatch => dispatch(ajaxGet(MATCH_SUMMARY, uri.api.matchSummary(id)));

export default createReducer(initialState, {
    [MATCH_SUMMARY]: actionCreatorHandler
});
