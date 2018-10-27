import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createMatchNewGameScoresForLastGamePlayers } from '../../reducers/scores';
import { getMatchScoreboardsFromStore } from '../../reducers/getters';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ReactLoading from "react-loading";
import moment from 'moment';
import {Collapse} from "react-collapse";
import {IconAngleDownLg, IconAngleDownXs, IconAngleUpLg, IconAngleUpXs} from "../../utilities/icons";
import {gameNumberStrings} from "./match";

@connect(
    store => ({
        matchScoreboards: getMatchScoreboardsFromStore(store),
    }),
    { }
)
export default class MatchResults extends Component {
    static propTypes = {
        matchScoreboards: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            showResults: false
        }
    }

    toggleShowResults = () => {
        const { showResults } = this.state;
        this.setState({showResults: !showResults});
    };

    renderContent = () => {
        const { matchScoreboards } = this.props;
        const {statusData, date, matchdayNumber, virtual, redPin, team1, team2} = matchScoreboards;
        const {status, phase, diffForHumans} = statusData;
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
                    this.state.showResults ?
                    <IconAngleUpLg onClick={this.toggleShowResults} className='text-white match-show-results-icon'/> :
                    <IconAngleDownLg onClick={this.toggleShowResults} className='text-white match-show-results-icon'/>
                }

                <Collapse isOpened={this.state.showResults}>
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
                        <span className='teams-scores-team-points'>{team1.data.points}</span>
                        <span className='ml-4 mr-4 text-white'>PUNTOS</span>
                        <span className='teams-scores-team-points'>{team2.data.points}</span>
                    </div>
                    <div className='teams-scores d-flex flex-row align-items-center justify-content-center'>
                        <span className='teams-scores-team-pins'>{team1.results.gamesTotals[2].total}</span>
                        <span className='ml-4 mr-4 text-white'>&nbsp;&nbsp;PINES&nbsp;&nbsp;</span>
                        <span className='teams-scores-team-pins'>{team2.results.gamesTotals[2].total}</span>
                    </div>
                    <div className={`${statusClass} mt-2 mb-2`}>
                        <span>{statusStr}</span>
                    </div>
                </Collapse>
            </div>
        );
    };

    render() {

        return (
            <div className='match-results mb-2'>
            {
                _.isEmpty(this.props.matchScoreboards) ?
                    <div className='d-flex justify-content-center mb-3'><ReactLoading type={'spin'} color={'white'}/></div> :
                    this.renderContent()
            }
            </div>
        );
    }
}
