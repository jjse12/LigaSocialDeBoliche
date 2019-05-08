import React, {Component} from 'react';
import { connect } from 'react-redux';
import selectors from '../../../reducers/selectors';
import { createMatchNewGameScores } from "../../../reducers/match/edition/scores";
import {UnmountClosed as Collapse} from 'react-collapse';
import DialogContent from '@material-ui/core/DialogContent';
import ReactLoading from "react-loading";
import {IconQuestionCircleLg, IconQuestionCircleSm} from "../../../utilities/icons";
import _ from "lodash";
import PlayerSelectBox from "./player-select-box";
import PropTypes from 'prop-types';
import ActionsDialog from "../../utils/actions-dialog";
import {getMatchTeamAvailablePlayers, setPlayerSelectionDialogOpen} from "../../../reducers/match";

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
        isOpen: selectors.matchPlayerSelection(store).isDialogOpen,
        matchId: selectors.matchSummary(store).id,
        userSeasonTeamId: selectors.userCurrentSeasonTeamId(store),
        availablePlayers: selectors.matchPlayerSelection(store).availablePlayers,
        isLoadingMatchTeamAvailablePlayers: selectors.loadingMatchTeamAvailablePlayers(store),
        isLoadingCreateMatchNewGameScores: selectors.loadingCreateMatchNewGameScores(store),
    }),
    { setPlayerSelectionDialogOpen, getMatchTeamAvailablePlayers, createMatchNewGameScores }
)
export default class PlayersSelectionDialog extends Component {
    static propTypes = {
        teamMatchPhase: PropTypes.string.isRequired,
        teamGamesConfirmed: PropTypes.number,
        playersScores: PropTypes.array.isRequired,
        loadMatchScoreboards: PropTypes.func.isRequired,

        isOpen: PropTypes.bool.isRequired,
        matchId: PropTypes.number.isRequired,
        userSeasonTeamId: PropTypes.number.isRequired,
        availablePlayers: PropTypes.array.isRequired,
        isLoadingMatchTeamAvailablePlayers: PropTypes.bool.isRequired,
        isLoadingCreateMatchNewGameScores: PropTypes.bool.isRequired,

        setPlayerSelectionDialogOpen: PropTypes.func.isRequired,
        getMatchTeamAvailablePlayers: PropTypes.func.isRequired,
        createMatchNewGameScores: PropTypes.func.isRequired,
    };

    state = {
        selectedPlayers: [null, null, null, null],
        descriptionOpen: false,
        playerCategoryDescriptionOpen: false
    };

    toggleDescriptionOpen = () => {
        const { descriptionOpen: open} = this.state;
        this.setState({ descriptionOpen: !open });
    };

    togglePlayerCategoryDescriptionOpen = () => {
        const { playerCategoryDescriptionOpen: open} = this.state;
        this.setState({ playerCategoryDescriptionOpen: !open });
    };

    handlePlayerSelectionDialogEnter = async () => {
        const {
            matchId,
            userSeasonTeamId,
            getMatchTeamAvailablePlayers,
            teamMatchPhase
        } = this.props;
        await getMatchTeamAvailablePlayers(matchId, userSeasonTeamId);
        if (teamMatchPhase !== 'firstGame') {
            this.selectLastGamePlayers();
        }
    };

