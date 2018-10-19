import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createMatchNewGameScoresForLastGamePlayers } from '../../reducers/scores';
import { createMatchNewGameScoresForLastGamePlayersFetchingFromStore } from '../../reducers/getters';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ReactLoading from "react-loading";

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
        let dialogTitle = 'Nuevo Juego', dialogActions = (
            <DialogActions>
                <Button onClick={this.handleChangePlayers} color="primary">
                    ¡realizar cambios!
                </Button>
                <Button onClick={this.handleKeepPlayers} color="primary" autoFocus>
                    Si, continuar
                </Button>
            </DialogActions>
        );
        if (this.props.fetchingCreateMatchNewGameScoresForLastGamePlayers){
            dialogActions = null;
            dialogTitle = "Creando Marcadores...";
        }

        return (
            <Dialog
                aria-labelledby='keep-players-dialog-title'
                aria-describedby='keep-players-dialog-description'
                disableBackdropClick
                disableEscapeKeyDown
                open={this.props.isOpen}
            >
                <DialogTitle id='keep-players-dialog-title'>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {
                        this.props.fetchingCreateMatchNewGameScoresForLastGamePlayers ?
                            <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'#488aaa'}/></div> :
                        <DialogContentText id="keep-players-dialog-description">
                            Se iniciará el siguiente juego, ¿continuarán con los mismos jugadores?
                        </DialogContentText>
                    }
                </DialogContent>
                {dialogActions}
            </Dialog>);
    }
}
