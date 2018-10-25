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

    render() {
        return <div>Scores</div>;
    }
}
