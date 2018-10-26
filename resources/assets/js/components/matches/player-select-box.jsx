import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {IconTimesLg} from "../../utilities/icons";

const turnPlaceholders = [
    'Jugador abridor', 'Segundo jugador', 'Tercer Jugador', 'Jugador cerrador'
];

const CustomOption = ({data, innerProps}) => {
    return PlayerBox({
        type: 'option',
        player: data,
        innerProps: innerProps
    });
};

const PlayerBox = data => {
    const {type, player, playerDeselectHandler, innerProps} = data;
    let className = 'handicap-box', handicap = player.handicap;
    if (player.id === 0) {
        handicap = 100;
        className = 'blind-handicap-box';
    } else if (player.handicap === null) {
        className = 'pending-handicap-box';
        handicap = player.unconcluded.handicap === null ? '¿?' : player.unconcluded.handicap;
    }

    return (
        <div {...innerProps} className={`d-flex flex-row ${type === 'selected' ? 'mb-3 mt-2' : ''}`}>
            <div className={className}>
                <span>{handicap}</span>
            </div>
            <span className={`form-control player-category-${player.category ? player.category : 'blind'}`}>
                {player.name}
            </span>
            {
                type === 'selected' ?
                <button onClick={playerDeselectHandler} className='btn btn-sm btn-danger'>
                    <IconTimesLg className='form-control'/>
                </button> : null
            }
        </div>
    );
};

export default class PlayerSelectBox extends Component {
    static propTypes = {
        player: PropTypes.object,
        turnNumber: PropTypes.number.isRequired,
        selectablePlayers: PropTypes.array.isRequired,
        handlePlayerSelected: PropTypes.func.isRequired,
        handlePlayerDeselect: PropTypes.func.isRequired,
    };

    render() {
        const { player, turnNumber, handlePlayerSelected, handlePlayerDeselect } = this.props;
        if (player === null){
            return  (
                <Select
                    menuPosition={'fixed'}
                    minMenuHeight={80}
                    maxMenuHeight={170}
                    components={{Option: CustomOption}}
                    className='mb-3 mt-2'
                    placeholder={turnPlaceholders[turnNumber-1]}
                    value={player}
                    onChange={(value, action) => handlePlayerSelected(value, action, turnNumber)}
                    options={this.props.selectablePlayers}
                />
            );
        }
        return PlayerBox({
            type: 'selected',
            player: player,
            playerDeselectHandler: () => handlePlayerDeselect(turnNumber)
        });
    }
}
