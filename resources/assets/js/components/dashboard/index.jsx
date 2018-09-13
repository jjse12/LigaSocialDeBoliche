import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import connect from "react-redux/es/connect/connect";
import { getCurrentSeason } from "../../reducers/current-season";
import { getCurrentSeasonFromStore} from "../../reducers/getters";
import NextMatches from "./next-matches";

@connect(
    store => ({
        currentSeason: getCurrentSeasonFromStore(store)
    }),
    { getCurrentSeason }
)
export default class Dashboard extends Component {
    // static propTypes = {
    //     // user: PropTypes.string,
    //     // admin: PropTypes.bool.isRequired
    // };

    componentWillMount() {
        this.props.getCurrentSeason();
    }

    render(){
        return (
            <div>
                <div className={'container'}>
                    <h4 className={'text-light'}>{this.props.currentSeason.name}</h4>
                    <NextMatches/>
                </div>
            </div>
        );
    }
}
