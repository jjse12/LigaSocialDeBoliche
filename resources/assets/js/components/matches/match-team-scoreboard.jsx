import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import { getMatchTeamScoreboard} from "../../reducers/matches";
import { getMatchTeamScoreboardFromStore } from "../../reducers/getters";
import ReactTable from 'react-table';
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import _ from "lodash";

@connect(
    store => ({
        matchTeamScoreboard: getMatchTeamScoreboardFromStore(store)
    }),
    { getMatchTeamScoreboard }
)
export default class MatchTeamScoreboard extends Component {

    static propTypes = {
        match: PropTypes.object,
        matchId: PropTypes.number,
        seasonTeamId: PropTypes.number,
        matchTeamScoreboard: PropTypes.object,
        getMatchTeamScoreboard: PropTypes.func.isRequired
    };

    componentWillMount() {
        if (_.isEmpty(this.props.matchTeamScoreboard)){
            let matchId, seasonTeamId;
            if (this.props.match && this.props.match.params){
                matchId = this.props.match.params.matchId;
                seasonTeamId = this.props.match.params.seasonTeamId;
            }
            else {
                matchId = this.props.matchId;
                seasonTeamId = this.props.seasonTeamId;
            }
            if (matchId && seasonTeamId)
                this.props.getMatchTeamScoreboard(matchId, seasonTeamId);
            else {
                //TODO: Show alert error: no matchId &/or seasonTeamId
            }
        }
    }

    render(){
        if (_.isEmpty(this.props.matchTeamScoreboard)){
            return null;
        }
        const playersScores = this.props.matchTeamScoreboard.playersScores;
        const gamesTotals = this.props.matchTeamScoreboard.gamesTotals;
        return <div>
            <ReactTable
            className={`${this.props.classes.scoreboardTable} -striped -highlight `}
            data={playersScores}
            columns={matchScoreboardScoresColumns(this)}
            showPagination={false}
            showPageSizeOptions={false}
            minRows={0}
            pageSize={playersScores.length}
            />
            <ReactTable
                className={'match-scoreboard-table -striped -highlight'}
                data={gamesTotals}
                columns={matchScoreboardTotalsColumns(this)}
                showPagination={false}
                showPageSizeOptions={false}
                minRows={0}
                pageSize={3}
            />
        </div>;
    }
}
