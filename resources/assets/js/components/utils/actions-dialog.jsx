import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

export default class ActionsDialog extends Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onEnter: PropTypes.func,
        onClose: PropTypes.func,
        easyDisposable: PropTypes.bool.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        customContentComponent: PropTypes.any,
        actions: PropTypes.arrayOf(PropTypes.object),
        customActionsComponent: PropTypes.any
    };

    renderDialogTitle = () => {
        if (_.isUndefined(this.props.title) || _.isNull(this.props.title))
            return null;
        return <DialogTitle id='dialog-title'>{this.props.title}</DialogTitle>;
    };

    renderDialogContent = () => {
        if (!_.isUndefined(this.props.customContentComponent) && !_.isNull(this.props.customContentComponent))
            return this.props.customContentComponent;

        return <DialogContent>
            <DialogContentText id="dialog-description">
                {this.props.description}
            </DialogContentText>
        </DialogContent>;
    };

    renderDialogActions = () => {

        if (!_.isUndefined(this.props.customActionsComponent) && !_.isNull(this.props.customActionsComponent))
            return this.props.customActionsComponent;

        if (_.isUndefined(this.props.actions) || _.isNull(this.props.actions) || _.isEmpty(this.props.actions))
            return null;

        let keys = 0;
        return <DialogActions>
            {
                this.props.actions.map(action =>
                    <Button {...action.props} key={keys++}>
                        {action.text}
                    </Button>)
            }
        </DialogActions>;
    };

    render() {
        return (
            <Dialog
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
                disableBackdropClick={!this.props.easyDisposable}
                disableEscapeKeyDown={!this.props.easyDisposable}
                open={this.props.isOpen}
                onEnter={this.props.onEnter}
                onClose={this.props.onClose}
            >
                {this.renderDialogTitle()}
                {this.renderDialogContent()}
                {this.renderDialogActions()}
            </Dialog>);
    }
}
