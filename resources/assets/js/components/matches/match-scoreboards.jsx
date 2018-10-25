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
    CloudLg,
    DesktopLg} from "../../utilities/icons";

import NewGameDialog from "./new-game-dialog";
import PlayersSelectionDialog from "./players-selection-dialog";



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
export default class MatchScoreboards extends Component {
    static propTypes = {
        matchId: PropTypes.number.isRequired,
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
        const selectedPlayers = [
            null, null, null, null
        ];

        this.state = {
            newGameDialogOpen: false,
            playerSelectionDialogOpen: false,
            pollingTime: 30,
            usingMyTeamOfflineScoreboard: false,
            usingRivalTeamOfflineScoreboard: false,
            selectedPlayers: selectedPlayers
        };
        this.renderCell = this.renderCell.bind(this);
        this.setPlayerSelectionDialogOpen = this.setPlayerSelectionDialogOpen.bind(this);
    }

    setMatchPollingTime = time => {
        this.setState({pollingTime : time});
    };

    matchScoreboardsPoller = async () => {
        let promise = new Promise(resolve => setTimeout(() => {resolve('Done')}, this.state.pollingTime * 1000));
        if (await promise === 'Done'){
            this.loadMatchScoreboardsWithCallbacks(() => {
                if (this.matchStatus() === 'En Progreso'){
                    this.setNewGameDialogOpenAsRequired();
                    this.matchScoreboardsPoller();
                }
            });
        } else {
            this.matchScoreboardsPoller();
        }
    };

    componentWillMount() {
        const { matchId } = this.props;
        let getTeamIdPromise = null;
        if (!_.isEmpty(this.props.loggedInPlayer)){
            getTeamIdPromise = this.props.getMatchPlayerSeasonTeamId(matchId, this.props.loggedInPlayer.id);
        }

        this.loadMatchScoreboardsWithCallbacks(() => {
            if (this.matchStatus() === 'En Progreso'){
                // Poller for updating match scoreboards every `this.state.pollingTime` seconds
                // this.matchScoreboardsPoller();

                // Check if player's team is in 'select game players phase', and if so, open dialog for players selection
                if (getTeamIdPromise !== null){
                    getTeamIdPromise.then(() => this.setNewGameDialogOpenAsRequired());
                }
            }
        });
    }

