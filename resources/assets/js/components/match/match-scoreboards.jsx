import React, {Component, Fragment} from 'react';
import {number, bool, object, string, shape, func } from 'prop-types';
import { connect } from "react-redux";
import { setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard} from "../../reducers/matches";
import selectors, {
    getMatchMyTeamOfflineScoreboardFromStore,
    getMatchRivalTeamOfflineScoreboardFromStore
} from "../../reducers/selectors";
import _ from 'lodash';
import TeamScoreboard from "./team-scoreboard";
import TeamScoreboardHeader from "./team-scoreboard-header";
import {IconCheckSm, IconCloudDownloadSm, IconCloudLg, IconDesktopLg} from "../../utilities/icons";

@connect(
    store => ({
        userSeasonTeamId: selectors.userCurrentSeasonTeamId(store),
        isMatchPlayer: selectors.isMatchPlayer(store),
        matchStatus: selectors.matchStatus(store),
        matchScoreboards: selectors.matchScoreboards(store),
        matchMyTeamOfflineScoreboard: getMatchMyTeamOfflineScoreboardFromStore(store),
        matchRivalTeamOfflineScoreboard: getMatchRivalTeamOfflineScoreboardFromStore(store),
        team1ScoreboardHeaderData: selectors.getTeamScoreboardHeaderData(store, 1),
        team2ScoreboardHeaderData: selectors.getTeamScoreboardHeaderData(store, 2),
        isPlayersSelectionDialogOpen: selectors.matchPlayersSelection(store).isDialogOpen,
    }),
    { setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        isMatchPlayer: bool.isRequired,
        userSeasonTeamId: number.isRequired,
        matchScoreboards: object.isRequired,
        loadMatchScoreboards: func.isRequired,
        matchStatus: string.isRequired,
        matchMyTeam: object,
        matchRivalTeam: object,
        matchMyTeamGameScoresCount: func.isRequired,
        requestEndPhase: func,
        fetchingMatchScoreboards: bool.isRequired,
        isPlayersSelectionDialogOpen: bool.isRequired,

        matchMyTeamOfflineScoreboard: object,
        matchRivalTeamOfflineScoreboard: object,
        team1ScoreboardHeaderData: shape({
            laneNumber: number.isRequired,
            name: string.isRequired
        }).isRequired,
        team2ScoreboardHeaderData: shape({
            laneNumber: number.isRequired,
            name: string.isRequired
        }).isRequired,
        setMatchRivalTeamOfflineScoreboard: func,
        setMatchMyTeamOfflineScoreboard: func,
    };

    constructor(props) {
        super(props);
        this.state = {
            usingMyTeamOfflineScoreboard: false,
            usingRivalTeamOfflineScoreboard: false
        };
    }

    toggleUsingMyTeamOfflineScoreboard = () => {
        const toggled = !this.state.usingMyTeamOfflineScoreboard;
        if (toggled && _.isEmpty(this.props.matchMyTeamOfflineScoreboard.playersScores)){
            this.updateMyTeamScoreboardFromCloud();
        }
        this.setState({ usingMyTeamOfflineScoreboard: toggled });
    };

    toggleUsingRivalTeamOfflineScoreboard = () => {
        const toggled = !this.state.usingRivalTeamOfflineScoreboard;
        this.setState({ usingRivalTeamOfflineScoreboard: toggled });
    };

    updateMyTeamScoreboardFromCloud = () => {
        if (this.props.matchMyTeam !== null)
            this.props.setMatchMyTeamOfflineScoreboard(this.props.matchMyTeam.results);
    };

    updateRivalTeamScoreboardFromCloud = () => {
        if (this.props.matchRivalTeam)
            this.props.setMatchRivalTeamOfflineScoreboard(this.props.matchRivalTeam.results);
    };

    getTeamActions = team => {
        let teamActions = { main:[], dropDown: [] };

        if (!(this.props.matchStatus === 'active' && team.isTeamPlayer !== null))
            return teamActions;

        if (this.props.isPlayersSelectionDialogOpen){
            return teamActions;
        }

        if (team.data.gamesConfirmed === null){
            if (team.isTeamPlayer){
                const element = <button
                    key={`team-${team.data.id}-main-action-0`}
                    className='btn btn-md btn-success'
                    onClick={this.props.requestEndPhase}
                >Terminar calentamiento</button>;
                teamActions.main.push(element);
            }
            return teamActions;
        }

        if (team.isTeamPlayer){
            teamActions.dropDown.push({
                icon: <IconCheckSm className='menu-option-icon'/>,
                text: 'Terminar Linea',
                callback: this.props.requestEndPhase,
            });
            teamActions.dropDown.push({
                icon: <IconCloudDownloadSm className='menu-option-icon'/>,
                text: 'Copiar a Offline',
                callback: team.updateLocalScoreboard
            });
        }

        let buttonProps = {
            onClick: team.toggleOfflineScoreboard,
            className: 'mr-2 btn btn-sm d-flex flex-column align-items-center'
        };

        if (!team.usingOfflineScoreboard){
            buttonProps.className += ' btn-success';
        }
        else {
            buttonProps.className += ' btn-info';
        }
        teamActions.main.push(
            <button {...buttonProps} key={`team-${team.data.id}-main-action-${teamActions.main.length}`}>
            {
                team.usingOfflineScoreboard ?
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
        );
        return teamActions;
    };

    getTeamsData = () => {
        let team1 = {
            data: {},
            results: {},
            isTeamPlayer: null,
            toggleOfflineScoreboard: null,
            usingOfflineScoreboard: false,
            isScoreboardEditable: false
        }, team2 = {
            data: {},
            results: {},
            isTeamPlayer: null,
            toggleOfflineScoreboard: null,
            usingOfflineScoreboard: false,
            isScoreboardEditable: false
        };

        const { matchScoreboards } = this.props;
        if (!_.isEmpty(matchScoreboards)){
            team1 = _.merge(team1, matchScoreboards.team1);
            team2 = _.merge(team2, matchScoreboards.team2);
            if (this.props.isMatchPlayer){
                if (this.props.userSeasonTeamId === team1.data.id){
                    team1.isTeamPlayer = true;
                    team2.isTeamPlayer = false;
                    team1.isScoreboardEditable = true;
                    team1.toggleOfflineScoreboard = this.toggleUsingMyTeamOfflineScoreboard;
                    team2.toggleOfflineScoreboard = this.toggleUsingRivalTeamOfflineScoreboard;
                    team1.updateLocalScoreboard = this.updateMyTeamScoreboardFromCloud;
                    team2.updateLocalScoreboard = this.updateRivalTeamScoreboardFromCloud;
                    if (this.state.usingMyTeamOfflineScoreboard){
                        team1.results = this.props.matchMyTeamOfflineScoreboard;
                        team1.usingOfflineScoreboard = true;
                    }
                    if (this.state.usingRivalTeamOfflineScoreboard){
                        team2.results = this.props.matchRivalTeamOfflineScoreboard;
                        team2.usingOfflineScoreboard = true;
                        team2.isScoreboardEditable = true;
                    }
                } else {
                    team2.isTeamPlayer = true;
                    team1.isTeamPlayer = false;
                    team2.isScoreboardEditable = true;
                    team2.toggleOfflineScoreboard = this.toggleUsingMyTeamOfflineScoreboard;
                    team1.toggleOfflineScoreboard = this.toggleUsingRivalTeamOfflineScoreboard;
                    team2.updateLocalScoreboard = this.updateMyTeamScoreboardFromCloud;
                    team1.updateLocalScoreboard = this.updateRivalTeamScoreboardFromCloud;
                    if (this.state.usingMyTeamOfflineScoreboard){
                        team2.results = this.props.matchMyTeamOfflineScoreboard;
                        team2.usingOfflineScoreboard = true;
                    }
                    if (this.state.usingRivalTeamOfflineScoreboard){
                        team1.results = this.props.matchRivalTeamOfflineScoreboard;
                        team1.usingOfflineScoreboard = true;
                        team1.isScoreboardEditable = true;
                    }
                }
            }
        }

        return { team1, team2 };
    };

    render() {
        const {
            team1ScoreboardHeaderData: {
                laneNumber: team1LaneNumber,
                name: team1Name
            },
            team2ScoreboardHeaderData: {
                laneNumber: team2LaneNumber,
                name: team2Name
            }} = this.props;
        const { team1, team2 } = this.getTeamsData();

        const team1Actions = this.getTeamActions(team1);
        const team2Actions = this.getTeamActions(team2);

        return (
            <div className={'match-scoreboards'}>
                <div className='mr-2'>
                    <TeamScoreboardHeader
                        actions={team1Actions}
                        laneNumber={team1LaneNumber}
                        teamName={team1Name}
                    />
                    <TeamScoreboard
                        results={team1.results}
                        gamesConfirmed={team1.data.gamesConfirmed}
                        isEditable={team1.isScoreboardEditable}
                        isOfflineScoreboard={team1.usingOfflineScoreboard}
                        loadMatchScoreboards={this.props.loadMatchScoreboards}
                    />
                </div>
                <div className='ml-2'>
                    <TeamScoreboardHeader
                        actions={team2Actions}
                        laneNumber={team2LaneNumber}
                        teamName={team2Name}
                    />
                    <TeamScoreboard
                        results={team2.results}
                        gamesConfirmed={team2.data.gamesConfirmed}
                        isEditable={team2.isScoreboardEditable}
                        isOfflineScoreboard={team2.usingOfflineScoreboard}
                        loadMatchScoreboards={this.props.loadMatchScoreboards}
                    />
                </div>
            </div>
        );
    }
}
