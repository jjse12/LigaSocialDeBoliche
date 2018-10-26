import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    getMatchPlayerSeasonTeamId, getMatchScoreboards, setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard, matchSeasonTeamEndPhase, totalsObject
} from "../../reducers/matches";
import { updateScore} from "../../reducers/scores";
import {
    getLoggedInPlayerFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore,
    updateScoreFetchingFromStore,
    getMatchPlayerSeasonTeamIdFromStore,
    getMatchMyTeamOfflineScoreboardFromStore,
    getMatchRivalTeamOfflineScoreboardFromStore,
} from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import {
    IconCloudLg,
    IconDesktopLg} from "../../utilities/icons";

import NewGameDialog from "./new-game-dialog";
import PlayersSelectionDialog from "./players-selection-dialog";
import MatchScoreboards from "./match-scoreboards";
import MatchResults from "./match-results";



const scoreIdGameNumberIndex = [
    'firstGame',
    'secondGame',
    'thirdGame',
];



@connect(
    store => ({
        loggedInPlayer: getLoggedInPlayerFromStore(store),
        matchScoreboards: getMatchScoreboardsFromStore(store),
        matchPlayerSeasonTeamId: getMatchPlayerSeasonTeamIdFromStore(store),
        matchMyTeamOfflineScoreboard: getMatchMyTeamOfflineScoreboardFromStore(store),
        matchRivalTeamOfflineScoreboard: getMatchRivalTeamOfflineScoreboardFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
    }),
    { getMatchScoreboards, getMatchPlayerSeasonTeamId, updateScore, matchSeasonTeamEndPhase,
        setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard }
)
export default class Match extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        loggedInPlayer: PropTypes.object.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        matchPlayerSeasonTeamId: PropTypes.number.isRequired,
        matchMyTeamAvailablePlayers: PropTypes.array,
        matchMyTeamOfflineScoreboard: PropTypes.object,
        matchRivalTeamOfflineScoreboard: PropTypes.object,
        fetchingMatchScoreboards: PropTypes.bool,
        fetchingUpdateScore: PropTypes.bool,
        getMatchScoreboards: PropTypes.func.isRequired,
        getMatchPlayerSeasonTeamId: PropTypes.func,
        updateScore: PropTypes.func,
        matchSeasonTeamEndPhase: PropTypes.func,
        setMatchMyTeamOfflineScoreboard: PropTypes.func,
        setMatchRivalTeamOfflineScoreboard: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            newGameDialogOpen: false,
            playerSelectionDialogOpen: false,
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
        /*
        const { id } = this.props.match.params;
        let getTeamIdPromise = null;
        if (!_.isEmpty(this.props.loggedInPlayer)){
            getTeamIdPromise = this.props.getMatchPlayerSeasonTeamId(id, this.props.loggedInPlayer.id);
        }

        this.loadMatchScoreboardsWithCallbacks(() => {
            if (this.matchStatus() === 'active'){
                // Poller for updating match scoreboards every `this.state.pollingTime` seconds
                // this.matchScoreboardsPoller();

                // Check if player's team is in 'select game players phase', and if so, open dialog for players selection
                if (getTeamIdPromise !== null){
                    getTeamIdPromise.then(() => this.setNewGameDialogOpenAsRequired());
                }
            }
        });
        */
    }

    loadMatchScoreboards = () => {
        const { id } = this.props.match.params;
        return this.props.getMatchScoreboards(id);
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

    setNewGameDialogOpen = (open = false) => {
        this.setState({newGameDialogOpen: open});
    };

    setPlayerSelectionDialogOpen = (open = false) => {
        this.setState({playerSelectionDialogOpen : open});
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
        return this.props.matchPlayerSeasonTeamId !== 0;
    };

    getMatchMyTeam = () => {
        if (!this.isMatchPlayer())
            return null;

        if (this.props.matchPlayerSeasonTeamId === this.props.matchScoreboards.team1.data.id)
            return this.props.matchScoreboards.team1;

        if (this.props.matchPlayerSeasonTeamId === this.props.matchScoreboards.team2.data.id)
            return this.props.matchScoreboards.team2;
        
        return null;
    };

    getMatchRivalTeam = () => {
        if (!this.isMatchPlayer())
            return null;

        if (this.props.matchPlayerSeasonTeamId !== this.props.matchScoreboards.team1.data.id)
            return this.props.matchScoreboards.team1;

        if (this.props.matchPlayerSeasonTeamId !== this.props.matchScoreboards.team2.data.id)
            return this.props.matchScoreboards.team2;

        return null;
    };

    matchStatus = () => {
        if (this.props.matchScoreboards.statusData)
            return this.props.matchScoreboards.statusData.status;
        return "";
    };

    matchPhase = () => {
        if (this.matchStatus() === 'active'){
            return this.props.matchScoreboards.statusData.phase;
        }
        return null;
    };

    matchPhaseByMyTeamGamesConfirmed = () => {
        if (this.isMatchPlayer() && this.matchStatus() === 'active'){
            if (this.getMatchMyTeam().data.gamesConfirmed === null)
                return 'warming';

            switch (this.getMatchMyTeam().data.gamesConfirmed) {
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

        return null;
    };

    seasonTeamEndPhase = () => {
        const { id } = this.props.match.params;
        const { matchPlayerSeasonTeamId } = this.props;
        this.props.matchSeasonTeamEndPhase(id, matchPlayerSeasonTeamId, this.matchPhaseByMyTeamGamesConfirmed())
            .then(() => {
                this.loadMatchScoreboardsWithCallbacks(this.setNewGameDialogOpenAsRequired);
            })
            .catch(() => {

            })
    };

    render() {
        const {id} = this.props.match.params;
        return (
            <div style={{alignItems: 'center', alignContent: 'center'}} className={'mr-2 ml-2 mt-2 mb-2'}>
                <MatchResults/>
                <MatchScoreboards
                    matchId={Number(id)}
                    matchScoreboards={this.props.matchScoreboards}
                    isMatchPlayer={this.isMatchPlayer()}
                    matchPlayerSeasonTeamId={this.props.matchPlayerSeasonTeamId}
                    matchPhaseByMyTeamGamesConfirmed={this.matchPhaseByMyTeamGamesConfirmed()}
                    matchStatus={this.matchStatus()}/>
            </div>
        );
    }
}
