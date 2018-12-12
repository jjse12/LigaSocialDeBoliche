import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ActionsDialog from "../../utils/actions-dialog";
import {gameNumberStrings} from "../match";

export default class EndPhaseDialog extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        setEndPhaseDialogOpen: PropTypes.func.isRequired,
        matchPhase: PropTypes.string.isRequired,
        endPhaseCallback: PropTypes.func.isRequired
    };

    render() {
        const dialogTitle = 'Terminar Linea';
        const dialogDescription = `Estás por terminar la ${gameNumberStrings[this.props.matchPhase].toLowerCase()} del juego... `;
        const dialogActions = [
            {
                text: 'Cancelar',
                props: {
                    onClick: () => this.props.setEndPhaseDialogOpen(false),
                    color: 'primary'
                }
            },
            {
                text: 'Continuar',
                props: {
                    onClick: () => {
                        this.props.setEndPhaseDialogOpen(false);
                        this.props.endPhaseCallback();
                    },
                    color: 'primary',
                    autoFocus: true
                }
            }
        ];

        return <ActionsDialog
            isOpen={this.props.isOpen}
            onClose={() => {this.props.setEndPhaseDialogOpen(false);}}
            easyDisposable={true}
            title={dialogTitle}
            description={dialogDescription}
            actions={dialogActions}
        />;
    }
}
