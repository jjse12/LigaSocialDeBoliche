import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import connect from "react-redux/es/connect/connect";
import { getMatchScoreboards} from "../../reducers/match";
import { getMatchScoreboardsFromStore } from "../../reducers/getters";
import ReactDataGrid from 'react-data-grid';
import MatchTeamScoreboard from "./match-team-scoreboard";

@connect(
    store => ({
        matchScoreboards: getMatchScoreboardsFromStore(store)
    }),
    { getMatchScoreboards }
)
export default class MatchScoreboards extends Component {
    static propTypes = {
        matchId: PropTypes.number.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        getMatchScoreboards: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.getMatchScoreboards(this.props.matchId);
    }



    render(){
        return (
            <div className={'container'}>
                <h5 className={'text-light'}>Marcadores</h5>
                <MatchTeamScoreboard matchId={this.props.matchId} seasonTeamId={1}/>
            </div>
        );
    }
}
