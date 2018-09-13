import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import connect from "react-redux/es/connect/connect";
import { getCurrentSeason } from "../../reducers/current-season";
import { getMatchResults} from "../../reducers/match";
import { getCurrentSeasonFromStore} from "../../reducers/getters";
import NextMatches from "./next-matches";
import MatchScoreboards from "../matches/match-scoreboards";

@connect(
    store => ({
        currentSeason: getCurrentSeasonFromStore(store)
    }),
    { getCurrentSeason, getMatchResults }
)
export default class Dashboard extends Component {
    static propTypes = {
        currentSeason: PropTypes.object.isRequired,
        getCurrentSeason: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.getCurrentSeason();
        this.props.getMatchResults(1);
    }

    render(){
        return (
            <div>
                <div className={'container'}>
                    <h4 className={'text-light'}>{this.props.currentSeason.name}</h4>
                    <NextMatches/>
                    <MatchScoreboards matchId={1}/>
                </div>
            </div>
        );
    }
}
