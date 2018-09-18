
import {isFetchingFromStore} from "../utilities/action-creators";
import {MATCH_SCOREBOARDS, MATCH_TEAM_SCOREBOARD} from "./matches";

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
