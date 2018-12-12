import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createMatchNewGameScoresForLastGamePlayers } from '../../../reducers/scores';
import { createMatchNewGameScoresForLastGamePlayersFetchingFromStore } from '../../../reducers/getters';
import PropTypes from 'prop-types';
import DialogContent from '@material-ui/core/DialogContent';
import ReactLoading from "react-loading";
import ActionsDialog from "../../utils/actions-dialog";
import {gameNumberStrings} from "../match";

@connect(
    store => ({
        fetchingCreateMatchNewGameScoresForLastGamePlayers: createMatchNewGameScoresForLastGamePlayersFetchingFromStore(store)
    }),
    { createMatchNewGameScoresForLastGamePlayers }
)
export default class NewGameDialog extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        matchId: PropTypes.number.isRequired,
        matchPhase: PropTypes.string.isRequired,
        seasonTeamId: PropTypes.number.isRequired,
        setPlayerSelectionDialogOpen: PropTypes.func.isRequired,
        setNewGameDialogOpen: PropTypes.func.isRequired,
        loadMatchScoreboards: PropTypes.func.isRequired,

        createMatchNewGameScoresForLastGamePlayers: PropTypes.func.isRequired,
        fetchingCreateMatchNewGameScoresForLastGamePlayers: PropTypes.bool.isRequired
    };

    handleChangePlayers= () => {
        this.props.setPlayerSelectionDialogOpen(true);
        this.props.setNewGameDialogOpen(false);
    };

    handleKeepPlayers = () => {
        const { matchId, seasonTeamId } = this.props;
        this.props.createMatchNewGameScoresForLastGamePlayers(matchId, seasonTeamId)
            .then(() => {
                this.props.setNewGameDialogOpen(false);
                this.props.loadMatchScoreboards();
            })
            .catch(() => {
            });
    };

    render() {
        let dialogTitle = 'Nueva Linea';
        let dialogActions = null;
        let loadingComponent = null;

        if (this.props.fetchingCreateMatchNewGameScoresForLastGamePlayers){
            dialogTitle = "Creando Marcadores...";
            loadingComponent = <DialogContent>
                <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'#488aaa'}/></div>
            </DialogContent>;
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

        return <ActionsDialog
            isOpen={this.props.isOpen}
            easyDisposable={false}
            title={dialogTitle}
            description={`Se iniciará la ${gameNumberStrings[this.props.matchPhase].toLowerCase()}, ¿continuarán con los mismos jugadores?`}
            customContentComponent={loadingComponent}
            actions={dialogActions}
        />;
    }
}
