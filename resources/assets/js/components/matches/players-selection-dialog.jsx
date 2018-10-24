import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getMatchMyTeamAvailablePlayers } from '../../reducers/matches';
import { getMatchMyTeamAvailablePlayersFromStore, getMatchMyTeamAvailablePlayersFetchingFromStore,
        createMatchNewGameScoresFetchingFromStore } from '../../reducers/getters';
import { createMatchNewGameScores } from "../../reducers/scores";
import {UnmountClosed as Collapse} from 'react-collapse';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import ReactLoading from "react-loading";
import {QuestionCircleLg, QuestionCircleSm, TimesLg} from "../../utilities/icons";
import _ from "lodash";
import PlayerSelectBox from "./player-select-box";
import PropTypes from 'prop-types';


const blind = {
    label: 'BLIND',
    value: 'BLIND',
    name: 'BLIND',
    id : 0
};

const scoreIdGameNumberIndex = [
    'firstGame',
    'secondGame',
    'thirdGame',
];

@connect(
    store => ({
        matchMyTeamAvailablePlayers: getMatchMyTeamAvailablePlayersFromStore(store),
        fetchingMatchMyTeamAvailablePlayers: getMatchMyTeamAvailablePlayersFetchingFromStore(store),
        fetchingCreateMatchNewGameScores: createMatchNewGameScoresFetchingFromStore(store),
    }),
    { getMatchMyTeamAvailablePlayers, createMatchNewGameScores }
)
export default class PlayersSelectionDialog extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        matchId: PropTypes.number.isRequired,
        seasonTeamId: PropTypes.number.isRequired,
        teamMatchPhase: PropTypes.string.isRequired,
        teamGamesConfirmed: PropTypes.number,
        playersScores: PropTypes.array.isRequired,
        setPlayerSelectionDialogOpen: PropTypes.func.isRequired,
        loadMatchScoreboards: PropTypes.func.isRequired,

        getMatchMyTeamAvailablePlayers: PropTypes.func.isRequired,
        fetchingMatchMyTeamAvailablePlayers: PropTypes.bool.isRequired,
        matchMyTeamAvailablePlayers: PropTypes.array.isRequired,
        createMatchNewGameScores: PropTypes.func.isRequired,
        fetchingCreateMatchNewGameScores: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        const selectedPlayers = [
            null, null, null, null
        ];

        this.state = {
            selectedPlayers: selectedPlayers,
            descriptionOpen: false,
            playerCategoryDescriptionOpen: false
        };
    }

    toggleDescriptionOpen = () => {
        const open = this.state.descriptionOpen;
        this.setState({descriptionOpen: !open});
    };

    togglePlayerCategoryDescriptionOpen = () => {
        const open = this.state.playerCategoryDescriptionOpen;
        this.setState({playerCategoryDescriptionOpen: !open});
    };

    handlePlayerSelectionDialogEnter = () => {
        const { matchId, seasonTeamId, getMatchMyTeamAvailablePlayers, teamMatchPhase } = this.props;
        getMatchMyTeamAvailablePlayers(matchId, seasonTeamId)
            .then(() => {
                if (teamMatchPhase !== 'firstGame')
                    this.selectLastGamePlayers();
            });
    };

    prepareScoreDataForSelectedPlayers = () => {
        if (this.props.teamGamesConfirmed === null)
            return ;

        const { matchId } = this.props;
        const newGameNumber = this.props.teamGamesConfirmed + 1;
        let scoresData = [];
        let turnNumber = 1;
        this.state.selectedPlayers.map(player => {
            let scoreData = {
                season_player_id: player.id === 0 ? null : player.id,
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
        const { matchId } = this.props;
        const { seasonTeamId } = this.props;
        const scoresData = this.prepareScoreDataForSelectedPlayers();
        this.props.createMatchNewGameScores(matchId, seasonTeamId, scoresData)
            .then(() => {
                this.props.setPlayerSelectionDialogOpen(false);
                this.props.loadMatchScoreboards();
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

        let validation = {
            valid: true,
            failId: -1,
            reason: '',
        };
        let womens = 0, mens = 0;
        let selectedPlayersId = [];
        this.state.selectedPlayers.map(player => {
            if (player.id !== 0){
                selectedPlayersId.push(player.id);
                if (player.gender === 'M')
                    mens++;
                else if (player.gender === 'F')
                    womens++;

                if (player.handicap === null) {
                    if (this.props.teamGamesConfirmed > player.unconcluded.gamesPlayed){
                        const prefix = player.gender === 'M' ? 'El jugador ' : "La jugadora ";
                        validation = {
                            valid: false,
                            failId: 3,
                            reason: `¡${prefix + player.name} no puede ingresar ya que primero debe jugar una jornada completa (3 lineas) para hacer handicap!`
                        };
                    }
                }
            }
        });

        if (!validation.valid)
            return validation;

        if (womens === 0){
            return {
                valid: false,
                failId: 1,
                reason: 'Se requiere que por lo menos una mujer participe en el juego.'
            };
        }
        if (mens === 0){
            return {
                valid: false,
                failId: 2,
                reason: 'Se requiere que por lo menos un hombre participe en el juego.'
            };
        }

        this.getLastGamePlayers().map(player => {
            if (!selectedPlayersId.includes(player.id)){
                if (player.handicap === null){
                    const prefix = player.gender === 'M' ? 'El jugador ' : "La jugadora ";
                    validation = {
                        valid: false,
                        failId: 4,
                        reason: `¡${prefix + player.name} no puede abandonar el juego ya que debe completar 3 lineas para hacer handicap!`
                    };
                }
            }
        });

        return validation;
    };

    getAvailablePlayersBasedInIdsArray = (idsArray, notInArray = true) => {
        let players = [];
        this.props.matchMyTeamAvailablePlayers.map(player => {
            if (notInArray && !idsArray.includes(player.id) ||
                !notInArray && idsArray.includes(player.id)) {
                let p = {};
                p.label = player.fullName;
                p.name = player.fullName;
                p.id = player.id;
                p.handicap = player.handicap;
                p.category = player.category;
                p.gender = player.gender;
                p.unconcluded = player.unconcluded;
                players.push(p);
            }
        });
        if (notInArray && !idsArray.includes(0) ||
            !notInArray && idsArray.includes(0))
            players.push(blind);

        return players;
    };

    getLastGamePlayersIdArray = () => {
        const gameIndex = scoreIdGameNumberIndex[this.props.teamGamesConfirmed-1];
        let lastGamePlayersIds = [];
        this.props.playersScores.map(player => {
            if (player[gameIndex] !== undefined){
                lastGamePlayersIds.push(player.seasonPlayerId);
            }
        });

        return lastGamePlayersIds;
    };

    getLastGamePlayers = () => {
        return this.getAvailablePlayersBasedInIdsArray(this.getLastGamePlayersIdArray(), false)
    };

    selectLastGamePlayers = () => {
        const gameIndex = scoreIdGameNumberIndex[this.props.teamGamesConfirmed-1];
        let players = this.getLastGamePlayers();
        let selectedPlayers = [null,null,null,null];
        let blindTurnNumber = '1234';
        players.map(player => {
            let turnNumber = 0;
            this.props.playersScores.map(p => {
                if (player.id === p.seasonPlayerId){
                    if (player.id !== 0){
                        turnNumber = p[gameIndex].turnNumber;
                        blindTurnNumber = _.replace(blindTurnNumber, ""+turnNumber, "");
                    } else {
                        turnNumber = Number(blindTurnNumber);
                    }
                }
            });
            let playerData = {};
            playerData.name = player.name;
            playerData.id = player.id;
            playerData.handicap = player.handicap;
            playerData.gender = player.gender;
            playerData.category = player.category;
            playerData.unconcluded = player.unconcluded;
            selectedPlayers[turnNumber - 1] = playerData;
        });

        this.setState({ selectedPlayers : selectedPlayers });
    };

    selectablePlayers = () => {
        let selectedPlayersId = [];
        this.state.selectedPlayers.map(player => {
            if (player !== null)
                selectedPlayersId.push(player.id);
        });
        let players = this.getAvailablePlayersBasedInIdsArray(selectedPlayersId);
        return players;
    };

    handlePlayerSelected = (v, a, turnNumber) => {
        if (a.action === 'select-option'){
            let playerData = {};
            playerData.name = v.name;
            playerData.id = v.id;
            playerData.handicap = v.handicap;
            playerData.gender = v.gender;
            playerData.category = v.category;
            playerData.unconcluded = v.unconcluded;
            let updatedSelectedPlayers = this.state.selectedPlayers;
            updatedSelectedPlayers[turnNumber-1] = playerData;
            this.setState({ selectedPlayers : updatedSelectedPlayers });
            const validSelectedPlayers = this.validateSelectedPlayers();
            if (!validSelectedPlayers.valid){
                if (validSelectedPlayers.failId !== 0) {
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

    playerSelectBox = (turnNumber, selectablePlayers) => {
        const player = this.state.selectedPlayers[(turnNumber-1)];
        return (
            <PlayerSelectBox
                player={player}
                turnNumber={turnNumber}
                selectablePlayers={selectablePlayers}
                handlePlayerSelected={this.handlePlayerSelected}
                handlePlayerDeselect={this.handlePlayerDeselect}
            />
        );
    };

    getTotalHandicap = () => {
        let handicap = 0;
        this.state.selectedPlayers.map(p => {
            if (p !== null && p.id !== 0){
                if (p.handicap !== null)
                    handicap += Number(p.handicap);
                else if (p.unconcluded.handicap !== null) {
                    handicap += Number(p.unconcluded.handicap);
                }
            }
        });

        return handicap;
    };

    pendingHandicapExplanationDialog = () => {
        //TODO: pretty alert;
        alert("El jugador debe de participar en los 3 juegos de una jornada para que su handicap sea calculado y asignado.")
    };

    renderDescription = () => {
        return (
            <div className='mb-1' style={{textAlign: 'center'}}>
                <div onClick={this.toggleDescriptionOpen} style={{cursor: 'pointer'}}>
                    <QuestionCircleLg style={{width: '100%', margin: '0 auto'}}/>
                </div>
                <Collapse
                    style={{width: '100%', margin: '0 auto'}}
                    isOpened={this.state.descriptionOpen}
                    hasNestedCollapse={true}
                >
                    <div className='player-selection-dialog-legend'>
                        <span className='handicap-description'>Handicap</span>
                        <span onClick={this.pendingHandicapExplanationDialog} style={{cursor: 'pointer'}}
                          className='pending-handicap-description'>Handicap pendiente <QuestionCircleSm/></span>
                        <span className='blind-handicap-description'>Sin handicap, 100 pines netos</span>
                    </div>
                    <div>
                    <span style={{color: 'blue', textDecoration: 'underline', width: '100%', margin: '0 auto', cursor: 'pointer'}}
                        onClick={this.togglePlayerCategoryDescriptionOpen}> Categorías de Jugador:</span>
                        <Collapse style={{margin: '0 auto'}} isOpened={this.state.playerCategoryDescriptionOpen}>
                            <div className='player-selection-dialog-legend-player-categories'>
                                <span className='player-category-AA'>AA</span>
                                <span className='player-category-A'>A</span>
                                <span className='player-category-B'>B</span>
                                <span className='player-category-C'>C</span>
                            </div>
                        </Collapse>
                    </div>
                </Collapse>
            </div>
        );
    };

    render() {
        let button = null, selectablePlayers = null;
        if (!this.props.fetchingMatchMyTeamAvailablePlayers && !this.props.fetchingCreateMatchNewGameScores){
            let buttonEnabled = true, buttonOnClick = this.createSelectedPlayersNewGameScores, buttonStyle = {};
            if (!this.validateSelectedPlayers().valid){
                buttonEnabled = false;
                buttonOnClick = () => {
                    alert(this.validateSelectedPlayers().reason);
                };
                buttonStyle = {
                    opacity: '0.70'
                };
            }
            button = (
                <button
                    className={`btn btn-lg ${buttonEnabled ? 'btn-success' : 'btn-danger'}`}
                    style={buttonStyle}
                    onClick={buttonOnClick}>Aceptar</button>
            );
            selectablePlayers = this.selectablePlayers();
        }

        let dialogTitle = this.props.fetchingMatchMyTeamAvailablePlayers ? 'Cargando Jugadores...' :
            this.props.fetchingCreateMatchNewGameScores ? 'Creando Marcadores...' : 'Ingreso de Jugadores';

        return (
            <Dialog
                aria-labelledby='dialog-title'
                disableBackdropClick
                disableEscapeKeyDown
                open={this.props.isOpen}
                onEnter={this.handlePlayerSelectionDialogEnter}
            >
                <DialogTitle id='dialog-title'>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {this.props.fetchingMatchMyTeamAvailablePlayers || this.props.fetchingCreateMatchNewGameScores ?
                        <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'#488aaa'}/></div> :
                        this.props.matchMyTeamAvailablePlayers.length !== 0 ?
                            <div className='d-flex flex-column justify-content-center'>
                                <div style={{alignContent: 'center'}}><p>Total Handicap: <b>{this.getTotalHandicap()}</b></p></div>
                                { this.playerSelectBox(1, selectablePlayers) }
                                { this.playerSelectBox(2, selectablePlayers) }
                                { this.playerSelectBox(3, selectablePlayers) }
                                { this.playerSelectBox(4, selectablePlayers) }
                                { this.renderDescription() }
                            </div> : null
                    }
                </DialogContent>
                {button}
            </Dialog>
        );
    }
}