    loadMatchScoreboards = () => {
        const { matchId } = this.props;
        return this.props.getMatchScoreboards(matchId);
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

    toggleUsingMyTeamOfflineScoreboard = () => {
        const current = this.state.usingMyTeamOfflineScoreboard;
        this.setState({ usingMyTeamOfflineScoreboard: !current });
    };

    toggleUsingRivalTeamOfflineScoreboard = () => {
        const current = this.state.usingRivalTeamOfflineScoreboard;
        this.setState({ usingRivalTeamOfflineScoreboard: !current });
    };

    updateMyTeamScoreboardFromCloud = () => {
        if (this.getMatchMyTeam() !== null)
            this.props.setMatchMyTeamOfflineScoreboard(this.getMatchMyTeam().results);
    };

    updateRivalTeamScoreboardFromCloud = () => {
        if (this.getMatchRivalTeam())
            this.props.setMatchRivalTeamOfflineScoreboard(this.getMatchRivalTeam().results);
    };

    handleScoreFocus = e => {
        const cell = e.target;
        cell.setAttribute('class', 'score-focus');
    };

    handleScoreKeyPress = e => {

        if (e.which === 13){
            e.target.blur();
            return false;
        }

        if (isNaN(String.fromCharCode(e.which)) ||
            e.which === 32 || e.target.textContent.length >= 3){
            e.preventDefault();
        }
    };

    handleScoreKeyUp = e => {
        if (Number(e.target.textContent) > 300) {
            e.target.textContent = "300";
            return true;
        }
    };

    handleScoreBlur = (e, oldScore, gameScoreData) => {
        const cell = e.target;
        const newScore = cell.textContent !== '' &&
                         cell.textContent !== ' '  ?
                         cell.textContent : 0;

        if (oldScore !== Number(newScore)) {
            cell.setAttribute('class', 'score-patching');
            this.props.updateScore(gameScoreData.scoreId, newScore)
            .then(() => {
                cell.setAttribute('class', 'score-update-success');
                this.loadMatchScoreboards();
            })
            .catch(() => {
                cell.setAttribute('class', 'score-update-error');
                cell.textContent = oldScore;
            });
        }
        else {
            cell.setAttribute('class', '');
            if (newScore === 0){
                cell.textContent = oldScore;
            }
        }
    };

    renderCell(cellInfo, column) {
        if (this.getMatchMyTeam() === null ||
            cellInfo.value === undefined ||
            cellInfo === null ||
            cellInfo.original.seasonPlayerId === 0)
            return cellInfo.value;

        // If the player's team game have already confirmed this score game number, don't use `contentEditable`
        const gc = this.getMatchMyTeam().data.gamesConfirmed;
        if (gc > column)
            return cellInfo.value;

        return (
            <div
                onFocus={this.handleScoreFocus}
                onKeyPress={this.handleScoreKeyPress}
                onKeyUp={this.handleScoreKeyUp}
                onPaste={e => { e.preventDefault(); }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => this.handleScoreBlur(e, cellInfo.value, cellInfo.original[scoreIdGameNumberIndex[column]])}
            >{cellInfo.value}</div>
        );
    }

    matchStatus = () => {
        return this.props.matchScoreboards.statusData.status;
    };

    matchPhase = () => {
        if (this.matchStatus() === 'En Progreso'){
            return this.props.matchScoreboards.statusData.phase;
        }
        return null;
    };

    matchPhaseByMyTeamGamesConfirmed = () => {
        if (this.isMatchPlayer() && this.matchStatus() === 'En Progreso'){
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
        const { matchId } = this.props;
        const { matchPlayerSeasonTeamId } = this.props;
        this.props.matchSeasonTeamEndPhase(matchId, matchPlayerSeasonTeamId, this.matchPhaseByMyTeamGamesConfirmed())
            .then(() => {
                this.loadMatchScoreboardsWithCallbacks(this.setNewGameDialogOpenAsRequired);
            })
            .catch(() => {

            })
    };

    renderTeamActions = team => {
        let element = null;
        let icon = null;
        let toggler = null;
        let className = '';
        // Actions for player's team
        if (this.props.matchPlayerSeasonTeamId === team.data.id) {
            if (this.state.playerSelectionDialogOpen){
                element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Seleccionando jugadores</div>
            } else {
                if (this.matchPhase() === 'warming'){
                    if (team.data.gamesConfirmed === null){
                        element = <button className={`btn btn-md btn-success`} onClick={this.seasonTeamEndPhase}>Terminar calentamiento</button>
                    } else {
                        element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Esperando al rival</div>
                    }
                } else {
                    if (this.matchMyTeamGameScoresCount(this.matchPhaseByMyTeamGamesConfirmed()) !== 0){
                        // TODO: Disable element if EndPhase request is still fetching, and same with all posible actions (score update, etc)
                        element = <button className={`btn btn-md btn-success`} onClick={this.seasonTeamEndPhase}>Terminar Linea</button>
                    } else {
                        // element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Seleccionando jugadores</div>
                    }
                }
            }
            /*
            else {
                toggler = () => {this.toggleUsingMyTeamOfflineScoreboard()};
                if (this.state.usingMyTeamOfflineScoreboard) {
                    icon = DesktopLg();
                    className = 'btn-info';
                } else {
                    icon = CloudLg();
                    className = 'btn-success';
                }
            }*/
        }
        // Actions for player's rival team

        else {
            toggler = () => {this.toggleUsingRivalTeamOfflineScoreboard()};
            if (this.state.usingRivalTeamOfflineScoreboard) {
                icon = DesktopLg();
                className = 'btn-info';
            } else {
                icon = CloudLg();
                className = 'btn-success';
            }
        }

        // element = <button className={`btn btn-sm ${className}`}
        //         onClick={toggler}>{icon}</button>

        return <div className={'mr-2 align-self-center'}>
            {/*<button className={'mr-2 btn btn-secondary btn-sm'} onClick={this.updateMyTeamScoreboardFromCloud}>{CloudDownloadLg()} {ArrowRightLg()} {DesktopLg()}</button>*/}
            { element }
        </div>;
    };

    render() {
        if (_.isEmpty(this.props.matchScoreboards)){
            return (<div className={'container mt-3 mb-3'}>
                <div className={'match-scoreboards-container'}>
                    <div className={'mr-3'}>
                        {this.renderEmptyTableLoading()}
                    </div>
                    <div className={'ml-3'}>
                        {this.renderEmptyTableLoading()}
                    </div>
                </div>
            </div>);
        }

        const { matchId } = this.props;
        const { matchScoreboards } = this.props;
        const team1Data = matchScoreboards.team1.data;
        const team2Data = matchScoreboards.team2.data;
        let team1Scoreboard = matchScoreboards.team1.results;
        let team2Scoreboard = matchScoreboards.team2.results;
        if (this.isMatchPlayer()){
            if (this.props.matchPlayerSeasonTeamId === team1Data.id){
                if (this.state.usingMyTeamOfflineScoreboard)
                    team1Scoreboard = this.props.matchMyTeamOfflineScoreboard;
                if (this.state.usingRivalTeamOfflineScoreboard)
                    team2Scoreboard = this.props.matchRivalTeamOfflineScoreboard;
            } else {
                if (this.state.usingMyTeamOfflineScoreboard)
                    team2Scoreboard = this.props.matchMyTeamOfflineScoreboard;
                if (this.state.usingRivalTeamOfflineScoreboard)
                    team1Scoreboard = this.props.matchRivalTeamOfflineScoreboard;
            }
        }

        return (
            <div className={'container mt-3 mb-3'}>
                <div className={'match-scoreboards-container'}>
                    <div className={'mr-3'}>
                        <div className={'d-flex bg-semi-transparent-gradient-primary'}>
                            <div className={'ml-1 d-flex mr-auto flex-column justify-content-center'}>
                                <h5 className={'text-light'}>Pista: #{team1Data.laneNumber}</h5>
                                <h5 className={'text-light'}>{team1Data.name}</h5>
                            </div>
                            { this.matchStatus() === 'En Progreso' && this.isMatchPlayer() ?
                              this.renderTeamActions(matchScoreboards.team1) : null }
                        </div>
                        <div className={'match-scoreboard-table-container'}>
                            <ReactTable
                                className={'match-scoreboard-table -striped -highlight'}
                                getNoDataProps={() => {return {style: {display: 'none'}}}}
                                data={ team1Scoreboard.playersScores}
                                columns={matchScoreboardScoresColumns(this)}
                                getProps={() => {return {style: {color: 'white'}}}}
                                showPagination={false}
                                showPageSizeOptions={false}
                                minRows={0}
                                pageSize={team1Scoreboard.playersScores.length}
                            />
                            <ReactTable
                                className={'match-scoreboard-table -striped -highlight'}
                                data={team1Scoreboard.gamesTotals}
                                columns={matchScoreboardTotalsColumns(team1Scoreboard.playersScores.length === 0)}
                                getProps={() => {return {style: {color: 'white'}}}}
                                getTheadThProps={() => {return {style:{display: 'none'}}}}
                                showPagination={false}
                                showPageSizeOptions={false}
                                minRows={0}
                                pageSize={3}
                            />
                        </div>
                    </div>
                    <div className={'ml-3'}>
                        <div className={'d-flex bg-semi-transparent-gradient-primary'}>
                            <div className={'ml-1 d-flex mr-auto flex-column justify-content-center'}>
                                <h5 className={'text-light'}>Pista: #{team2Data.laneNumber}</h5>
                                <h5 className={'text-light'}>{team2Data.name}</h5>
                            </div>
                            { this.matchStatus() === 'En Progreso' && this.isMatchPlayer() ?
                              this.renderTeamActions(matchScoreboards.team2) : null }
                        </div>
                        <div className={'match-scoreboard-table-container'}>
                            <ReactTable
                                className={'match-scoreboard-table -striped -highlight'}
                                getNoDataProps={() => {return {style: {display: 'none'}}}}
                                data={team2Scoreboard.playersScores}
                                columns={matchScoreboardScoresColumns(this)}
                                getProps={() => {return {style: {color: 'white'}}}}
                                showPagination={false}
                                showPageSizeOptions={false}
                                minRows={0}
                                pageSize={team2Scoreboard.playersScores.length}
                            />
                            <ReactTable
                                className={'match-scoreboard-table -striped -highlight'}
                                data={team2Scoreboard.gamesTotals}
                                columns={matchScoreboardTotalsColumns(team2Scoreboard.playersScores.length === 0)}
                                getTheadThProps={() => {return {style:{display: 'none'}}}}
                                getProps={() => {return {style: {color: 'white'}}}}
                                showPagination={false}
                                showPageSizeOptions={false}
                                minRows={0}
                                pageSize={3}
                            />
                        </div>
                    </div>
                </div>
                {
                    this.matchPhaseByMyTeamGamesConfirmed() !== null ?
                    <React.Fragment>
                        <PlayersSelectionDialog
                            matchId={Number(matchId)}
                            seasonTeamId={this.props.matchPlayerSeasonTeamId}
                            teamMatchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                            teamGamesConfirmed={this.getMatchMyTeam().data.gamesConfirmed}
                            playersScores={this.getMatchMyTeam().results.playersScores}
                            loadMatchScoreboards={this.loadMatchScoreboards}
                            isOpen={this.state.playerSelectionDialogOpen}
                            setPlayerSelectionDialogOpen={this.setPlayerSelectionDialogOpen}
                        />
                        <NewGameDialog
                            isOpen={this.state.newGameDialogOpen}
                            matchId={Number(matchId)}
                            seasonTeamId={this.props.matchPlayerSeasonTeamId}
                            setNewGameDialogOpen={this.setNewGameDialogOpen}
                            setPlayerSelectionDialogOpen={this.setPlayerSelectionDialogOpen}
                            loadMatchScoreboards={this.loadMatchScoreboards}
                        />
                    </React.Fragment> : null
                }
            </div>
        );
    }

    renderEmptyTableLoading() {
        const totalsData = [
            totalsObject('Pin neto'),
            totalsObject('Handicap'),
            totalsObject('Total')
        ];
        return (<div className={'match-scoreboard-table-container'}>
            <ReactTable
                className={'match-scoreboard-table'}
                getNoDataProps={() => {return {style: {display: 'none'}}}}
                data={[]}
                columns={matchScoreboardScoresColumns(this)}
                getProps={() => {return {style: {color: 'white'}}}}
                showPagination={false}
                showPageSizeOptions={false}
                minRows={0}
                pageSize={0}
            />
            <ReactTable
                className={'match-scoreboard-table -striped -highlight'}
                data={totalsData}
                columns={matchScoreboardTotalsColumns(true, true)}
                getTheadThProps={() => {return {style:{display: 'none'}}}}
                getProps={() => {return {style: {color: 'white'}}}}
                showPagination={false}
                showPageSizeOptions={false}
                pageSize={3}
            />
        </div>);
    };
}