    prepareScoreDataForSelectedPlayers = () => {
        const { teamGamesConfirmed, matchId } = this.props;
        if (teamGamesConfirmed === null)
            return ;

        const newGameNumber = teamGamesConfirmed + 1;
        let scoresData = [];
        let turnNumber = 1;
        const { selectedPlayers } = this.state;
        selectedPlayers.map(player => {
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
        const {
            matchId,
            userSeasonTeamId,
            createMatchNewGameScores,
            setPlayerSelectionDialogOpen,
            loadMatchScoreboards
        } = this.props;
        const scoresData = this.prepareScoreDataForSelectedPlayers();
        createMatchNewGameScores(matchId, userSeasonTeamId, scoresData)
            .then(() => {
                setPlayerSelectionDialogOpen(false);
                loadMatchScoreboards();
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
        const { selectedPlayers } = this.state;
        selectedPlayers.map(player => {
            if (player.id !== 0){
                selectedPlayersId.push(player.id);
                if (player.gender === 'M')
                    mens++;
                else if (player.gender === 'F')
                    womens++;

                if (player.handicap === null) {
                    const { teamGamesConfirmed } = this.props;
                    if (teamGamesConfirmed > player.unconcluded.gamesPlayed){
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
        const { availablePlayers } = this.props;
        let players = [];
        availablePlayers.map(player => {
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
        const { teamGamesConfirmed, playersScores } = this.props;
        const gameIndex = scoreIdGameNumberIndex[teamGamesConfirmed-1];
        let lastGamePlayersIds = [];
        playersScores.map(player => {
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
        const { teamGamesConfirmed, playersScores } = this.props;
        const gameIndex = scoreIdGameNumberIndex[teamGamesConfirmed-1];
        let players = this.getLastGamePlayers();
        let selectedPlayers = [null,null,null,null];
        let blindTurnNumber = '1234';
        players.map(player => {
            let turnNumber = 0;
            playersScores.map(p => {
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
        const { selectedPlayers } = this.state;
        selectedPlayers.map(player => {
            if (player !== null)
                selectedPlayersId.push(player.id);
        });
        return this.getAvailablePlayersBasedInIdsArray(selectedPlayersId);
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
            const { selectedPlayers } = this.state;
            let updatedSelectedPlayers = selectedPlayers;
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
        const { selectedPlayers } = this.state;
        let updatedSelectedPlayers = selectedPlayers;
        updatedSelectedPlayers[turnNumber-1] = null;
        this.setState({ selectedPlayers : updatedSelectedPlayers })
    };

    playerSelectBox = (turnNumber, selectablePlayers) => {
        const { selectedPlayers } = this.state;
        const player = selectedPlayers[(turnNumber-1)];
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
        const { selectedPlayers } = this.state;
        selectedPlayers.map(p => {
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
        const { descriptionOpen, playerCategoryDescriptionOpen } = this.state;
        return (
            <div className='mb-1' style={{textAlign: 'center'}}>
                <div onClick={this.toggleDescriptionOpen} style={{cursor: 'pointer'}}>
                    <IconQuestionCircleLg style={{width: '100%', margin: '0 auto'}}/>
                </div>
                <Collapse
                    style={{width: '100%', margin: '0 auto'}}
                    isOpened={descriptionOpen}
                    hasNestedCollapse={true}
                >
                    <div className='player-selection-dialog-legend'>
                        <span className='handicap-description'>Handicap</span>
                        <span onClick={this.pendingHandicapExplanationDialog} style={{cursor: 'pointer'}}
                          className='pending-handicap-description'>Handicap pendiente <IconQuestionCircleSm/></span>
                        <span className='blind-handicap-description'>Sin handicap, 100 pines netos</span>
                    </div>
                    <div>
                    <span style={{color: 'blue', textDecoration: 'underline', width: '100%', margin: '0 auto', cursor: 'pointer'}}
                        onClick={this.togglePlayerCategoryDescriptionOpen}> Categorías de Jugador:</span>
                        <Collapse style={{margin: '0 auto'}} isOpened={playerCategoryDescriptionOpen}>
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

    getDialogComponents = () => {
        const {
            availablePlayers,
            isLoadingMatchTeamAvailablePlayers,
            isLoadingCreateMatchNewGameScores
        } = this.props;

        const dialogTitle = isLoadingMatchTeamAvailablePlayers ?
            'Cargando Jugadores...' :
            isLoadingCreateMatchNewGameScores ?
                'Creando Marcadores...' :
                'Ingreso de Jugadores';
        let dialogContent = <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'#488aaa'}/></div>;
        let dialogAction = null;
        if (!isLoadingMatchTeamAvailablePlayers && !isLoadingCreateMatchNewGameScores){
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
            const selectablePlayers = this.selectablePlayers();
            dialogContent = (
                <DialogContent>
                    {availablePlayers.length !== 0 ?
                        <div className='d-flex flex-column justify-content-center'>
                            <div style={{alignContent: 'center'}}><p>Total Handicap: <b>{this.getTotalHandicap()}</b>
                            </p></div>
                            {this.playerSelectBox(1, selectablePlayers)}
                            {this.playerSelectBox(2, selectablePlayers)}
                            {this.playerSelectBox(3, selectablePlayers)}
                            {this.playerSelectBox(4, selectablePlayers)}
                            {this.renderDescription()}
                        </div> : null // Render "No available players" message in dialog
                    }
                </DialogContent>
            );
            dialogAction = (
                <button
                    className={`btn btn-lg ${buttonEnabled ? 'btn-success' : 'btn-danger'}`}
                    style={buttonStyle}
                    onClick={buttonOnClick}
                >
                    Aceptar
                </button>
            );
        }

        return { dialogTitle, dialogContent, dialogAction };
    };

    render() {
        const { isOpen } = this.props;
        const { dialogTitle, dialogContent, dialogAction } = this.getDialogComponents();
        return <ActionsDialog
            isOpen={isOpen}
            onEnter={this.handlePlayerSelectionDialogEnter}
            easyDisposable={false}
            title={dialogTitle}
            customContentComponent={dialogContent}
            customActionsComponent={dialogAction}
        />;
    }
}
