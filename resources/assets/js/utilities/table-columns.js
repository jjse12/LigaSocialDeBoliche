import React from 'react';
export const matchScoreboardScoresColumns = () => {
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
            accessor: 'player',
            className: 'text-center',
            sortable: false,
            width: 175
        },
        {
            Header: 'Linea 1',
            accessor: 'firstGame',
            className: 'text-center',
            sortable: false,
            width: 65
        },
        {
            Header: 'Linea 2',
            accessor: 'secondGame',
            className: 'text-center',
            sortable: false,
            width: 65
        },
        {
            Header: 'Linea 3',
            accessor: 'thirdGame',
            className: 'text-center',
            sortable: false,
            width: 65
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

export const matchScoreboardTotalsColumns= () => {
    return [
        {
            Header: 'Totales',
            columns: [
                {
                    accessor: 'title',
                    sortable: false,
                    className: 'text-center',
                    width: 230,
                },
                {
                    Header: 'Linea 1',
                    accessor: 'firstGame',
                    className: 'text-center',
                    sortable: false,
                    width: 65
                },
                {
                    Header: 'Linea 2',
                    accessor: 'secondGame',
                    className: 'text-center',
                    sortable: false,
                    width: 65
                },
                {
                    Header: 'Linea 3',
                    accessor: 'thirdGame',
                    className: 'text-center',
                    sortable: false,
                    width: 65
                },
                {
                    Header: 'Total',
                    accessor: 'total',
                    className: 'text-center',
                    sortable: true,
                    width: 70
                }
            ]
        },
    ];
};
