import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import {getMatchPlayerSeasonTeamId, getMatchScoreboards, getMatchMyTeamAvailablePlayers,
    setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard, matchSeasonTeamEndPhase } from "../../reducers/matches";
import { createScore, updateScore, deleteScore } from "../../reducers/scores";
import {
    getLoggedInPlayerFromStore,
    createScoreFetchingFromStore,
    deleteScoreFetchingFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore,
    updateScoreFetchingFromStore,
    getMatchPlayerSeasonTeamIdFromStore,
    getMatchMyTeamAvailablePlayersFromStore,
    getMatchMyTeamAvailablePlayersFetchingFromStore,
    getMatchMyTeamOfflineScoreboardFromStore,
    getMatchRivalTeamOfflineScoreboardFromStore
} from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import ReactLoading from "react-loading";
import {
    ArrowRightLg,
    ArrowRightSm, CloudDownloadLg,
    CloudDownloadSm,
    CloudLg,
    CloudSm,
    DesktopLg,
    DesktopSm
} from "../../utilities/icons";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

@connect(
    store => ({
        loggedInPlayer: getLoggedInPlayerFromStore(store),
        matchPlayerSeasonTeamId: getMatchPlayerSeasonTeamIdFromStore(store),
        matchMyTeamAvailablePlayers: getMatchMyTeamAvailablePlayersFromStore(store),
        matchMyTeamOfflineScoreboard: getMatchMyTeamOfflineScoreboardFromStore(store),
        matchRivalTeamOfflineScoreboard: getMatchRivalTeamOfflineScoreboardFromStore(store),
        matchScoreboards: getMatchScoreboardsFromStore(store),
        fetchingMatchMyTeamAvailablePlayers: getMatchMyTeamAvailablePlayersFetchingFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
        fetchingCreateScore: createScoreFetchingFromStore(store),
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
        fetchingDeleteScore: deleteScoreFetchingFromStore(store),
    }),
    { getMatchPlayerSeasonTeamId, getMatchMyTeamAvailablePlayers, getMatchScoreboards, createScore, updateScore,
        deleteScore, setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard, matchSeasonTeamEndPhase }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        matchPlayerSeasonTeamId: PropTypes.number.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        fetchingMatchScoreboards: PropTypes.bool,
        getMatchScoreboards: PropTypes.func.isRequired,
        getMatchPlayerSeasonTeamId: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            playerSelectionDialogOpen: false,
            pollingTime: 5,
            usingMyTeamOfflineScoreboard: false,
            usingRivalTeamOfflineScoreboard: false,
        };
        this.renderCell = this.renderCell.bind(this);
    }

    setMatchPollingTime = time => {
        this.setState({pollingTime : time});
    };

    matchScoreboardsPoller = async () => {
        let promise = new Promise(resolve => setTimeout(() => {resolve('Done')}, this.state.pollingTime * 1000));
        if (await promise === 'Done'){
            this.loadMatchScoreboardsWithCallbacks(response => {
                if (this.matchStatus() === 'En Progreso'){
                    this.openPlayerSelectionDialogIfRequired();
                    this.matchScoreboardsPoller();
                }
            });
        } else {
            this.matchScoreboardsPoller();
        }
    };

    componentWillMount() {
        const { matchId } = this.props.match.params;
        let getTeamIdPromise = null;
        if (!_.isEmpty(this.props.loggedInPlayer)){
            getTeamIdPromise = this.props.getMatchPlayerSeasonTeamId(matchId, this.props.loggedInPlayer.id);
        }

        this.loadMatchScoreboardsWithCallbacks(response => {
            if (this.matchStatus() === 'En Progreso'){
                // Poller for updating match scoreboards every `this.state.pollingTime` seconds
                // this.matchScoreboardsPoller();

                // Check if player's team is in 'select game players phase', and if so, open dialog for players selection
                if (getTeamIdPromise !== null){
                    getTeamIdPromise.then(() => this.openPlayerSelectionDialogIfRequired());
                }
            }
        });
    }

    loadMatchScoreboardsWithCallbacks = (thenCallback = null, catchCallback = null, finallyCallback = null) => {
        const { matchId } = this.props.match.params;
        const promise = this.props.getMatchScoreboards(matchId);

        if (thenCallback !== null)
            promise.then(response => thenCallback(response));

        if (catchCallback !== null)
            promise.catch(jqXHR => catchCallback(jqXHR));

        if (finallyCallback !== null)
            promise.finally(response => finallyCallback(response));
    };

    openPlayerSelectionDialogIfRequired = () => {
        if (this.isMatchPlayer() && this.getMatchMyTeam().data.gamesConfirmed >= 0) {
            if (this.gameScoresCount(this.getMatchMyTeam().results.playersScores, this.matchPhaseByMyTeamGamesConfirmed()) === 0) {
                this.setPlayerSelectionDialogOpen(true);
            }
        }
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

    setPlayerSelectionDialogOpen = (open = false) => {
        this.setState({playerSelectionDialogOpen : open});
    };

    handlePlayerSelectionDialogEnter = () => {
        if (this.isMatchPlayer()){
            const { matchId } = this.props.match.params;
            this.props.getMatchMyTeamAvailablePlayers(matchId, this.props.matchPlayerSeasonTeamId);
        }
    };

    toggleUsingMyTeamOfflineScoreboard = () => {
        const current = this.state.usingMyTeamOfflineScoreboard;
        this.setState({ usingMyTeamOfflineScoreboard: !current });
    };

    toggleUsingRivalTeamOfflineScoreboard = () => {
        const current = this.state.usingRivalTeamOfflineScoreboard;
        this.setState({ usingRivalTeamOfflineScoreboard: !current });
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

    handleScoreBlur = (e, oldScore, scoreId) => {
        const cell = e.target;
        const newScore = cell.textContent !== '' &&
                         cell.textContent !== ' '  ?
                         cell.textContent : 0;

        if (oldScore !== Number(newScore)) {
            cell.setAttribute('class', 'score-patching');
            this.props.updateScore(scoreId, newScore)
            .then(() => {
                cell.setAttribute('class', 'score-update-success');
                this.props.getMatchScoreboards(this.props.match.params.matchId);
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
        /*TODO: Add team1 and team2 'confirmedScores' for the match's three games and
          TODO: render editable cell in case of scoresNOTconfirmed (match game still active)*/
        if (this.getMatchMyTeam() === null || cellInfo.value === undefined || cellInfo === null)
            return cellInfo.value;

        return (
            <div
                onFocus={this.handleScoreFocus}
                onKeyPress={this.handleScoreKeyPress}
                onKeyUp={this.handleScoreKeyUp}
                onPaste={e => { e.preventDefault(); }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => this.handleScoreBlur(e, cellInfo.value, cellInfo.original[column])}
            >{cellInfo.value}</div>
        );
    }

    updateMyTeamScoreboardFromCloud = () => {
        if (this.getMatchMyTeam() !== null)
            this.props.setMatchMyTeamOfflineScoreboard(this.getMatchMyTeam().results);
    };

    updateRivalTeamScoreboardFromCloud = () => {
        if (this.getMatchRivalTeam())
            this.props.setMatchRivalTeamOfflineScoreboard(this.getMatchRivalTeam().results);
    };

    gameScoresCount = (playersScores, gameIndex) => {
        if (playersScores.length === 0)
            return 0;

        let count = 0;
        playersScores.map(playerScore => {
            if (playerScore[gameIndex]){
                count++;
            }
        });
        return count;
    };

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
        if (this.matchStatus() === 'En Progreso' && this.isMatchPlayer()){
            switch (this.getMatchMyTeam().data.gamesConfirmed) {
                case -1:
                    return 'warming';
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
        const { matchId } = this.props.match.params;
        const { matchPlayerSeasonTeamId } = this.props;
        this.props.matchSeasonTeamEndPhase(matchId, matchPlayerSeasonTeamId, this.matchPhase())
            .then(response => {

            })
            .finally(() => {
                this.props.getMatchScoreboards(matchId);
            });
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
                    if (team.data.gamesConfirmed === -1){
                        element = <button className={`btn btn-md btn-success`} onClick={this.seasonTeamEndPhase}>Terminar calentamiento</button>
                    } else {
                        element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Esperando al rival</div>
                    }
                } else {
                    if (this.gameScoresCount(team.results.playersScores, this.matchPhase()) === 0){
                        element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Seleccionando jugadores</div>
                    } else {
                        element = <button className={`btn btn-md btn-success`} onClick={toggler}>Terminar Linea</button>
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

    renderPlayersSelectionDialog = () => {
        return <Dialog aria-labelledby='dialog-title'
                disableBackdropClick
                disableEscapeKeyDown
                open={this.state.playerSelectionDialogOpen}
                onEnter={this.handlePlayerSelectionDialogEnter}
                onClose={() => this.setPlayerSelectionDialogOpen(false)}
                >
                <DialogTitle id='dialog-title'>Selección de Jugadores</DialogTitle>
                <DialogContent>
                    {this.props.fetchingMatchMyTeamAvailablePlayers ?
                        <ReactLoading type={'spin'} color={'#488aaa'}/> :
                        null
                    }
                </DialogContent>
                <button className='btn btn-sm btn-success' onClick={() => this.setPlayerSelectionDialogOpen(false)}>Aceptar</button>
            </Dialog>
    };

    render() {
        if (_.isEmpty(this.props.matchScoreboards)){
            if (this.props.fetchingMatchScoreboards)
                return <div className={'container flex flex-wrap content-center justify-center'}>
                        <ReactLoading type={'spin'} color={'#488aaa'} height={'20%'} width={'20%'}/>
                    </div>;
            return null;
        }

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
                {this.renderPlayersSelectionDialog()}
            </div>
        );
    }
}
