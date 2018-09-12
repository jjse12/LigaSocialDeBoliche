export const ACTION_TYPE_STRING = "get_contenido_actual";

const initialState = 2;

export const setNavbarSelected = (cont=2) => dispatch => (
    dispatch(
        {
            type: ACTION_TYPE_STRING,
            navbarSelected: cont
        })
);

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE_STRING:
            return action.navbarSelected
    }
    return state;
}