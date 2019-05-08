import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {
    IconCloudDownloadLg,
    IconCloudDownloadSm,
    IconCloudLg,
    IconDesktopLg,
    IconEllipsisVLg,
    IconEllipsisVSm
} from "../../utilities/icons";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

@connect(
    null,
    { }
)
export default class TeamScoreboardHeader extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        matchStatus: PropTypes.string.isRequired,
        isPlayerTeam: PropTypes.bool,
        usingOfflineScoreboard: PropTypes.bool,
        offlineScoreboardToggler: PropTypes.func,
        requestEndPhase: PropTypes.func,
        updateLocalScoreboard: PropTypes.func,
        teamMatchPhase: PropTypes.string,
        playerSelectionDialogOpen: PropTypes.bool,
        loadMatchScoreboards: PropTypes.func,
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

    renderDropDownMenu = () => {
        if (!this.props.isPlayerTeam)
            return null;

        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        const endPhaseOption = (
            <MenuItem
                onClick={() => {
                    this.props.requestEndPhase();
                    this.closeMenu();
                }}>
                Terminar Linea
            </MenuItem>
        );

        const updateLocalOption = (
            <MenuItem
                onClick={() => {
                    this.props.updateLocalScoreboard();
                    this.closeMenu();
                }}>
                <IconCloudDownloadSm/>
            </MenuItem>
        );

        return (
            <div>
                <button
                    className='btn btn-sm '
                    style={{background: 'transparent', color: 'white'}}
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
                    PaperProps={{
                        style: {
                            maxHeight: '20rem',
                            width: 'auto',
                        },
                        }
                    }
                >
                    {endPhaseOption}
                    {updateLocalOption}
                </Menu>
            </div>
        );
    };

    renderTeamActions = () => {
        let element = null;

        if (this.props.playerSelectionDialogOpen){
            if (this.props.isPlayerTeam)
                return <div className={`btn btn-md `} style={{background: 'gray', color: 'white'}}>Seleccionando jugadores</div>;
            return null;
        }
        if (this.props.data.gamesConfirmed === null){
            if (this.props.isPlayerTeam)
                return <button className={`btn btn-md btn-success`} onClick={this.props.requestEndPhase}>Terminar calentamiento</button>;
            return null;
        }



        let teamActions;
        let buttonProps = {
            onClick: this.props.offlineScoreboardToggler,
            className: 'mr-2 btn btn-sm d-flex flex-column align-items-center'
        };

        if (!this.props.usingOfflineScoreboard){
            buttonProps.className += ' btn-success';
        }
        else {
            buttonProps.className += ' btn-info';
        }

        return (
            <div className='d-flex flex-row align-items-center'>
                <button {...buttonProps} >
                        {
                            this.props.usingOfflineScoreboard ?
                            <Fragment>
                                <IconDesktopLg/>
                                <small style={{fontSize: '0.80rem'}}>Offline</small>
                            </Fragment> :
                            <Fragment>
                                <IconCloudLg/>
                                <small style={{fontSize: '0.80rem'}}>Online</small>
                            </Fragment>
                        }
                </button>
                {this.renderDropDownMenu()}
            </div>
        );

    };

    render() {
        const { data } = this.props;

        return (
            <div className={'d-flex bg-semi-transparent-gradient-primary'}>
                <div style={{textAlign: 'start'}} className={'ml-1 d-flex mr-auto flex-column justify-content-center'}>
                    <h5 className={'text-light'}>Pista: #{data.laneNumber}</h5>
                    <h5 className={'text-light'}>{data.name}</h5>
                </div>
                <div className={'mr-2 align-self-center'}>
                    { this.props.matchStatus === 'active' && this.props.isPlayerTeam !== null ?
                        this.renderTeamActions() : null }
                </div>
            </div>
        );
    }
}
