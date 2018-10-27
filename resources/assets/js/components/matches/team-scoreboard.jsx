import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { totalsObject } from "../../reducers/matches";
import { updateScore } from "../../reducers/scores";
import { updateScoreFetchingFromStore } from "../../reducers/getters";
import ReactTable from "react-table";
import {matchScoreboardScoresColumns, matchScoreboardTotalsColumns} from "../../utilities/table-columns";
import {scoreIdGameNumberIndex} from "./match";

@connect(
    store => ({
        fetchingUpdateScore: updateScoreFetchingFromStore(store),
    }),
    { updateScore}
)
export default class TeamScoreboard extends Component {
    static propTypes = {
        results: PropTypes.object.isRequired,
        gamesConfirmed: PropTypes.number,
        isEditable: PropTypes.bool.isRequired,
        isOfflineScoreboard: PropTypes.bool.isRequired,
        loadMatchScoreboards: PropTypes.func.isRequired,

        fetchingUpdateScore: PropTypes.bool,
        updateScore: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.renderCell = this.renderCell.bind(this);
    }

    handleScoreFocus = e => {
        const cell = e.target;
        cell.setAttribute('class', 'score-focus');
    };

    handleScoreKeyPress = e => {

        if (e.which === 13){
            e.target.blur();
            return false;
        }

        if (isNaN(String.fromCharCode(e.which)) ||
            e.which === 32 || e.target.textContent.length >= 3){
            e.preventDefault();
        }
    };

    handleScoreKeyUp = e => {
        if (Number(e.target.textContent) > 300) {
            e.target.textContent = "300";
            return true;
        }
    };

    handleScoreBlur = (e, oldScore, gameScoreData) => {
        const cell = e.target;
        const newScore = cell.textContent !== '' &&
                         cell.textContent !== ' '  ?
                         cell.textContent : 0;

        if (oldScore !== Number(newScore)) {
            cell.setAttribute('class', 'score-patching');
            this.props.updateScore(gameScoreData.scoreId, newScore)
            .then(() => {
                cell.setAttribute('class', 'score-update-success');
                this.props.loadMatchScoreboards();
            })
            .catch(() => {
                cell.setAttribute('class', 'score-update-error');
                cell.textContent = oldScore;
            });
        }
        else {
            cell.setAttribute('class', '');
            if (newScore === 0){
                cell.textContent = oldScore;
            }
        }
    };

    renderCell(cellInfo, column) {

        if (_.isUndefined(cellInfo.value))
            return null;

        if (!this.props.isEditable ||
            cellInfo.original.seasonPlayerId === 0)
            return cellInfo.value;

        // If the player's team game have already confirmed this score game number, don't use `contentEditable`
        if (!this.props.isOfflineScoreboard){
            const gc = this.props.gamesConfirmed;
            if (gc > column)
                return cellInfo.value;
        }

        return (
            <div
                className='score-editable'
                onFocus={this.handleScoreFocus}
                onKeyPress={this.handleScoreKeyPress}
                onKeyUp={this.handleScoreKeyUp}
                onPaste={e => { e.preventDefault(); }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => this.handleScoreBlur(e, cellInfo.value, cellInfo.original[scoreIdGameNumberIndex[column]])}
            >{cellInfo.value}</div>
        );
    }

    render() {
        const {results} = this.props;
        let data = [], columns = matchScoreboardScoresColumns(this),
            totalsColumns = matchScoreboardTotalsColumns(true, true),
            totalsData = [
                totalsObject('Pin neto'),
                totalsObject('Handicap'),
                totalsObject('Total')
            ];

        if (!_.isEmpty(results)) {
            data = results.playersScores;
            totalsData = results.gamesTotals;
            totalsColumns = matchScoreboardTotalsColumns(data.length === 0)
        }

        return (
            <div className={'match-scoreboard-table-container'}>
                <ReactTable
                    className={'match-scoreboard-table -striped -highlight'}
                    getNoDataProps={() => {return {style: {display: 'none'}}}}
                    data={data}
                    columns={columns}
                    getProps={() => {return {style: {color: 'white'}}}}
                    showPagination={false}
                    showPageSizeOptions={false}
                    minRows={0}
                    pageSize={data.length}
                />
                <ReactTable
                    className={'match-scoreboard-table -striped -highlight'}
                    data={totalsData}
                    columns={totalsColumns}
                    getProps={() => {return {style: {color: 'white'}}}}
                    getTheadThProps={() => {return {style:{display: 'none'}}}}
                    showPagination={false}
                    showPageSizeOptions={false}
                    minRows={0}
                    pageSize={3}
                />
            </div>
        );
    }
}
