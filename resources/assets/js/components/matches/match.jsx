import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    getMatchPlayerSeasonTeamId, getMatchScoreboards, setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard, matchSeasonTeamEndPhase, totalsObject
} from "../../reducers/matches";
import { getMatchInfo } from "../../reducers/match";
import { updateScore} from "../../reducers/scores";
import selectors, {
    getLoggedInPlayerFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore,
    updateScoreFetchingFromStore,
    getMatchPlayerSeasonTeamIdFromStore,
    getMatchMyTeamOfflineScoreboardFromStore,
    getMatchRivalTeamOfflineScoreboardFromStore,
} from "../../reducers/selectors";
import _ from 'lodash';
import NewGameDialog from "./dialogs/new-game-dialog";
import PlayersSelectionDialog from "./dialogs/players-selection-dialog";
import MatchScoreboards from "./match-scoreboards";
import MatchResults from "./match-results";
import EndPhaseDialog from "./dialogs/end-phase-dialog";


export const scoreIdGameNumberIndex = [
    'firstGame',
    'secondGame',
    'thirdGame',
];

export const gameNumberStrings = {
    warming: 'Calentamiento',
    firstGame: 'Primera Linea',
    secondGame: 'Segunda Linea',
    thirdGame: 'Tercera Linea'
};

