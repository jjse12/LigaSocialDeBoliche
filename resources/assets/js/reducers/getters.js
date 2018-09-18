
// Season
export const getCurrentSeasonFromStore = store => store.currentSeason;
export const getNextMatchdayFromStore = store => store.nextMatchday;
export const getNextMatchdayMatchesFromStore = store => store.nextMatchdayMatches;

// Teams
export const getTeamPlayersFromStore = store => store.teamPlayers;

// Matches
export const getMatchResultsFromStore = store => store.matchResults;
export const getMatchScoreboardsFromStore = store => store.matchScoreboards;
export const getMatchTeamScoreboardFromStore = store => store.matchTeamScoreboard;
