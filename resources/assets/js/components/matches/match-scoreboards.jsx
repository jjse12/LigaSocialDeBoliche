import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import { getMatchScoreboards} from "../../reducers/matches";
import { getMatchScoreboardsFromStore } from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";

@connect(
    store => ({
        matchScoreboards: getMatchScoreboardsFromStore(store)
    }),
    { getMatchScoreboards }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        getMatchScoreboards: PropTypes.func.isRequired
    };

    componentWillMount() {
        const { matchId } = this.props.match.params;
        this.props.getMatchScoreboards(matchId);
    }



    render(){
        if (_.isEmpty(this.props.matchScoreboards))
            return null;

        const { matchScoreboards } = this.props;
        const team1Scoreboard = matchScoreboards.team1.results;
        const team2Scoreboard = matchScoreboards.team2.results;
        console.log(team1Scoreboard);
        return (
            <div>
                <h5 className={'text-light'}>Marcadores</h5>
                <div>
                    <ReactTable
                        className={'match-scoreboard-table -striped -highlight'}
                        data={team1Scoreboard.playersScores}
                        columns={matchScoreboardScoresColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={team1Scoreboard.playersScores.length}
                    />
                    <ReactTable
                        className={'match-scoreboard-table -striped -highlight'}
                        data={team1Scoreboard.gamesTotals}
                        columns={matchScoreboardTotalsColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={3}
                    />
                </div>
                <div>
                    <ReactTable
                        className={'match-scoreboard-table -striped -highlight'}
                        data={team2Scoreboard.playersScores}
                        columns={matchScoreboardScoresColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={team2Scoreboard.playersScores.length}
                    />
                    <ReactTable
                        className={'match-scoreboard-table -striped -highlight'}
                        data={team2Scoreboard.gamesTotals}
                        columns={matchScoreboardTotalsColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={3}
                    />
                </div>
            </div>
        );
    }
}
