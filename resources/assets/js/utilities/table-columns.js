import React from 'react';
export const matchScoreboardScoresColumns = (match, teamId) => {
    return [
        {
            Header: 'HDCP',
            accessor: 'handicap',
            className: 'text-center',
            sortable: false,
            width: 55
        },
        {
            Header: 'Jugador',
            accessor: 'playerName',
            className: 'text-center',
            sortable: false,
            width: 175
        },
        {
            Header: 'Linea 1',
            accessor: 'firstGame',
            className: 'text-center',
            sortable: false,
            width: 65,
            Cell: row => match.renderCell(row, 'firstGameScoreId')
        },
        {
            Header: 'Linea 2',
            accessor: 'secondGame',
            className: 'text-center',
            sortable: false,
            width: 65,
            Cell: row => match.renderCell(row, 'secondGameScoreId')
        },
        {
            Header: 'Linea 3',
            accessor: 'thirdGame',
            className: 'text-center',
            sortable: false,
            width: 65,
            Cell: row => match.renderCell(row, 'thirdGameScoreId')
        },
        {
            Header: 'Total',
            accessor: 'total',
            className: 'text-center',
            sortable: true,
            width: 70
        }
    ];
};

export const matchScoreboardTotalsColumns = (empty = false) => {
    return [
        {
            Header: !empty ? 'Totales' : <div style={{background: 'tomato'}}>! Aún no se han registrado marcadores para este juego !</div>,
            columns: [
                {
                    Header: null,
                    accessor: 'title',
                    sortable: false,
                    className: 'text-center',
                    width: 230,
                },
                {
                    Header: null,
                    accessor: 'firstGame',
                    className: 'text-center',
                    sortable: false,
                    width: 65
                },
                {
                    Header: null,
                    accessor: 'secondGame',
                    className: 'text-center',
                    sortable: false,
                    width: 65
                },
                {
                    Header: null,
                    accessor: 'thirdGame',
                    className: 'text-center',
                    sortable: false,
                    width: 65
                },
                {
                    // getProps:
                    //                     (state, rowInfo) => ({
                    //         style: {
                    //             color: 'white'
                    //         }
                    //     }),
                    Header: null,
                    accessor: 'total',
                    className: 'text-center',
                    sortable: true,
                    width: 70
                }
            ]
        },
    ];
};
