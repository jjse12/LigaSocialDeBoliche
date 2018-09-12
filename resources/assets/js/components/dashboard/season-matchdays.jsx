import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { getSeasonMatchdaysFromStore } from "../../reducers/getters";
import { getSeasonMatchdays } from "../../reducers/season-matchdays";

// @withStyles(styles)
@connect(
    store => ({
        matchdays: getSeasonMatchdaysFromStore(store)
    }),
    { getSeasonMatchdays }
)
export default class SeasonMatchdays extends Component {
    static propTypes = {
        matchdays: PropTypes.object,
    };

    componentDidMount() {
        this.props.getSeasonMatchdays(1);
    }

    renderMatchdays() {
        return Object.values(this.props.matchdays).map(value =>
            <div key={value.number} className={'btn-primary'}>{value.date}</div>
        );
    };

    render(){
        if (this.props.matchdays == null)
            return;
        return (
            <div className="container btn-accent-dark">
                {this.renderMatchdays()}
            </div>
        );
    }
}
