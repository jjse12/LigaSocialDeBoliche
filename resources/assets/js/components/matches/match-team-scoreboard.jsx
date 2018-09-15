import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import connect from "react-redux/es/connect/connect";
import { getMatchTeamScoreboard} from "../../reducers/match";
import { getMatchTeamScoreboardFromStore } from "../../reducers/getters";
import ReactDataGrid from 'react-data-grid';

@connect(
    store => ({
        matchTeamScoreboard: getMatchTeamScoreboardFromStore(store)
    }),
    { getMatchTeamScoreboard }
)
export default class MatchTeamScoreboard extends Component {
    constructor(){
        super();
        this.columns = [
            {
                key: 'handicap',
                name: 'Handicap'
            },
            {
                key: 'player',
                name: 'Jugador'
            },
            {
                key: 'line1',
                name: 'Linea 1'
            },
            {
                key: 'line2',
                name: 'Linea 2'
            },
            {
                key: 'line3',
                name: 'Linea 3'
            },
            {
                key: 'totals',
                name: 'Totales'
            },
        ];
    }
    static propTypes = {
        matchId: PropTypes.number.isRequired,
        seasonTeamId: PropTypes.number.isRequired,
        matchTeamScoreboard: PropTypes.object.isRequired,
        getMatchTeamScoreboard: PropTypes.func.isRequired
    };


    componentWillMount() {
        this.props.getMatchTeamScoreboard(this.props.matchId, this.props.seasonTeamId);
    }


    rowGetter = (i) => {
        return {
            handicap: i,
            player: 'Jenner',
            score: 221
        };
    };

    render(){
        return (
            <ReactDataGrid
                columns={this.columns}
                rowGetter={this.rowGetter}
                rowsCount={5}
                minHeight={500} />
        );
    }
}
