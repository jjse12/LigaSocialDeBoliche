import Axios from 'axios';
import update from 'immutability-helper';
Axios.defaults.headers.common['Accept'] = 'application/json';
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
Axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.head.querySelector('meta[name="csrf-token"]').getAttribute('content');


const initialState = {};
const IS_FETCHING = 'ajax_is_fetching';

// Action creator
export const isFetching = (key, isFetching) => ({
    key,
    isFetching,
    type: IS_FETCHING,
});

const isFetchingStore = store => store.isFetching;
export const isFetchingFromStore = (store, key) => isFetchingStore(store)[key] || false;

export function checkResponse(response) {
    if (Math.floor(response.status / 100) !== 2) {
        return Promise.reject(response);
    } else {
        return Promise.resolve(response.data);
    }
}

function checkErrorResponse(error) {
    if (error.response) //&&
       // (error.response.status === 400 ||
       //  error.response.status === 401 ||
       //  error.response.status === 403 ||
       //  error.response.status === 404 ||
       //  error.response.status === 422))
    {

        if (error.response.data){
            console.log(error.response.data);
        //TODO: Use pretty alert dialog to show error
            if (error.response.data.errors){
                let errors = [];
                Object.values(error.response.data.errors).map(err => {
                    err.map(e => {
                        errors.push(e);
                        alert(e);
                    }) ;
                });
                // TODO: create dialog with list of errors.
            } else if (error.response.data.message){
                alert(error.response.data.message);
            } else {
                alert('Ha ocurrido un error inesperado, por favor intenta nuevamente.');
            }
        } else {
            alert('Ha ocurrido un error inesperado, por favor intenta nuevamente.');
        }
    }
}

export function ajaxAction(action, ajaxAction, showLoading, showAlertBool) {
    return dispatch => {
        dispatch(isFetching(action, true));
        return ajaxAction()
            .then(checkResponse)
            .then(response => {
                dispatch({
                    type: action,
                    data: response,
                });
                dispatch(isFetching(action, false));
                return response;
            })
            .catch(error => {
                dispatch(isFetching(action, false));
                checkErrorResponse(error);
                return Promise.reject(error);
            });
    };
}

export function ajaxGet(action, url, showLoading = true, showAlert = true) {
    return ajaxAction(action, () => Axios.get(url), showLoading, showAlert);
}

export function ajaxPost(action, url, data, showLoading = true, showAlert = true) {
    return ajaxAction(action, () => Axios.post(url, data), showLoading, showAlert);
}

export function ajaxPut(action, url, data, showLoading = true, showAlert = true) {
    return ajaxAction(action, () => Axios.put(url, data), showLoading, showAlert);
}

export function ajaxPatch(action, url, data, showLoading = true, showAlert = true) {
    return ajaxAction(action, () => Axios.patch(url, data), showLoading, showAlert);
}

export function ajaxDelete(action, url, showLoading = true, showAlert = true) {
    return ajaxAction(action, () => Axios.delete(url), showLoading, showAlert);
}

export function isFetchingReducer(state = initialState, action) {
    switch(action.type) {
        case IS_FETCHING:
            return update(state, {
                [action.key]: {
                    $set: action.isFetching
                }
            });
    }
    return state;
}
