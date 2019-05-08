import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ActionsDialog from "../../utils/actions-dialog";
import {gameNumberStrings} from "../match";
import {connect} from "react-redux";
import selectors from "../../../reducers/selectors";
import {
    setEndPhaseDialogOpen,
} from "../../../reducers/match";

@connect(
    store => ({
        isOpen: selectors.matchEndPhase(store).isDialogOpen,
    }),
    {
        setEndPhaseDialogOpen
    }
)
export default class EndPhaseDialog extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        setEndPhaseDialogOpen: PropTypes.func.isRequired,
        matchPhase: PropTypes.string.isRequired,
        endPhaseCallback: PropTypes.func.isRequired
    };

    handleDialogClose = () => {
        const { setEndPhaseDialogOpen } = this.props;
        setEndPhaseDialogOpen(false);
    };

    getDialogComponents = () => {
        const {
            matchPhase,
            setEndPhaseDialogOpen,
            endPhaseCallback
        } = this.props;

        const dialogTitle = 'Terminar Linea';
        const dialogDescription = `Estás por terminar la ${gameNumberStrings[matchPhase].toLowerCase()} del juego... `;
        const dialogActions = [
            {
                text: 'Cancelar',
                props: {
                    onClick: () => setEndPhaseDialogOpen(false),
                    color: 'primary'
                }
            },
            {
                text: 'Continuar',
                props: {
                    onClick: () => {
                        setEndPhaseDialogOpen(false);
                        endPhaseCallback();
                    },
                    color: 'primary',
                    autoFocus: true
                }
            }
        ];

        return {
            dialogTitle,
            dialogDescription,
            dialogActions
        };
    };

    render() {
        const { isOpen } = this.props;
        const {
            dialogTitle,
            dialogDescription,
            dialogActions
        } = this.getDialogComponents();
        return <ActionsDialog
            isOpen={isOpen}
            onClose={this.handleDialogClose}
            easyDisposable={true}
            title={dialogTitle}
            description={dialogDescription}
            actions={dialogActions}
        />;
    }
}
