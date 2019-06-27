import React, { Component, Fragment } from 'react';
import {number, element, string, bool, func, shape, arrayOf} from 'prop-types';
import { IconEllipsisVLg } from "../../utilities/icons";
import { Menu, MenuItem , Typography} from "@material-ui/core";

export default class TeamScoreboardHeader extends Component {
    static propTypes = {
        actions: shape({
            main: arrayOf(element),
            dropDown: arrayOf(
                shape({
                    callback: func.isRequired,
                    text: string,
                    icon: element,
                    keepMenuOpen: bool,
                })
            ),
        }),
        laneNumber: number.isRequired,
        teamName: string.isRequired,
    };

    static defaultProps = {
        actions: {
            main: [],
            dropDown: []
        },
        laneNumber: 0,
        teamName: ''
    };

    state = {
        anchorEl: null,
    };

    openMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    closeMenu = () => {
        this.setState({ anchorEl: null });
    };

    renderMainActions = () => {
        const { actions: { main: mainActions } } = this.props;
        if (mainActions.length === 0) return null;
        return (
            <Fragment>
                {mainActions}
            </Fragment>
        );
    };

    renderDropDownActionsMenu = () => {
        const { actions: { dropDown: dropDownActions } } = this.props;
        if (dropDownActions.length === 0) return null;

        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return <Fragment>
            <button
                className='btn btn-sm btn-dropdown-menu-ellipsis'
                aria-label="Más"
                aria-owns={open ? 'team-menu' : null}
                aria-haspopup="true"
                onClick={this.openMenu}
            >
                <IconEllipsisVLg/>
            </button>
            <Menu
                id="team-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.closeMenu}
                PaperProps={{ id: 'menu-paper'}}
            >
                {dropDownActions.map(action => (
                    <MenuItem
                        key={action.text}
                        onClick={() => {
                            action.callback();
                            if (!action.keepMenuOpen){
                                this.closeMenu();
                            }
                        }}>
                        { action.icon || null}
                        { action.text && (
                            <Typography variant='inherit'>
                                {action.text}
                            </Typography>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </Fragment>;
    };

    render() {
        const { laneNumber, teamName } = this.props;
        return (
            <div className={'d-flex bg-semi-transparent-gradient-primary'}>
                <div style={{textAlign: 'start'}} className={'ml-1 d-flex mr-auto flex-column justify-content-center'}>
                { (laneNumber && teamName ?
                    <Fragment>
                        <h5 className={'text-light'}>Pista: #{laneNumber}</h5>
                        <h5 className={'text-light'}>{teamName}</h5>
                    </Fragment> :
                    <h5 className={'text-light'}>Cargando...</h5>
                )}
                </div>
                <div className={'mr-2 align-self-center'}>
                    <div className='d-flex flex-row align-items-center'>
                        {this.renderMainActions()}
                        {this.renderDropDownActionsMenu()}
                    </div>
                </div>
            </div>
        );
    }
}
