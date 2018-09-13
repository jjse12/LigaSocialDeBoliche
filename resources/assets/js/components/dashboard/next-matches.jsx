import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Carousel from 'react-responsive-carousel';
import { withStyles } from 'material-ui/styles';
import { getNextMatchdayFromStore, getNextMatchdayMatchesFromStore} from "../../reducers/getters";
import { getNextMatchday, getNextMatchdayMatches } from "../../reducers/current-season";

@connect(
    store => ({
        nextMatchday: getNextMatchdayFromStore(store),
        nextMatchdayMatches: getNextMatchdayMatchesFromStore(store),
    }),
    { getNextMatchday, getNextMatchdayMatches }
)
export default class NextMatches extends Component {
    static propTypes = {
        // currentSeason: PropTypes.array.isRequired || PropTypes.object,
        // matchdays: PropTypes.func,
    };

    componentWillMount() {
        this.props.getNextMatchdayMatches();
    }

    renderNextMatchesCarousel() {

        return <Carousel>
            { Object.values(this.props.nextMatchdayMatches).map(value =>
                    <div key={value.id} className={'card'} style={{ width: '18rem'}}>
                        <p className="legend">Legend 1</p>
                    </div>
                )
            }
        </Carousel>;
        // return Object.values(this.props.matchdays).map(value =>
        //     <div key={value.number} className={'card'} style={{ width: '18rem'}}>
        //         <div className='card-body'>
        //             <h5 className='card-title text-facebook'>{value.date}</h5>
        //             <p className='card-text text-accent-dark'>Jornada #{value.number} del {this.props.currentSeason.name}.</p>
        //             <a href='#' className='btn btn-primary'>Ver Enfrentamientos</a>
        //         </div>
        //     </div>
        // );
    };

    render(){
        return (
            <div className="container">
                {this.renderNextMatchesCarousel()}
            </div>
        );
    }
}
