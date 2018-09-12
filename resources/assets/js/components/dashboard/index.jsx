import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import {getSeasonMatchdays} from "../../reducers/season-matchdays";
import SeasonMatchdays from "./season-matchdays";


// @withStyles(styles)
export default class Dashboard extends Component {
    // static propTypes = {
    //     // user: PropTypes.string,
    //     // admin: PropTypes.bool.isRequired
    // };



    render(){
        getSeasonMatchdays()();
        return (
            <div>
                <SeasonMatchdays/>
            </div>
        );
    }
}
