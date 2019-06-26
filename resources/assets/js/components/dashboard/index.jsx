import React, {Component} from 'react';
import { object, func } from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { getCurrentSeason } from "../../reducers/currentSeason";
import { getMatchResults} from "../../reducers/matches";
import { getCurrentSeasonFromStore} from "../../reducers/selectors";

@connect(
    store => ({
        currentSeason: getCurrentSeasonFromStore(store)
    }),
    { getCurrentSeason, getMatchResults }
)
export default class Dashboard extends Component {
    static propTypes = {
        currentSeason: object.isRequired,
        getCurrentSeason: func.isRequired
    };

    componentWillMount() {
        this.props.getCurrentSeason();
    }

    render(){
        return (
            <div>
                <div className={'container'}>
                    <h4 className={'text-light'}>{this.props.currentSeason.name}</h4>
                    {/*<NextMatches/>*/}
                    {/*<MatchScoreboards matchId={1}/>*/}
                </div>
            </div>
        );
    }
}
