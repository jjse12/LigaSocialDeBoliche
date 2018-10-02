import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import {getMatchPlayerSeasonTeamId, getMatchScoreboards,
    setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard} from "../../reducers/matches";
import { createScore, updateScore, deleteScore } from "../../reducers/scores";
import {
    getLoggedInPlayerFromStore,
    createScoreFetchingFromStore,
    deleteScoreFetchingFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore,
    updateScoreFetchingFromStore,
    getMatchPlayerSeasonTeamIdFromStore,
    getMatchMyTeamOfflineScoreboardFromStore,
    getMatchRivalTeamOfflineScoreboardFromStore
} from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import ReactLoading from "react-loading";
import {
    ArrowRightLg,
    ArrowRightSm, CloudDownloadLg,
    CloudDownloadSm,
    CloudLg,
    CloudSm,
    DesktopLg,
    DesktopSm
} from "../../utilities/icons";

@connect(
    store => ({
        loggedInPlayer: getLoggedInPlayerFromStore(store),
        matchPlayerSeasonTeamId: getMatchPlayerSeasonTeamIdFromStore(store),
        matchMyTeamOfflineScoreboard: getMatchMyTeamOfflineScoreboardFromStore(store),
        matchRivalTeamOfflineScoreboard: getMatchRivalTeamOfflineScoreboardFromStore(store),
        matchScoreboards: getMatchScoreboardsFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
        fetchingCreateScore: createScoreFetchingFromStore(store),
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
        fetchingDeleteScore: deleteScoreFetchingFromStore(store),
    }),
    { getMatchPlayerSeasonTeamId, getMatchScoreboards, createScore, updateScore, deleteScore,
        setMatchMyTeamOfflineScoreboard, setMatchRivalTeamOfflineScoreboard }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        matchPlayerSeasonTeamId: PropTypes.number.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        fetchingMatchScoreboards: PropTypes.bool,
        getMatchScoreboards: PropTypes.func.isRequired,
        getMatchPlayerSeasonTeamId: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            usingMyTeamOfflineScoreboard: false,
            usingRivalTeamOfflineScoreboard: false,
        };
        this.renderCell = this.renderCell.bind(this);
    }

    componentWillMount() {
        const { matchId } = this.props.match.params;
        if (!_.isEmpty(this.props.loggedInPlayer)){
            this.props.getMatchPlayerSeasonTeamId(matchId, this.props.loggedInPlayer.id)
        }
        this.props.getMatchScoreboards(matchId);
    }

    toggleUsingMyTeamOfflineScoreboard = () => {
        const current = this.state.usingMyTeamOfflineScoreboard;
        this.setState({ usingMyTeamOfflineScoreboard: !current });
    };

    toggleUsingRivalTeamOfflineScoreboard = () => {
        const current = this.state.usingRivalTeamOfflineScoreboard;
        this.setState({ usingRivalTeamOfflineScoreboard: !current });
    };

    handleScoreFocus = e => {
        const cell = e.target;
        cell.setAttribute('class', 'score-focus');
    };

    handleScoreKeyPress = e => {

        if (e.which === 13){
            e.target.blur();
            return false;
        }

        if (isNaN(String.fromCharCode(e.which)) ||
            e.which === 32 || e.target.textContent.length >= 3){
            e.preventDefault();
        }
    };

    handleScoreKeyUp = e => {
        if (Number(e.target.textContent) > 300) {
            e.target.textContent = "300";
            return true;
        }
    };

    handleScoreBlur = (e, oldScore, scoreId) => {
        const cell = e.target;
        const newScore = cell.textContent !== '' &&
                         cell.textContent !== ' '  ?
                         cell.textContent : 0;

        if (oldScore !== Number(newScore)) {
            cell.setAttribute('class', 'score-patching');
            this.props.updateScore(scoreId, newScore)
            .then(() => {
                cell.setAttribute('class', 'score-update-success');
                this.props.getMatchScoreboards(this.props.match.params.matchId);
            })
            .catch(() => {
                cell.setAttribute('class', 'score-update-error');
                cell.textContent = oldScore;
            });
        }
        else {
            cell.setAttribute('class', '');
            if (newScore === 0){
                cell.textContent = oldScore;
            }
        }
    };

    renderCell(cellInfo, column) {
        /*TODO: Add team1 and team2 'confirmedScores' for the match's three games and
          TODO: render editable cell in case of scoresNOTconfirmed (match game still active)*/
        if (this.props.matchPlayerSeasonTeamId === 0 || cellInfo.value === undefined || cellInfo === null)
            return cellInfo.value;


        return (
            <div
                onFocus={this.handleScoreFocus}
                onKeyPress={this.handleScoreKeyPress}
                onKeyUp={this.handleScoreKeyUp}
                onPaste={e => { e.preventDefault(); }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => this.handleScoreBlur(e, cellInfo.value, cellInfo.original[column])}
            >{cellInfo.value}</div>
        );
    }

    updateMyTeamScoreboardFromCloud = () => {
        const { matchScoreboards } = this.props;
        if (this.props.matchPlayerSeasonTeamId === matchScoreboards.team1.data.id){
            this.props.setMatchMyTeamOfflineScoreboard(matchScoreboards.team1.results)
        } else if (this.props.matchPlayerSeasonTeamId === matchScoreboards.team2.data.id){
            this.props.setMatchMyTeamOfflineScoreboard(matchScoreboards.team2.results)
        }
    };

    updateRivalTeamScoreboardFromCloud = () => {
        const { matchScoreboards } = this.props;
        if (this.props.matchPlayerSeasonTeamId !== matchScoreboards.team1.data.id){
            this.props.setMatchRivalTeamOfflineScoreboard(matchScoreboards.team1.results)
        } else if (this.props.matchPlayerSeasonTeamId !== matchScoreboards.team2.data.id){
            this.props.setMatchRivalTeamOfflineScoreboard(matchScoreboards.team2.results)
        }
    };

    renderTeamScoreboardInfoBar = teamData => {

        let element = null;

        if (!this.props.matchScoreboards.active) {
            if (this.props.matchPlayerSeasonTeamId !== 0) {
                let icon = null;
                let toggler = null;
                let className = '';
                // Button for player's team
                if (this.props.matchPlayerSeasonTeamId === teamData.id) {
                    toggler = () => {this.toggleUsingMyTeamOfflineScoreboard()};
                    if (this.state.usingMyTeamOfflineScoreboard) {
                        icon = DesktopLg();
                        className = 'btn-info';
                    } else {
                        icon = CloudLg();
                        className = 'btn-success';
                    }
                }
                // Button for player's rival team
                else {
                    toggler = () => {this.toggleUsingRivalTeamOfflineScoreboard()};
                    if (this.state.usingRivalTeamOfflineScoreboard) {
                        icon = DesktopLg();
                        className = 'btn-info';
                    } else {
                        icon = CloudLg();
                        className = 'btn-success';
                    }
                }

                element = <button className={`btn btn-sm ${className}`}
                        onClick={toggler}>{icon}</button>
            }
        }

        return <div className={'mr-2 align-self-center'}>
            <button className={'mr-2 btn btn-secondary btn-sm'} onClick={this.updateMyTeamScoreboardFromCloud}>{CloudDownloadLg()} {ArrowRightLg()} {DesktopLg()}</button>
            { element }
        </div>;
    };

    isMatchPlayer = () => {
        return this.props.matchPlayerSeasonTeamId !== 0;
    };

    render() {
        if (_.isEmpty(this.props.matchScoreboards)){
            if (this.props.fetchingMatchScoreboards)
                return <div className={'container flex flex-wrap content-center justify-center'}>
                        <ReactLoading type={'spin'} color={'#488aaa'} height={'20%'} width={'20%'}/>
                    </div>;
            return null;
        }

        const { matchScoreboards } = this.props;
        const team1Data = matchScoreboards.team1.data;
        const team2Data = matchScoreboards.team2.data;
        let team1Scoreboard = matchScoreboards.team1.results;
        let team2Scoreboard = matchScoreboards.team2.results;
        if (this.isMatchPlayer()){
            if (this.props.matchPlayerSeasonTeamId === team1Data.id){
                if (this.state.usingMyTeamOfflineScoreboard)
                    team1Scoreboard = this.props.matchMyTeamOfflineScoreboard;
                if (this.state.usingRivalTeamOfflineScoreboard)
                    team2Scoreboard = this.props.matchRivalTeamOfflineScoreboard;
            } else {
                if (this.state.usingMyTeamOfflineScoreboard)
                    team2Scoreboard = this.props.matchMyTeamOfflineScoreboard;
                if (this.state.usingRivalTeamOfflineScoreboard)
                    team1Scoreboard = this.props.matchRivalTeamOfflineScoreboard;
            }
        }

        return (
            <div className={'container mt-3 mb-3'}>
            <div className={'match-scoreboards-container'}>
                <div className={'mr-3'}>
                    <div className={'d-flex bg-semi-transparent-gradient-primary'}>
                        <div className={'ml-1 d-flex mr-auto flex-column justify-content-center'}>
                            <h5 className={'text-light'}>Pista: #{team1Data.laneNumber}</h5>
                            <h5 className={'text-light'}>{team1Data.name}</h5>
                        </div>
                        { this.renderTeamScoreboardInfoBar(team1Data) }
                    </div>
                    <div className={'match-scoreboard-table-container'}>
                        <ReactTable
                            className={'match-scoreboard-table -striped -highlight'}
                            data={ team1Scoreboard.playersScores}
                            columns={matchScoreboardScoresColumns(this)}
                            getProps={() => {return {style: {color: 'white'}}}}
                            showPagination={false}
                            showPageSizeOptions={false}
                            minRows={0}
                            pageSize={team1Scoreboard.playersScores.length}
                        />
                        <ReactTable
                            className={'match-scoreboard-table -striped -highlight'}
                            data={team1Scoreboard.gamesTotals}
                            columns={matchScoreboardTotalsColumns()}
                            getProps={() => {return {style: {color: 'white'}}}}
                            getTheadThProps={() => {return {style:{display: 'none'}}}}
                            showPagination={false}
                            showPageSizeOptions={false}
                            minRows={0}
                            pageSize={3}
                        />
                    </div>
                </div>
                <div className={'ml-3'}>
                    <div className={'d-flex bg-semi-transparent-gradient-primary'}>
                        <div className={'ml-1 d-flex mr-auto flex-column justify-content-center'}>
                            <h5 className={'text-light'}>Pista: #{team2Data.laneNumber}</h5>
                            <h5 className={'text-light'}>{team2Data.name}</h5>
                        </div>
                        { this.renderTeamScoreboardInfoBar(team2Data) }
                    </div>
                    <div className={'match-scoreboard-table-container'}>
                        <ReactTable
                            className={'match-scoreboard-table -striped -highlight'}
                            data={team2Scoreboard.playersScores}
                            columns={matchScoreboardScoresColumns(this)}
                            getProps={() => {return {style: {color: 'white'}}}}
                            showPagination={false}
                            showPageSizeOptions={false}
                            minRows={0}
                            pageSize={team2Scoreboard.playersScores.length}
                        />
                        <ReactTable
                            className={'match-scoreboard-table -striped -highlight'}
                            data={team2Scoreboard.gamesTotals}
                            columns={matchScoreboardTotalsColumns()}
                            getTheadThProps={() => {return {style:{display: 'none'}}}}
                            getProps={() => {return {style: {color: 'white'}}}}
                            showPagination={false}
                            showPageSizeOptions={false}
                            minRows={0}
                            pageSize={3}
                        />
                    </div>
                </div>
            </div>
            </div>
        );
    }
}
