import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { connect } from "react-redux";
import { getMatchScoreboards} from "../../reducers/matches";
import {getMatchScoreboardsFetchingFromStore, getMatchScoreboardsFromStore} from "../../reducers/getters";
import _ from 'lodash';
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import ReactLoading from "react-loading";

@connect(
    store => ({
        matchScoreboards: getMatchScoreboardsFromStore(store),
        fetchingMatchScoreboards: getMatchScoreboardsFetchingFromStore(store),
    }),
    { getMatchScoreboards }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        fetchingMatchScoreboards: PropTypes.bool,
        getMatchScoreboards: PropTypes.func.isRequired
    };

    componentWillMount() {
        const { matchId } = this.props.match.params;
        this.props.getMatchScoreboards(matchId);
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
        const team1Scoreboard = matchScoreboards.team1.results;
        const team2Scoreboard = matchScoreboards.team2.results;
        return (
            <div className={'match-scoreboards-container'}>
                <div className={'match-scoreboard-table-container'}>
                    <ReactTable
                        className={'-striped -highlight'}
                        data={team1Scoreboard.playersScores}
                        columns={matchScoreboardScoresColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={team1Scoreboard.playersScores.length}
                    />
                    <ReactTable
                        className={'-striped -highlight'}
                        data={team1Scoreboard.gamesTotals}
                        columns={matchScoreboardTotalsColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={3}
                    />
                </div>
                <h5 className={'text-light'}>Marcadores</h5>
                <div className={'match-scoreboard-table-container'}>
                    <ReactTable
                        className={'-striped -highlight'}
                        data={team2Scoreboard.playersScores}
                        columns={matchScoreboardScoresColumns(this)}
                        showPagination={false}
                        showPageSizeOptions={false}
                        minRows={0}
                        pageSize={team2Scoreboard.playersScores.length}
                    />
                    <ReactTable
                        className={'-striped -highlight'}
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
