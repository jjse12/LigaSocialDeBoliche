import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

export default class KeepPlayersDialog extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        handleKeepPlayers: PropTypes.func.isRequired,
        handleChangePlayers: PropTypes.func.isRequired
    };

    render() {
        return (
            <Dialog
                aria-labelledby='keep-players-dialog-title'
                aria-describedby='keep-players-dialog-description'
                disableBackdropClick
                disableEscapeKeyDown
                open={this.props.isOpen}
            >
                <DialogTitle id='keep-players-dialog-title'>Nuevo Juego</DialogTitle>
                <DialogContent>
                    <DialogContentText id="keep-players-dialog-description">
                        ¿Deseas realizar algún cambio de jugador para el siguiente juego?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleChangePlayers} color="primary">
                        Si, cambiar
                    </Button>
                    <Button onClick={this.props.handleKeepPlayers} color="primary" autoFocus>
                        No, comenzar
                    </Button>
                </DialogActions>
            </Dialog>);
    }
}
