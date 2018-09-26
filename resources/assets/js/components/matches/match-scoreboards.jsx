import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import {getMatchPlayerSeasonTeamId, getMatchScoreboards} from "../../reducers/matches";
import { createScore, updateScore, deleteScore } from "../../reducers/scores";
import {
    getLoggedInPlayerFromStore,
    createScoreFetchingFromStore, deleteScoreFetchingFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore, updateScoreFetchingFromStore, getMatchPlayerSeasonTeamIdFromStore
} from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import ReactLoading from "react-loading";

@connect(
    store => ({
        loggedInPlayer: getLoggedInPlayerFromStore(store),
        matchPlayerSeasonTeamId: getMatchPlayerSeasonTeamIdFromStore(store),
        matchScoreboards: getMatchScoreboardsFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
        fetchingCreateScore: createScoreFetchingFromStore(store),
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
        fetchingDeleteScore: deleteScoreFetchingFromStore(store),
    }),
    { getMatchPlayerSeasonTeamId, getMatchScoreboards, createScore, updateScore, deleteScore }
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
        this.renderCell = this.renderCell.bind(this);
    }

    componentWillMount() {
        const { matchId } = this.props.match.params;
        if (!_.isEmpty(this.props.loggedInPlayer)){
            this.props.getMatchPlayerSeasonTeamId(matchId, this.props.loggedInPlayer.id)
        }
        this.props.getMatchScoreboards(matchId);
    }

    handleScoreFocus = e => {
        const cell = e.target;
        cell.setAttribute('class', 'score-focus');
        if (cell.textContent === '0')
            cell.textContent = '';

    };

    handleScoreKeyPress = e => {
        if (e.which === 13){
            e.target.blur();
            return false;
        }

        if (isNaN(String.fromCharCode(e.which)) || e.target.textContent.length >= 3){
            e.preventDefault();
            return false;
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
        const newScore = cell.textContent !== '' ? cell.textContent : 0;
        if (oldScore !== Number(newScore)) {
            this.props.updateScore(scoreId, newScore)
                .then(() => {
                    cell.setAttribute('class', 'score-update-success');
                })
                .catch(() => {
                    cell.setAttribute('class', 'score-update-error');
                    cell.textContent = oldScore;
                })
                .finally(() => {
                    this.props.getMatchScoreboards(this.props.match.params.matchId);
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

    render() {
        if (_.isEmpty(this.props.matchScoreboards)){
            if (this.props.fetchingMatchScoreboards)
                return <div className={'container flex flex-wrap content-center justify-center'}>
                        <ReactLoading type={'spin'} color={'#488aaa'} height={'20%'} width={'20%'}/>
                    </div>;
            return null;
        }

        const { matchScoreboards } = this.props;
        const team1Data = matchScoreboards.team1;
        const team2Data = matchScoreboards.team2;
        const team1Scoreboard = team1Data.results;
        const team2Scoreboard = team2Data.results;
        return (
            <div className={'container mt-3 mb-3'}>
            <div className={'match-scoreboards-container'}>
                <div className={'mr-3'}>
                    <div className={'bg-semi-transparent-gradient-primary'}>
                        <h5 className={'text-light'}>Pista: #{team1Data.laneNumber}</h5>
                        <h5 className={'text-light'}>{team1Data.name}</h5>
                    </div>
                    <div className={'match-scoreboard-table-container'}>
                        <ReactTable
                            className={'match-scoreboard-table -striped -highlight'}
                            data={team1Scoreboard.playersScores}
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
                    <div className={'bg-semi-transparent-gradient-primary'}>
                        <h5 className={'text-light'}>Pista: #{team2Data.laneNumber}</h5>
                        <h5 className={'text-light'}>{team2Data.name}</h5>
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
