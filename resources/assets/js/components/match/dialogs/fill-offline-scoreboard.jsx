import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ActionsDialog from "../../utils/actions-dialog";
import {gameNumberStrings} from "../match";

export default class FillOfflineScoreboard extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        setFillOfflineScoreboardDialogOpen: PropTypes.func.isRequired,
        fillScoreboardCallback: PropTypes.func.isRequired
    };

    render() {
        const dialogTitle = 'Actualizar Marcador (Offline)';
        const dialogDescription = 'Se actualizarán tus marcadores offline ';
        const dialogActions = [
            {
                text: 'Cancelar',
                props: {
                    onClick: () => this.props.setFillOfflineScoreboardDialogOpen(false),
                    color: 'primary'
                }
            },
            {
                text: 'Continuar',
                props: {
                    onClick: () => {
                        this.props.setFillOfflineScoreboardDialogOpen(false);
                        this.props.endPhaseCallback();
                    },
                    color: 'primary',
                    autoFocus: true
                }
            }
        ];

        return <ActionsDialog
            isOpen={this.props.isOpen}
            onClose={() => {this.props.setFillOfflineScoreboardDialogOpen(false);}}
            easyDisposable={true}
            title={dialogTitle}
            description={dialogDescription}
            actions={dialogActions}
        />;
    }
}
