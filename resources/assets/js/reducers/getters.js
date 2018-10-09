
import {isFetchingFromStore} from "../utilities/action-creators";
import {MATCH_MY_TEAM_AVAILABLE_PLAYERS, MATCH_SCOREBOARDS, MATCH_TEAM_SCOREBOARD} from "./matches";
import {SCORE_CREATE, SCORE_DELETE, SCORE_UPDATE} from "./scores";
import {SEASON_TEAM_PLAYERS} from "./teams";

// Logged in player
export const getLoggedInPlayerFromStore = store => store.loggedInPlayer;

// Season
export const getCurrentSeasonFromStore = store => store.currentSeason;
export const getNextMatchdayFromStore = store => store.nextMatchday;
export const getNextMatchdayMatchesFromStore = store => store.nextMatchdayMatches;

// Teams
export const getSeasonTeamPlayersFromStore = store => store.teamPlayers;
export const getSeasonTeamPlayersFetchingFromStore = store => isFetchingFromStore(store, SEASON_TEAM_PLAYERS);

// Matches
export const getMatchResultsFromStore = store => store.matchResults;
export const getMatchPlayerSeasonTeamIdFromStore = store => store.matchPlayerSeasonTeamId;
export const getMatchScoreboardsFromStore = store => store.matchScoreboards;
export const getMatchScoreboardsFetchingFromStore = store => isFetchingFromStore(store, MATCH_SCOREBOARDS);
export const getMatchSeasonTeamScoreboardFromStore = store => store.matchSeasonTeamScoreboard;
export const getMatchSeasonTeamScoreboardFetchingFromStore = store => isFetchingFromStore(store, MATCH_TEAM_SCOREBOARD);
export const getMatchMyTeamAvailablePlayersFromStore = store => store.matchMyTeamAvailablePlayers;
export const getMatchMyTeamAvailablePlayersFetchingFromStore = store => isFetchingFromStore(store, MATCH_MY_TEAM_AVAILABLE_PLAYERS);
export const getMatchMyTeamOfflineScoreboardFromStore = store => store.matchMyTeamOfflineScoreboard;
export const getMatchRivalTeamOfflineScoreboardFromStore = store => store.matchRivalTeamOfflineScoreboard;

// Scores
export const createScoreFetchingFromStore = store => isFetchingFromStore(store, SCORE_CREATE);
export const updateScoreFetchingFromStore = store => isFetchingFromStore(store, SCORE_UPDATE);
export const deleteScoreFetchingFromStore = store => isFetchingFromStore(store, SCORE_DELETE);
