export const ACTION_TYPE_STRING = "get_inventario_selected";

const initialState = {};

export const setInventarioSelected = (paquetes = {}) => dispatch => (
    dispatch(
        {
            type: ACTION_TYPE_STRING,
            inventarioSelected: paquetes
        })
);

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE_STRING:
            return action.inventarioSelected;
    }
    return state;
}