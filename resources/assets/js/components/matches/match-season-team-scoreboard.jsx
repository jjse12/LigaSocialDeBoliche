import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {connect} from 'react-redux';
import { getMatchSeasonTeamScoreboard} from "../../reducers/matches";
import {getMatchSeasonTeamScoreboardFetchingFromStore, getMatchSeasonTeamScoreboardFromStore} from "../../reducers/getters";
import ReactLoading from 'react-loading';
import ReactTable from 'react-table';
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import _ from "lodash";

@connect(
    store => ({
        matchSeasonTeamScoreboard: getMatchSeasonTeamScoreboardFromStore(store),
        fetchingMatchSeasonTeamScoreboard: getMatchSeasonTeamScoreboardFetchingFromStore(store)
    }),
    { getMatchSeasonTeamScoreboard }
)
export default class MatchSeasonTeamScoreboard extends Component {

    static propTypes = {
        match: PropTypes.object,
        matchId: PropTypes.number,
        seasonTeamId: PropTypes.number,
        matchSeasonTeamScoreboard: PropTypes.object,
        fetchingMatchSeasonTeamScoreboard: PropTypes.bool,
        getMatchSeasonTeamScoreboard: PropTypes.func.isRequired
    };

    componentWillMount() {
        if (_.isEmpty(this.props.matchSeasonTeamScoreboard)){
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
                this.props.getMatchSeasonTeamScoreboard(matchId, seasonTeamId);
            else {
                //TODO: Show alert error: no matchId &/or seasonTeamId
            }
        }
    }

    render(){
        if (_.isEmpty(this.props.matchSeasonTeamScoreboard)){
            if (this.props.fetchingMatchSeasonTeamScoreboard)
                return <div className={'match-scoreboard-table'}>
                    <div className={'loading-table'}>
                        <ReactLoading type={'spin'} color={'#488aaa'} width={'100%'} height={'100%'}/>
                    </div>
                </div>;
            return null;
        }

        const playersScores = this.props.matchSeasonTeamScoreboard.playersScores;
        const gamesTotals = this.props.matchSeasonTeamScoreboard.gamesTotals;
        return <div className={'match-scoreboard-table-container'}>
            <ReactTable
            className={'match-scoreboard-table -striped -highlight'}
            data={playersScores}
            columns={matchScoreboardScoresColumns(this)}
            getProps={() => {return {style: {color: 'white'}}}}
            showPagination={false}
            showPageSizeOptions={false}
            minRows={0}
            pageSize={playersScores.length}
            />
            <ReactTable
                className={'match-scoreboard-table -striped -highlight'}
                data={gamesTotals}
                columns={matchScoreboardTotalsColumns(this)}
                getProps={() => {return {style: {color: 'white'}}}}
                getTheadThProps={() => {return {style:{display: 'none'}}}}
                showPagination={false}
                showPageSizeOptions={false}
                minRows={0}
                pageSize={3}
            />
        </div>;
    }
}
