
import {isFetchingFromStore} from "../utilities/action-creators";
import {MATCH_SCOREBOARDS, MATCH_TEAM_SCOREBOARD} from "./matches";
import {SCORE_CREATE, SCORE_DELETE, SCORE_UPDATE} from "./scores";

// Season
export const getCurrentSeasonFromStore = store => store.currentSeason;
export const getNextMatchdayFromStore = store => store.nextMatchday;
export const getNextMatchdayMatchesFromStore = store => store.nextMatchdayMatches;

// Teams
export const getTeamPlayersFromStore = store => store.teamPlayers;

// Matches
export const getMatchResultsFromStore = store => store.matchResults;
export const getMatchScoreboardsFromStore = store => store.matchScoreboards;
export const getMatchScoreboardsFetchingFromStore = store => isFetchingFromStore(store, MATCH_SCOREBOARDS);
export const getMatchTeamScoreboardFromStore = store => store.matchTeamScoreboard;
export const getMatchTeamScoreboardFetchingFromStore = store => isFetchingFromStore(store, MATCH_TEAM_SCOREBOARD);

// Scores
export const createScoreFetchingFromStore = store => isFetchingFromStore(store, SCORE_CREATE);
export const updateScoreFetchingFromStore = store => isFetchingFromStore(store, SCORE_UPDATE);
export const deleteScoreFetchingFromStore = store => isFetchingFromStore(store, SCORE_DELETE);
