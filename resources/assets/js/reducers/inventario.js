import {ajaxGet} from "sip-ui-react/lib/reducers/ajax";

export const ACTION_TYPE_STRING = "get_inventario";

const initialState = [];

export const getInventario = (showLoading = true, showError = true) => dispatch => (
    dispatch(
        ajaxGet(ACTION_TYPE_STRING, '/api/inventario', showLoading, showError)
    )
);

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE_STRING:
            return action.data;
    }
    return state;
}