import React, {Component} from 'react';
import { connect } from 'react-redux';
import { setNewGameDialogOpen } from "../../../reducers/match/edition";
import { setPlayerSelectionDialogOpen, createMatchNewGameScoresForLastGamePlayers } from "../../../reducers/match";
import selectors from '../../../reducers/selectors';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import ReactLoading from "react-loading";
import ActionsDialog from "../../utils/actions-dialog";
import {gameNumberStrings} from "../match";

@connect(
    store => ({
        isOpen: selectors.matchNewGame(store).isDialogOpen,
        matchId: selectors.matchSummary(store).id,
        userSeasonTeamId: selectors.userCurrentSeason(store).team.id,
        loadingCreateScoresForLastGamePlayers: selectors.loadingCreateMatchNewGameScoresForLastGamePlayers(store)
    }),
    {
        setNewGameDialogOpen,
        createMatchNewGameScoresForLastGamePlayers,
        setPlayerSelectionDialogOpen
    }
)
export default class NewGameDialog extends Component {
    static propTypes = {
        matchPhase: PropTypes.string.isRequired,
        loadMatchScoreboards: PropTypes.func.isRequired,

        isOpen: PropTypes.bool.isRequired,
        matchId: PropTypes.number.isRequired,
        userSeasonTeamId: PropTypes.number.isRequired,
        loadingCreateScoresForLastGamePlayers: PropTypes.bool.isRequired,

        setNewGameDialogOpen: PropTypes.func.isRequired,
        createMatchNewGameScoresForLastGamePlayers: PropTypes.func.isRequired,
        setPlayerSelectionDialogOpen: PropTypes.func.isRequired,
    };

    handleChangePlayers= () => {
        const { setPlayerSelectionDialogOpen, setNewGameDialogOpen } = this.props;
        setPlayerSelectionDialogOpen(true);
        setNewGameDialogOpen(false);
    };

    handleKeepPlayers = () => {
        const {
            matchId,
            userSeasonTeamId,
            createMatchNewGameScoresForLastGamePlayers,
            setNewGameDialogOpen,
            loadMatchScoreboards
        } = this.props;
        createMatchNewGameScoresForLastGamePlayers(matchId, userSeasonTeamId)
            .then(() => {
                setNewGameDialogOpen(false);
                loadMatchScoreboards();
            })
            .catch(() => {
            });
    };

    getDialogComponents = () => {
        const {
            matchPhase,
            loadingCreateScoresForLastGamePlayers
        } = this.props;
        let dialogTitle = 'Nueva Linea';
        const dialogDescription = `Se iniciará la ${gameNumberStrings[matchPhase].toLowerCase()}, ¿continuarán con los mismos jugadores?`;
        let dialogActions = null;
        let loadingComponent = null;

        if (loadingCreateScoresForLastGamePlayers){
            dialogTitle = "Creando Marcadores...";
            loadingComponent = (
                <DialogContent>
                    <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'#488aaa'}/></div>
                </DialogContent>
            );
        }
        else {
            dialogActions = [
                {
                    text: '¡Realizar cambios!',
                    props: {
                        onClick: this.handleChangePlayers,
                        color: 'primary'
                    }
                },
                {
                    text: 'Si, continuar',
                    props: {
                        onClick: this.handleKeepPlayers,
                        color: 'primary',
                        autoFocus: true
                    }
                }
            ];
        }

        return {
            dialogTitle,
            dialogDescription,
            dialogContent: loadingComponent,
            dialogActions
        };
    };

    render() {
        const { isOpen } = this.props;
        const {
            dialogTitle,
            dialogDescription,
            dialogContent,
            dialogActions
        } = this.getDialogComponents();
        return <ActionsDialog
            isOpen={isOpen}
            easyDisposable={false}
            title={dialogTitle}
            description={dialogDescription}
            customContentComponent={dialogContent}
            actions={dialogActions}
        />;
    }
}
