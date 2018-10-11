import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import {
    getMatchPlayerSeasonTeamId, getMatchScoreboards, getMatchMyTeamAvailablePlayers,
    setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard, matchSeasonTeamEndPhase, totalsObject
} from "../../reducers/matches";
import { createMatchNewGameScores, createScore, updateScore, deleteScore } from "../../reducers/scores";
import {
    getLoggedInPlayerFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore,
    updateScoreFetchingFromStore,
    createNewScoreFetchingFromStore,
    getMatchPlayerSeasonTeamIdFromStore,
    getMatchMyTeamAvailablePlayersFromStore,
    getMatchMyTeamAvailablePlayersFetchingFromStore,
    getMatchMyTeamOfflineScoreboardFromStore,
    getMatchRivalTeamOfflineScoreboardFromStore,
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
    DesktopSm, TimesLg
} from "../../utilities/icons";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Select from 'react-select';

const blind = {
    label: 'BLIND',
    value : 'BLIND',
    id : 0
};

const turnPlaceholders = [
    'Jugador abridor', 'Segundo jugador', 'Tercer Jugador', 'Jugador cerrador'
];

@connect(
    store => ({
        loggedInPlayer: getLoggedInPlayerFromStore(store),
        matchScoreboards: getMatchScoreboardsFromStore(store),
        matchPlayerSeasonTeamId: getMatchPlayerSeasonTeamIdFromStore(store),
        matchMyTeamAvailablePlayers: getMatchMyTeamAvailablePlayersFromStore(store),
        matchMyTeamOfflineScoreboard: getMatchMyTeamOfflineScoreboardFromStore(store),
        matchRivalTeamOfflineScoreboard: getMatchRivalTeamOfflineScoreboardFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
        fetchingMatchMyTeamAvailablePlayers: getMatchMyTeamAvailablePlayersFetchingFromStore(store),
        fetchingCreateMatchNewGameScores: createNewScoreFetchingFromStore(store),
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
    }),
    { getMatchScoreboards, getMatchPlayerSeasonTeamId, getMatchMyTeamAvailablePlayers, createMatchNewGameScores,
        updateScore, matchSeasonTeamEndPhase, setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        loggedInPlayer: PropTypes.object.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        matchPlayerSeasonTeamId: PropTypes.number.isRequired,
        matchMyTeamAvailablePlayers: PropTypes.array,
        matchMyTeamOfflineScoreboard: PropTypes.object,
        matchRivalTeamOfflineScoreboard: PropTypes.object,
        fetchingMatchScoreboards: PropTypes.bool,
        fetchingMatchMyTeamAvailablePlayers: PropTypes.bool,
        fetchingCreateMatchNewGameScores: PropTypes.bool,
        fetchingUpdateScore: PropTypes.bool,
        getMatchScoreboards: PropTypes.func.isRequired,
        getMatchPlayerSeasonTeamId: PropTypes.func,
        getMatchMyTeamAvailablePlayers: PropTypes.func,
        createMatchNewGameScores: PropTypes.func,
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
            playerSelectionDialogOpen: false,
            pollingTime: 30,
            usingMyTeamOfflineScoreboard: false,
            usingRivalTeamOfflineScoreboard: false,
            selectedPlayers: selectedPlayers
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
                    this.setPlayerSelectionDialogOpenAsRequired();
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
                this.matchScoreboardsPoller();

                // Check if player's team is in 'select game players phase', and if so, open dialog for players selection
                if (getTeamIdPromise !== null){
                    getTeamIdPromise.then(() => this.setPlayerSelectionDialogOpenAsRequired());
                }
            }
        });
    }

    loadMatchScoreboards = () => {
        const { matchId } = this.props.match.params;
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

    setPlayerSelectionDialogOpen = (open = false) => {
        this.setState({playerSelectionDialogOpen : open});
    };

    gameScoresCount = (playersScores, gameIndex) => {
        if (playersScores.length === 0)
            return 0;

        let count = 0;
        playersScores.map(playerScore => {
            if (playerScore[gameIndex] !== undefined){
                count++;
            }
        });
        return count;
    };

    setPlayerSelectionDialogOpenAsRequired = () => {
        if (this.isMatchPlayer()){
            if (this.getMatchMyTeam().data.gamesConfirmed !== null) {
                if (this.gameScoresCount(this.getMatchMyTeam().results.playersScores, this.matchPhaseByMyTeamGamesConfirmed()) === 0) {
                    if (!this.state.playerSelectionDialogOpen)
                        this.setPlayerSelectionDialogOpen(true);
                } else if (this.state.playerSelectionDialogOpen)
                    this.setPlayerSelectionDialogOpen(false);
            } else if (this.state.playerSelectionDialogOpen)
                this.setPlayerSelectionDialogOpen(false);
        }
    };

    handlePlayerSelectionDialogEnter = () => {
        const { matchId } = this.props.match.params;
        this.props.getMatchMyTeamAvailablePlayers(matchId, this.props.matchPlayerSeasonTeamId);
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
        const { matchId } = this.props.match.params;
        const { matchPlayerSeasonTeamId } = this.props;
        this.props.matchSeasonTeamEndPhase(matchId, matchPlayerSeasonTeamId, this.matchPhase())
            .then(response => {

            })
            .finally(() => {
                this.loadMatchScoreboardsWithCallbacks(this.setPlayerSelectionDialogOpenAsRequired);
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
                    if (team.data.gamesConfirmed === null){
                        element = <button className={`btn btn-md btn-success`} onClick={this.seasonTeamEndPhase}>Terminar calentamiento</button>
                    } else {
                        element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Esperando al rival</div>
                    }
                } else {
                    if (this.gameScoresCount(team.results.playersScores, this.matchPhase()) === 0){
                        element = <div className={`btn btn-md `} style={{background: 'gold', color: 'white'}}>Seleccionando jugadores</div>
                    } else {
                        element = <button className={`btn btn-md btn-success`} onClick={this.seasonTeamEndPhase}>Terminar Linea</button>
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

    prepareScoreDataForSelectedPlayers = () => {
        const { matchId } = this.props.match.params;
        const newGameNumber = this.getMatchMyTeam().data.gamesConfirmed !== null ?
            this.getMatchMyTeam().data.gamesConfirmed + 1 : 0;
        let scoresData = [];
        let turnNumber = 1;
        this.state.selectedPlayers.map(player => {
            let scoreData = {
                season_player_id: player.id,
                match_id: matchId,
                game_number: newGameNumber,
                turn_number: turnNumber++,
                score: 0,
                handicap: player.handicap,
            };

            scoresData.push(scoreData);
        });

        return scoresData;
    };

    createSelectedPlayersNewGameScores = () => {
        if (!this.isMatchPlayer())
            return;

        const scoresData = this.prepareScoreDataForSelectedPlayers();
        this.props.createMatchNewGameScores(scoresData)
            .then(() => {
                this.setPlayerSelectionDialogOpen(false);
                this.loadMatchScoreboards();
            })
            .catch(jqXHR => {
                alert('Error: No fue posible crear los marcadores y comenzar la linea.');
            });
    };

    check4PlayersSelected = () => {
        const { selectedPlayers } = this.state;
        for (let i = 0 ; i < selectedPlayers.length; i++){
            if (selectedPlayers[i] === null)
                return false;
        }

        return true;
    };

    validateSelectedPlayers = () => {
        if (!this.check4PlayersSelected()){
            return {
                valid: false,
                failId: 0,
                reason: 'Aún no se seleccionan los 4 jugadores',
            };
        }

        let valid = true;
        let womens = 0, mens = 0;
        this.state.selectedPlayers.map(player => {
            if (player.gender){
                if (player.gender === 'M')
                    mens++;
                else if (player.gender === 'F')
                    womens++;
            }
        });

        if (womens === 0){
            return {
                valid: false,
                failId: 1,
                reason: 'Se requiere que por lo menos un hombre participe en el juego.'
            };
        }
        if (mens === 0){
            return {
                valid: false,
                failId: 2,
                reason: 'Se requiere que por lo menos una mujer participe en el juego.'
            };
        }

        return {
            valid: true,
            failId: -1,
            reason: '',
        };
    };

    selectablePlayers = () => {
        let players = [];
        const { matchMyTeamAvailablePlayers } = this.props;
        let selectedPlayersId = [];
        this.state.selectedPlayers.map(player => {
            if (player !== null)
                selectedPlayersId.push(player.id);
        });

        matchMyTeamAvailablePlayers.map(player => {
            if (!selectedPlayersId.includes(player.id)){
                let p = {};
                p.label = player.fullName + ' - HDCP: ' + player.handicap;
                if (player.handicap === null)
                    p.label = player.fullName + ' - HDCP: Debe jugar 3 lineas';
                p.value = player.fullName;
                p.id = player.id;
                p.handicap = player.handicap;
                p.category = player.category;
                p.gender = player.gender;
                players.push(p);
            }
        });

        if (!selectedPlayersId.includes(0))
            players.push(blind);

        return players;
    };

    handlePlayerSelected = (v, a, turnNumber) => {
        if (a.action === 'select-option'){
            let playerData = {};
            playerData.value = v.value;
            playerData.label = v.value;
            playerData.name = v.value;
            playerData.id = v.id;
            playerData.handicap = v.handicap;
            playerData.gender = v.gender;
            playerData.category = v.category;
            let updatedSelectedPlayers = this.state.selectedPlayers;
            updatedSelectedPlayers[turnNumber-1] = playerData;
            this.setState({ selectedPlayers : updatedSelectedPlayers });
            const validSelectedPlayers = this.validateSelectedPlayers();

            if (!validSelectedPlayers.valid){
                if (validSelectedPlayers.failId === 1 ||
                    validSelectedPlayers.failId === 2 ) {
                    //TODO: Use pretty alert dialog
                    alert(validSelectedPlayers.reason);
                }
            }
        }
    };

    handlePlayerDeselect = turnNumber => {
        let updatedSelectedPlayers = this.state.selectedPlayers;
        updatedSelectedPlayers[turnNumber-1] = null;
        this.setState({ selectedPlayers : updatedSelectedPlayers })
    };

    playerSelectBox = turnNumber => {
        const player = this.state.selectedPlayers[(turnNumber-1)];
        let playerBox = null;
        if (player === null){
            playerBox = <Select
                menuShouldScrollIntoView={true}
                className='mb-3 mt-2'
                placeholder={turnPlaceholders[turnNumber-1]}
                value={player}
                onChange={(value, action) => this.handlePlayerSelected(value, action, turnNumber)}
                options={this.selectablePlayers()}
            />;
        } else {
            let hdcpBoxContent = player.id === 0 ? <small><b>&nbsp;100 Pines</b></small> :
                <small>HDCP : <b>{player.handicap === null ? '¿ ?' : player.handicap < 10 ? `\u00A0${player.handicap}\u00A0` : player.handicap}</b></small>;
            playerBox = <div className='d-flex flex-row mb-3 mt-2'>
                <span className='input-group-text player-selection-handicap'>{hdcpBoxContent}</span>
                <input readOnly className={`form-control player-category-${player.category}`} value={player.name}/>
                <button onClick={() => this.handlePlayerDeselect(turnNumber)} className='btn btn-sm btn-danger'>
                    <TimesLg className='form-control'/>
                </button>
            </div>;
        }

        return playerBox;
    };

    renderPlayersSelectionDialog = () => {
        let button = null;
        if (!this.props.fetchingMatchMyTeamAvailablePlayers && !this.props.fetchingCreateMatchNewGameScores){
            let buttonEnabled = true, buttonOnClick = this.createSelectedPlayersNewGameScores, buttonStyle = {};
            if (!this.validateSelectedPlayers().valid){
                buttonEnabled = false;
                buttonOnClick = () => {
                    //TODO: Use pretty alert dialog
                    alert('¡Aún no se han ingresado los jugadores correctamente!');
                };
                buttonStyle = {
                    opacity: '0.70'
                };
            }
            button = <button className={`btn btn-lg ${buttonEnabled ? 'btn-success' : 'btn-danger'}`}
                        style={buttonStyle} onClick={buttonOnClick}>Aceptar</button>;
        }

        let dialogTitle = this.props.fetchingMatchMyTeamAvailablePlayers ? 'Cargando Jugadores...' :
            this.props.fetchingCreateMatchNewGameScores ? 'Creando Marcadores...' : 'Ingreso de Jugadores';


        return <Dialog aria-labelledby='dialog-title'
                disableBackdropClick
                disableEscapeKeyDown
                open={this.state.playerSelectionDialogOpen}
                onEnter={this.handlePlayerSelectionDialogEnter}
                onClose={() => this.setPlayerSelectionDialogOpen(false)}
                >
                <DialogTitle id='dialog-title'>{dialogTitle}</DialogTitle>
                <DialogContent style={{overflow: 'auto'}}>
                    {this.props.fetchingMatchMyTeamAvailablePlayers || this.props.fetchingCreateMatchNewGameScores ?
                        <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'#488aaa'}/></div> :
                        this.props.matchMyTeamAvailablePlayers.length !== 0 ?
                            <div className='d-flex flex-column justify-content-center'>
                                { this.playerSelectBox(1) }
                                { this.playerSelectBox(2) }
                                { this.playerSelectBox(3) }
                                { this.playerSelectBox(4) }
                            </div> : null
                    }
                </DialogContent>
                {button}
            </Dialog>
    };

    render() {
        if (_.isEmpty(this.props.matchScoreboards)){
            // if (this.props.fetchingMatchScoreboards) {
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
            // } else return null;
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
