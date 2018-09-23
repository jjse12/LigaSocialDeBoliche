import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import { getMatchScoreboards} from "../../reducers/matches";
import { createScore, updateScore, deleteScore } from "../../reducers/scores";
import {
    createScoreFetchingFromStore, deleteScoreFetchingFromStore,
    getMatchScoreboardsFetchingFromStore,
    getMatchScoreboardsFromStore, updateScoreFetchingFromStore
} from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import ReactLoading from "react-loading";

@connect(
    store => ({
        matchScoreboards: getMatchScoreboardsFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
        fetchingCreateScore: createScoreFetchingFromStore(store),
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
        fetchingDeleteScore: deleteScoreFetchingFromStore(store),
    }),
    { getMatchScoreboards, createScore, updateScore, deleteScore }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        fetchingMatchScoreboards: PropTypes.bool,
        getMatchScoreboards: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.renderEditableCell = this.renderEditableCell.bind(this);
    }

    componentWillMount() {
        const { matchId } = this.props.match.params;
        this.props.getMatchScoreboards(matchId);
    }

    renderEditableCell(cellInfo, column) {
        /*TODO: Add team1 and team2 'confirmedScores' for the match's three games and
          TODO: render editable cell in case of scoresNOTconfirmed (match game still active)*/
        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    console.log(e);
                    console.log(cellInfo);
                    console.log(e.target.innerHTML);
                    this.props.updateScore(7, 300)
                        .then(() => {
                            this.props.getMatchScoreboards(this.props.match.params.matchId);
                        })
                        .catch(jqXHR => {
                            console.log(jqXHR);
                        })
                        .then(() => {
                            // this.props.getMatchScoreboards(this.props.match.params.matchId);
                            this.render();
                        });
                    // const data = [...this.state.data];
                    // data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    // this.setState({ data });
                }}
                // dangerouslySetInnerHTML={{
                //     __html: cellInfo.value
                // }}
            >{cellInfo.value}</div>
        );
    }

    render(){
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
                {/*<button onClick={() => {
                    this.props.matchScoreboards.team1.laneNumber = 10;
                    this.render
                }}>refrescar</button>*/}
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
