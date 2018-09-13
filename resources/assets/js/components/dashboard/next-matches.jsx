import React, {Component} from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import {Carousel} from 'react-responsive-carousel';
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
        nextMatchday: PropTypes.object,
        nextMatchdayMatches: PropTypes.array,
        getNextMatchday: PropTypes.func,
        getNextMatchdayMatches: PropTypes.func,
    };

    componentWillMount() {
        this.props.getNextMatchdayMatches();
    }

    renderNextMatchesCarousel() {

        let i = 1;

        return <div className="container-fluid">
            <h1 className="text-center mb-4 text-white">Próximos Enfrentamientos</h1>
            <div id="myCarousel" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner row w-100 mx-auto">
                    { Object.values(this.props.nextMatchdayMatches).map(value =>
                    <div key={i++} className="carousel-item col-md-4 active">
                        <div className="card">
                            <div className="card-body">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Pista {value.team1.laneNumber}</td>
                                            <td></td>
                                            <td>Pista {value.team2.laneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>{value.team1.name}</td>
                                            <td></td>
                                            <td>{value.team2.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Categoría: {value.team1.category}</td>
                                            <td></td>
                                            <td>Categoría: {value.team2.category}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
                <a className="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div>
        /*return <Carousel showThumbs={false}>
            { Object.values(this.props.nextMatchdayMatches).map(value =>
                    <div key={i++} className={'card'} style={{ width: '18rem'}}>
                        <p className="legend">Legend 1</p>
                    </div>
                )
            }
        </Carousel>;*/
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