@connect(
    store => ({
        user: selectors.user(store),
        matchScoreboards: getMatchScoreboardsFromStore(store),
        matchPlayerSeasonTeamId: getMatchPlayerSeasonTeamIdFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
    }),
    { getMatchInfo, getMatchScoreboards, getMatchPlayerSeasonTeamId, matchSeasonTeamEndPhase }
)
export default class Match extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        matchPlayerSeasonTeamId: PropTypes.number.isRequired,
        fetchingMatchScoreboards: PropTypes.bool.isRequired,
        getMatchScoreboards: PropTypes.func.isRequired,
        getMatchPlayerSeasonTeamId: PropTypes.func.isRequired,
        matchSeasonTeamEndPhase: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            playerSelectionDialogOpen: false,
            endPhaseDialogOpen: false,
            newGameDialogOpen: false,
            fillOfflineScoreboardDialogOpen: false,
            pollingTime: 30,
        };
        this.setPlayerSelectionDialogOpen = this.setPlayerSelectionDialogOpen.bind(this);
    }

    setMatchPollingTime = time => {
        this.setState({pollingTime : time});
    };

    matchScoreboardsPoller = async () => {
        let promise = new Promise(resolve => setTimeout(() => {resolve('Done')}, this.state.pollingTime * 1000));
        if (await promise === 'Done'){
            this.loadMatchScoreboardsWithCallbacks(() => {
                if (this.matchStatus() === 'active'){
                    this.setNewGameDialogOpenAsRequired();
                    this.matchScoreboardsPoller();
                }
            });
        } else {
            this.matchScoreboardsPoller();
        }
    };

    componentWillMount() {
        const { id } = this.props.match.params;
        const { getMatchInfo, user, getMatchPlayerSeasonTeamId } = this.props;
        getMatchInfo(id);
        let getTeamIdPromise = null;
        if (!_.isEmpty(user)){
            getTeamIdPromise = getMatchPlayerSeasonTeamId(id, user.id);
        }

        this.loadMatchScoreboardsWithCallbacks(() => {
            if (this.matchStatus() === 'active'){
                // Poller for updating match scoreboards every `this.state.pollingTime` seconds
                // this.matchScoreboardsPoller();

                // Check if player's team is in 'select game players phase', and if so, open dialog for players selection
                if (getTeamIdPromise !== null){
                    getTeamIdPromise.then(this.setNewGameDialogOpenAsRequired);
                }
            }
        });
    }

    loadMatchScoreboards = () => {
        const { id } = this.props.match.params;
        const { getMatchScoreboards } = this.props;
        return getMatchScoreboards(id);
    };

    loadMatchScoreboardsWithCallbacks = (thenCallback = null, catchCallback = null, finallyCallback = null) => {
        const promise = this.loadMatchScoreboards();
        if (thenCallback !== null)
            promise.then(response => thenCallback(response));

        if (catchCallback !== null)
            promise.catch(jqXHR => catchCallback(jqXHR));

        if (finallyCallback !== null)
            promise.finally(response => finallyCallback(response));
    };

    setPlayerSelectionDialogOpen = (open = false) => {
        this.setState({playerSelectionDialogOpen : open});
    };

    requestEndPhase = () => {
        if (this.getMatchMyTeam().gamesConfirmed === 0)
            this.seasonTeamEndPhase();
        else
            this.setEndPhaseDialogOpen(true);
    };

    setEndPhaseDialogOpen = (open = false) => {
        this.setState({endPhaseDialogOpen: open});
    };

    setNewGameDialogOpen = (open = false) => {
        this.setState({newGameDialogOpen: open});
    };

    setFillOfflineScoreboardDialogOpen = (open = false) => {
        this.setState({fillOfflineScoreboardDialog: open});
    };

    matchMyTeamGameScoresCount = gameNumber => {
        const playersScores = this.getMatchMyTeam().results.playersScores;
        if (playersScores.length === 0)
            return 0;

        let count = 0;
        playersScores.map(playerScore => {
            if (playerScore[gameNumber] !== undefined){
                count++;
            }
        });
        return count;
    };

    setNewGameDialogOpenAsRequired = () => {
        if (this.isMatchPlayer()){
            if (this.matchPhaseByMyTeamGamesConfirmed().includes('Game')) {
                if ( this.matchMyTeamGameScoresCount(this.matchPhaseByMyTeamGamesConfirmed()) === 0) {
                    if (this.state.playerSelectionDialogOpen)
                        return;

                    if (this.matchPhaseByMyTeamGamesConfirmed() === 'firstGame'){
                        // For first game there are no players to keep, open the players selection dialog immediately
                        if (!this.state.playerSelectionDialogOpen)
                            this.setPlayerSelectionDialogOpen(true);
                    }
                    else {
                        if (!this.state.newGameDialogOpen)
                            this.setNewGameDialogOpen(true);
                    }
                    return ;
                }
            }
        }

        if (this.state.playerSelectionDialogOpen)
            this.setPlayerSelectionDialogOpen(false);
        if (this.state.newGameDialogOpen)
            this.setNewGameDialogOpen(false);
    };

    isMatchPlayer = () => {
        const { matchPlayerSeasonTeamId } = this.props;
        return matchPlayerSeasonTeamId !== 0;
    };

    getMatchMyTeam = () => {
        const { matchScoreboards, matchPlayerSeasonTeamId } = this.props;
        if (!this.isMatchPlayer() || _.isEmpty(matchScoreboards))
            return null;

        if (matchPlayerSeasonTeamId === matchScoreboards.team1.data.id)
            return matchScoreboards.team1;

        if (matchPlayerSeasonTeamId === matchScoreboards.team2.data.id)
            return matchScoreboards.team2;
        
        return null;
    };

    getMatchRivalTeam = () => {
        const { matchScoreboards, matchPlayerSeasonTeamId } = this.props;
        if (!this.isMatchPlayer() || _.isEmpty(matchScoreboards))
            return null;

        if (matchPlayerSeasonTeamId !== matchScoreboards.team1.data.id)
            return matchScoreboards.team1;

        if (matchPlayerSeasonTeamId !== matchScoreboards.team2.data.id)
            return matchScoreboards.team2;

        return null;
    };

    matchStatus = () => {
        const { matchScoreboards: { statusData }} = this.props;
        return statusData ? statusData.status : '';
    };

    matchPhase = () => {
        const { matchScoreboards: { statusData } } = this.props;
        return this.matchStatus() === 'active' ? statusData.phase : null;
    };

    matchPhaseByMyTeamGamesConfirmed = () => {
        if (!this.isMatchPlayer()) return null;

        if (this.matchStatus() === 'active'){
            const { data: { gamesConfirmed } } = this.getMatchMyTeam();
            if (gamesConfirmed === null)
                return 'warming';
            switch (gamesConfirmed) {
                case 0:
                    return 'firstGame';
                case 1:
                    return 'secondGame';
                case 2:
                    return 'thirdGame';
                case 3:
                    return 'concluded';
            }
        }
        return this.matchStatus();
    };

    seasonTeamEndPhase = () => {
        const { id } = this.props.match.params;
        const { matchSeasonTeamEndPhase, matchPlayerSeasonTeamId } = this.props;
        let promise = matchSeasonTeamEndPhase(id, matchPlayerSeasonTeamId, this.matchPhaseByMyTeamGamesConfirmed());
        promise.then(() => {
                this.loadMatchScoreboardsWithCallbacks(this.setNewGameDialogOpenAsRequired);
            });

        return promise;
    };

    render() {
        const {id} = this.props.match.params;
        return (
            <div style={{alignItems: 'center', alignContent: 'center'}} className={'mr-2 ml-2 mt-2 mb-2'}>
                <MatchResults/>
                <MatchScoreboards
                    matchId={Number(id)}
                    matchScoreboards={this.props.matchScoreboards}
                    loadMatchScoreboards={this.loadMatchScoreboardsWithCallbacks}
                    fetchingMatchScoreboards={this.props.fetchingMatchScoreboards}
                    requestEndPhase={this.requestEndPhase}
                    isMatchPlayer={this.isMatchPlayer()}
                    matchPlayerSeasonTeamId={this.props.matchPlayerSeasonTeamId}
                    matchStatus={this.matchStatus()}
                    matchPhase={this.matchPhase()}
                    matchMyTeam={this.getMatchMyTeam()}
                    matchRivalTeam={this.getMatchRivalTeam()}
                    matchMyTeamGameScoresCount={this.matchMyTeamGameScoresCount}
                    matchPhaseByMyTeamGamesConfirmed={this.matchPhaseByMyTeamGamesConfirmed()}
                    playerSelectionDialogOpen={this.state.playerSelectionDialogOpen}
                />
                {
                    this.getMatchMyTeam() !== null ?
                        <React.Fragment>
                            <PlayersSelectionDialog
                                isOpen={this.state.playerSelectionDialogOpen}
                                setPlayerSelectionDialogOpen={this.setPlayerSelectionDialogOpen}
                                matchId={Number(id)}
                                seasonTeamId={this.props.matchPlayerSeasonTeamId}
                                teamMatchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                                teamGamesConfirmed={this.getMatchMyTeam().data.gamesConfirmed}
                                playersScores={this.getMatchMyTeam().results.playersScores}
                                loadMatchScoreboards={this.loadMatchScoreboards}
                            />
                            <NewGameDialog
                                isOpen={this.state.newGameDialogOpen}
                                setNewGameDialogOpen={this.setNewGameDialogOpen}
                                matchId={Number(id)}
                                matchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                                seasonTeamId={this.props.matchPlayerSeasonTeamId}
                                loadMatchScoreboards={this.loadMatchScoreboards}
                                setPlayerSelectionDialogOpen={this.setPlayerSelectionDialogOpen}
                            />
                            <EndPhaseDialog
                                isOpen={this.state.endPhaseDialogOpen}
                                setEndPhaseDialogOpen={this.setEndPhaseDialogOpen}
                                matchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                                endPhaseCallback={this.seasonTeamEndPhase}
                            />
                        </React.Fragment> : null
                }
            </div>
        );
    }
}
