import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { bool, func, string, any, arrayOf, shape, object } from 'prop-types';

export default class ActionsDialog extends Component {
    static propTypes = {
        isOpen: bool.isRequired,
        onEnter: func,
        onClose: func,
        easyDisposable: bool.isRequired,
        title: string,
        description: string,
        customContentComponent: any,
        actions: arrayOf(shape({
            props: object.isRequired,
            text: string.isRequired,
        })),
        customActionsComponent: any
    };

    renderDialogTitle = () => {
        const { title } = this.props;
        if (_.isUndefined(title) || _.isNull(title))
            return null;
        return <DialogTitle id='dialog-title'>{title}</DialogTitle>;
    };

    renderDialogContent = () => {
        const { customContentComponent, description } = this.props;
        if (!_.isUndefined(customContentComponent) && !_.isNull(customContentComponent))
            return customContentComponent;

        return <DialogContent>
            <DialogContentText id="dialog-description">
                {description}
            </DialogContentText>
        </DialogContent>;
    };

    renderDialogActions = () => {
        const { customActionsComponent, actions } = this.props;
        if (!_.isUndefined(customActionsComponent) && !_.isNull(customActionsComponent))
            return customActionsComponent;

        if (_.isUndefined(actions) || _.isNull(actions) || _.isEmpty(actions))
            return null;

        let keys = 0;
        return <DialogActions>
            {
                actions.map(action =>
                    <Button
                        {...action.props}
                        key={keys++}
                    >
                        {action.text}
                    </Button>)
            }
        </DialogActions>;
    };

    render() {
        const { isOpen, onEnter, onClose, easyDisposable } = this.props;
        return (
            <Dialog
                open={isOpen}
                onEnter={onEnter}
                onClose={onClose}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
                disableBackdropClick={!easyDisposable}
                disableEscapeKeyDown={!easyDisposable}
            >
                {this.renderDialogTitle()}
                {this.renderDialogContent()}
                {this.renderDialogActions()}
            </Dialog>);
    }
}
