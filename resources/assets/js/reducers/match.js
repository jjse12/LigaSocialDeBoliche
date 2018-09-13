import axios from 'axios';
import uri from "../services/uri";

export const ACTION_TYPE_MATCH_RESULTS = 'get_match_results';
export const ACTION_TYPE_MATCH_SCOREBOARDS = 'get_match_scoreboards';
export const ACTION_TYPE_MATCH_TEAM_SCOREBOARD = 'get_match_team_scoreboard';

export const getMatchResults = (id) => dispatch => {
    axios.get(uri.api.matchResults(id))
        .then(response => {
            dispatch({
                type: ACTION_TYPE_MATCH_RESULTS,
                data: response.data
            })
        });
};

export const getMatchScoreboards = (id) => dispatch => {
    axios.get(uri.api.matchScoreboards(id))
        .then(response => {
            dispatch({
                type: ACTION_TYPE_MATCH_SCOREBOARDS,
                data: response.data
            })
        });
};

export const getMatchTeamScoreboard = (matchId, seasonTeamId) => dispatch => {
    axios.get(uri.api.matchTeamScoreboard(matchId, seasonTeamId))
        .then(response => {
            dispatch({
                type: ACTION_TYPE_MATCH_SCOREBOARDS,
                data: response.data
            })
        });
};

export function matchResultsReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_MATCH_RESULTS:
            return action.data;
    }
    return state;
}

export function matchScoreboardsReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_MATCH_SCOREBOARDS:
            return action.data;
    }
    return state;
}

export function matchTeamScoreboardReducer(state = {}, action) {
    switch (action.type) {
        case ACTION_TYPE_MATCH_TEAM_SCOREBOARD:
            return action.data;
    }
    return state;
}
