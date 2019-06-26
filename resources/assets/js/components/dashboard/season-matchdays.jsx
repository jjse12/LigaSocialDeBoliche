import React, {Component} from 'react';
import { connect } from 'react-redux'
import { func } from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import { getSeasonMatchdaysFromStore } from "../../reducers/selectors";
import { getCurrentSeasonMatchdays } from "../../reducers/currentSeason";

@connect(
    store => ({
        matchdays: getSeasonMatchdaysFromStore(store)
    }),
    { getCurrentSeasonMatchdays }
)
export default class SeasonMatchdays extends Component {
    static propTypes = {
        // currentSeason: array.isRequired || object,
        // matchdays: func,
        getCurrentSeasonMatchdays: func.isRequired,
    };

    componentDidMount() {
        this.props.getCurrentSeasonMatchdays();
    }

    renderMatchdays() {
        return Object.values(this.props.matchdays).map(value =>
            <div key={value.number} className={'card'} style={{ width: '18rem'}}>
                <div className='card-body'>
                    <h5 className='card-title text-facebook'>{value.date}</h5>
                    <p className='card-text text-accent-dark'>Jornada #{value.number} del {this.props.currentSeason.name}.</p>
                    <a href='#' className='btn btn-primary'>Ver Enfrentamientos</a>
                </div>
            </div>
        );
    };

    render(){

        return (
            <div className="container">
                {this.renderMatchdays()}
            </div>
        );
    }
}
