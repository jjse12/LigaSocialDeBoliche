import Axios from 'axios';
import Promise from 'promise';
import update from 'immutability-helper';
Axios.defaults.headers.common['Accept'] = 'application/json';

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

function checkUnauthorized(error) {
    if (error.response && error.response.status === 401) {
        window.location = '/';
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
                checkUnauthorized(error);
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
