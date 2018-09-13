import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { getSeasonMatchdaysFromStore } from "../../reducers/getters";
import { getSeasonMatchdays } from "../../reducers/season-matchdays";

@connect(
    store => ({
        matchdays: getSeasonMatchdaysFromStore(store)
    }),
    { getSeasonMatchdays }
)
export default class SeasonMatchdays extends Component {
    static propTypes = {
        // currentSeason: PropTypes.array.isRequired || PropTypes.object,
        // matchdays: PropTypes.func,
    };

    componentDidMount() {
        this.props.getSeasonMatchdays(this.props.currentSeason.id);
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
