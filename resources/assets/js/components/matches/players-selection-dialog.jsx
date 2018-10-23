import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getMatchMyTeamAvailablePlayers } from '../../reducers/matches';
import { getMatchMyTeamAvailablePlayersFromStore, getMatchMyTeamAvailablePlayersFetchingFromStore,
        createMatchNewGameScoresFetchingFromStore } from '../../reducers/getters';
import { createMatchNewGameScores } from "../../reducers/scores";

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import ReactLoading from "react-loading";
import {TimesLg} from "../../utilities/icons";
import Select from "react-select";
import _ from "lodash";
import PlayerSelectBox from "./player-select-box";

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
            selectedPlayers: selectedPlayers
        };
    }

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
        //TODO: Don't let a making handicap player abandon the game, as well as dont letting a player with no handicap enter 2nd nor 3rd game
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

        return {
            valid: true,
            failId: -1,
            reason: '',
        };
    };

    getAvailablePlayersBasedInIdsArray = (idsArray, notInArray = true) => {
        let players = [];
        this.props.matchMyTeamAvailablePlayers.map(player => {
            if (notInArray && !idsArray.includes(player.id) ||
                !notInArray && idsArray.includes(player.id)) {
                let p = {};
                p.label = player.fullName + ' - HDCP: ' + player.handicap;
                if (player.handicap === null)
                    p.label = player.fullName + ' - HDCP: Debe jugar 3 lineas';
                p.value = player.fullName;
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

    selectLastGamePlayers = () => {

        const gameIndex = scoreIdGameNumberIndex[this.props.teamGamesConfirmed-1];
        let lastGamePlayersIds = [];
        this.props.playersScores.map(player => {
            if (player[gameIndex] !== undefined){
                lastGamePlayersIds.push(player.seasonPlayerId);
            }
        });

        let players = this.getAvailablePlayersBasedInIdsArray(lastGamePlayersIds, false);

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
            playerData.value = player.value;
            playerData.label = player.value;
            playerData.name = player.value;
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
            playerData.value = v.value;
            playerData.label = v.value;
            playerData.name = v.value;
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

    render() {

        let button = null, selectablePlayers = null;
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
                            </div> : null
                    }
                </DialogContent>
                {button}
            </Dialog>
        );
    }
}
