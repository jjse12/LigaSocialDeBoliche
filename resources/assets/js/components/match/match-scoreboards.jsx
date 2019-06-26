import React, {Component} from 'react';
import {number, bool, object, string, shape, func } from 'prop-types';
import { connect } from "react-redux";
import { setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard} from "../../reducers/matches";
import { getMatchMyTeamOfflineScoreboardFromStore, getMatchRivalTeamOfflineScoreboardFromStore } from "../../reducers/selectors";
import _ from 'lodash';
import TeamScoreboard from "./team-scoreboard";
import TeamScoreboardHeader from "./team-scoreboard-header";

@connect(
    store => ({
        matchMyTeamOfflineScoreboard: getMatchMyTeamOfflineScoreboardFromStore(store),
        matchRivalTeamOfflineScoreboard: getMatchRivalTeamOfflineScoreboardFromStore(store),
    }),
    { setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        matchId: number.isRequired,
        isMatchPlayer: bool.isRequired,
        matchPlayerSeasonTeamId: number.isRequired,
        matchScoreboards: object.isRequired,
        loadMatchScoreboards: func.isRequired,
        matchStatus: string.isRequired,
        matchPhase: string,
        matchMyTeam: object,
        matchRivalTeam: object,
        matchPhaseByMyTeamGamesConfirmed: string,
        matchMyTeamGameScoresCount: func.isRequired,
        requestEndPhase: func,
        fetchingMatchScoreboards: bool.isRequired,
        playersSelectionDialogOpen: bool.isRequired,

        matchMyTeamOfflineScoreboard: object,
        matchRivalTeamOfflineScoreboard: object,
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
                if (this.props.matchPlayerSeasonTeamId === team1.data.id){
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
        const { team1, team2 } = this.getTeamsData();

        return (
            <div className={'match-scoreboards'}>
                <div className='mr-2'>
                    <TeamScoreboardHeader
                        data={team1.data}
                        usingOfflineScoreboard={team1.usingOfflineScoreboard}
                        offlineScoreboardToggler={team1.toggleOfflineScoreboard}
                        isPlayerTeam={team1.isTeamPlayer}
                        playersSelectionDialogOpen={this.props.playersSelectionDialogOpen}
                        teamMatchPhase={this.props.matchPhaseByMyTeamGamesConfirmed}
                        matchStatus={this.props.matchStatus}
                        requestEndPhase={this.props.requestEndPhase}
                        updateLocalScoreboard={team1.updateLocalScoreboard}
                        loadMatchScoreboards={this.props.loadMatchScoreboards}
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
                        data={team2.data}
                        usingOfflineScoreboard={team2.usingOfflineScoreboard}
                        offlineScoreboardToggler={team2.toggleOfflineScoreboard}
                        isPlayerTeam={team2.isTeamPlayer}
                        playersSelectionDialogOpen={this.props.playersSelectionDialogOpen}
                        teamMatchPhase={this.props.matchPhaseByMyTeamGamesConfirmed}
                        matchStatus={this.props.matchStatus}
                        requestEndPhase={this.props.requestEndPhase}
                        updateLocalScoreboard={team2.updateLocalScoreboard}
                        loadMatchScoreboards={this.props.loadMatchScoreboards}
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
