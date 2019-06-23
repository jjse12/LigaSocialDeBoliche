import React, {Component} from 'react';
import { IconTimesLg } from "../../../utilities/icons";
import { shape, object, string, number, array, func } from 'prop-types';
import Select from 'react-select';

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
                    <IconTimesLg/>
                </button> : null
            }
        </div>
    );
};

export default class PlayersSelectBox extends Component {
    static propTypes = {
        player: object,
        turnNumber: number.isRequired,
        selectablePlayers: array.isRequired,
        handlePlayerSelected: func.isRequired,
        handlePlayerDeselect: func.isRequired,
    };

    formatPlayer = player => {
        let formattedPlayer = player;
        formattedPlayer.label = player.fullName;
        formattedPlayer.name = player.fullName;
        return formattedPlayer;
    };

    formatSelectablePlayers = () => {
        const { selectablePlayers } = this.props;
        return selectablePlayers.map(player => (this.formatPlayer(player)));
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
                    value={null}
                    onChange={(value, action) => handlePlayerSelected(value, action, turnNumber)}
                    options={this.formatSelectablePlayers()}
                />
            );
        }
        return PlayerBox({
            type: 'selected',
            player: this.formatPlayer(player),
            playerDeselectHandler: () => handlePlayerDeselect(turnNumber)
        });
    }
}
