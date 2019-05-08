import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Collapse } from "react-collapse";
import { IconAngleDownLg, IconAngleUpLg } from "../../utilities/icons";
import { gameNumberStrings } from "./match";
import selectors from '../../reducers/selectors';
import PropTypes from 'prop-types';
import ReactLoading from "react-loading";
import moment from 'moment';

@connect(
    store => ({
        matchSummary: selectors.matchSummary(store),
        loadingMatchSummary: selectors.loadingMatchSummary(store),
    }),
    { }
)
export default class MatchSummary extends Component {
    static propTypes = {
        matchSummary: PropTypes.shape({
            id: PropTypes.number.isRequired,
            statusData: PropTypes.shape({
                status: PropTypes.string,
                phase: PropTypes.string,
                diffForHumans: PropTypes.string
            }).isRequired,
            date: PropTypes.string.isRequired,
            matchdayNumber: PropTypes.number.isRequired,
            isRedPinGame: PropTypes.bool.isRequired,
            isVirtualGame: PropTypes.bool.isRequired,
            results: PropTypes.shape({
                team1: PropTypes.shape({
                    points: PropTypes.number.isRequired,
                    pins: PropTypes.number.isRequired
                }).isRequired,
                team2: PropTypes.shape({
                    points: PropTypes.number.isRequired,
                    pins: PropTypes.number.isRequired
                }).isRequired
            }).isRequired
        }).isRequired,
        loadingMatchSummary: PropTypes.bool.isRequired,
    };

    state = {
        showResults: false
    };

    toggleShowResults = () => {
        const { showResults } = this.state;
        this.setState({ showResults: !showResults });
    };

    renderContent = () => {
        const {
            statusData: {
                status,
                phase,
                diffForHumans
            },
            results: {
                team1,
                team2,
            },
            date,
            matchdayNumber,
        } = this.props.matchSummary;
        const {
            points: team1Points,
            pins: team1Pins,
        } = team1;
        const {
            points: team2Points,
            pins: team2Pins
        } = team2;
        const { showResults } = this.state;

        moment.locale('es');
        const formattedDate = moment(date).format('D [de] MMMM [de] YYYY');
        let statusClass = '', statusStr = '';
        switch (status) {
            case 'inactive':
                statusStr = 'Comienza ' + diffForHumans;
                statusClass = 'match-results-status-not-started';
                break;
            case 'active':
                statusClass = 'match-results-status-active';
                if (phase === null){
                    statusClass = 'match-results-status-not-started';
                    statusStr = 'ERROR';
                } else {
                    if (phase === 'warming'){
                        statusClass = 'match-results-status-warming';
                    }
                    statusStr = gameNumberStrings[phase];
                }
                break;
            case 'concluded':
                statusClass = 'match-results-status-concluded';
                statusStr = 'Finalizado';
                break
        }
        return (
            <div className='d-flex flex-column justify-content-center'>
                {
                    showResults ?
                    <IconAngleUpLg onClick={this.toggleShowResults} className='text-white match-show-results-icon'/> :
                    <IconAngleDownLg onClick={this.toggleShowResults} className='text-white match-show-results-icon'/>
                }

                <Collapse isOpened={showResults}>
                    <div  className='mb-1 ml-2 mr-2 d-flex flex-column text-white' style={{fontSize: '1.4rem'}}>
                        <span>Jornada #{matchdayNumber}</span>
                        <small style={{fontSize: '65%'}}>{formattedDate}</small>
                    </div>
                    {null/*
                    <div className='mb-1 ml-2 mr-2 d-flex flex-row text-white'>
                        <small style={{width: '45%', textAlign: 'end'}}>{team1.data.name}</small>
                        <small style={{width: '10%'}}>-</small>
                        <small style={{width: '45%', textAlign: 'start'}}>{team2.data.name}</small>
                    </div>
                    */}
                    <div className='teams-scores d-flex flex-row align-items-center justify-content-center'>
                        <span className='teams-scores-team-points'>{team1Points}</span>
                        <span className='ml-4 mr-4 text-white'>PUNTOS</span>
                        <span className='teams-scores-team-points'>{team2Points}</span>
                    </div>
                    <div className='teams-scores d-flex flex-row align-items-center justify-content-center'>
                        <span className='teams-scores-team-pins'>{team1Pins}</span>
                        <span className='ml-4 mr-4 text-white'>&nbsp;&nbsp;PINES&nbsp;&nbsp;</span>
                        <span className='teams-scores-team-pins'>{team2Pins}</span>
                    </div>
                    <div className={`${statusClass} mt-2 mb-2`}>
                        <span>{statusStr}</span>
                    </div>
                </Collapse>
            </div>
        );
    };

    render() {
        const { loadingMatchSummary } = this.props;
        return (
            <div className='match-results mb-2'>
            { loadingMatchSummary ?
                <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'white'}/></div> :
                this.renderContent()
            }
            </div>
        );
    }
}
