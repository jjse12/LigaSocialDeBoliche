import { isFetchingFromStore } from "../utilities/action-creators";
import  {MATCH_MY_TEAM_AVAILABLE_PLAYERS, MATCH_TEAM_SCOREBOARD } from "./matches";
import { SEASON_TEAM_PLAYERS } from "./seasonTeam";
import {
    MATCH_SUMMARY,
    MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS,
    MATCH_SCOREBOARDS,
    MATCH_CREATE_NEW_GAME_SCORES,
    MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS,
    MATCH_CREATE_SCORE,
    MATCH_UPDATE_SCORE,
    MATCH_DELETE_SCORE
} from "./match";

// Logged in player
export const getLoggedInPlayerFromStore = store => store.user;

// Season
export const getCurrentSeasonFromStore = store => store.currentSeason;
export const getNextMatchdayFromStore = store => store.nextMatchday;
export const getNextMatchdayMatchesFromStore = store => store.nextMatchdayMatches;

// Teams
export const getSeasonTeamPlayersFromStore = store => store.seasonTeam.players;
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
export const createScoreFetchingFromStore = store => isFetchingFromStore(store, MATCH_CREATE_SCORE);
export const updateScoreFetchingFromStore = store => isFetchingFromStore(store, MATCH_UPDATE_SCORE);
export const deleteScoreFetchingFromStore = store => isFetchingFromStore(store, MATCH_DELETE_SCORE);

const getUser = store => store.user;
const isGuestUser = store => _.isEmpty(getUser(store));
const userInfo = store => {
    if (isGuestUser(store))
        return {};
    return getUser(store).info;
};
const userCurrentSeasonTeamId = store => {
    if (isGuestUser(store))
        return 0;
    return getUser(store).currentSeason.team.id;
};
const getMatch = store => store.match;
const matchSummary = store => getMatch(store).summary;
const matchStatus = store => getMatch(store).summary.statusData.status;
const matchScoreboards = store => getMatch(store).scoreboards;
const matchEdition = store => getMatch(store).edition;
const matchNewGame = store => matchEdition(store).newGame;
const matchPlayerSelection = store => matchEdition(store).playerSelection;
const matchEndPhase= store => matchEdition(store).endPhase;
const matchOfflineScoreboards = store => matchEdition(store).offlineScoreboards;

const loadingMatchSummary = store => isFetchingFromStore(store, MATCH_SUMMARY);
const loadingMatchScoreboards = store => isFetchingFromStore(store, MATCH_SCOREBOARDS);
const loadingMatchTeamAvailablePlayers = store => isFetchingFromStore(store, MATCH_PLAYER_SELECTION_AVAILABLE_PLAYERS);

const loadingCreateMatchNewGameScores = store => isFetchingFromStore(store, MATCH_CREATE_NEW_GAME_SCORES);
const loadingCreateMatchNewGameScoresForLastGamePlayers = store =>
    isFetchingFromStore(store, MATCH_CREATE_NEW_GAME_SCORES_FOR_LAST_GAME_PLAYERS);

const matchPhase = store => {
    const {
        statusData: {
            status,
            phase
        }
    } = matchSummary(store);
    return status === 'active' ? phase : null;
};

const selectors = {
    isGuestUser,
    userInfo,
    userCurrentSeasonTeamId,
    matchSummary,
    matchStatus,
    matchPhase,
    matchScoreboards,
    matchNewGame,
    matchPlayerSelection,
    matchEndPhase,
    matchOfflineScoreboards,

    // Store fetching data:
    loadingMatchSummary,
    loadingMatchScoreboards,
    loadingMatchTeamAvailablePlayers,
    loadingCreateMatchNewGameScores,
    loadingCreateMatchNewGameScoresForLastGamePlayers,
};

export default selectors;
