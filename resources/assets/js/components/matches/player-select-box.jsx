import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {TimesLg} from "../../utilities/icons";

const turnPlaceholders = [
    'Jugador abridor', 'Segundo jugador', 'Tercer Jugador', 'Jugador cerrador'
];

export default class PlayerSelectBox extends Component {
    static propTypes = {
        player: PropTypes.object,
        turnNumber: PropTypes.number.isRequired,
        selectablePlayers: PropTypes.array.isRequired,
        handlePlayerSelected: PropTypes.func.isRequired,
        handlePlayerDeselect: PropTypes.func.isRequired,
    };

    render() {
        let playerBox = null;
        const { player, turnNumber, handlePlayerSelected, handlePlayerDeselect } = this.props;
        if (player === null){
            playerBox = (
                <Select
                    className='mb-3 mt-2'
                    style={{overflow: 'auto'}}
                    placeholder={turnPlaceholders[turnNumber-1]}
                    value={player}
                    onChange={(value, action) => handlePlayerSelected(value, action, turnNumber)}
                    options={this.props.selectablePlayers}
                />
            );
        } else {
            let hdcpBoxContent = player.id === 0 ? <small><b>&nbsp;100 Pines</b></small> :
                <small>HDCP : <b>{player.handicap === null ? '¿ ?' : player.handicap < 10 ? `\u00A0${player.handicap}\u00A0` : player.handicap}</b></small>;
            playerBox = <div className='d-flex flex-row mb-3 mt-2'>
                <span className='input-group-text player-selection-handicap'>{hdcpBoxContent}</span>
                <input readOnly className={`form-control player-category-${player.category}`} value={player.name}/>
                <button onClick={() => handlePlayerDeselect(turnNumber)} className='btn btn-sm btn-danger'>
                    <TimesLg className='form-control'/>
                </button>
            </div>;
        }

        return playerBox;
    }
}
