'use strict';
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _axios = require('axios');
var _axios2 = _interopRequireDefault(_axios);
var _promise = require('promise');
var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
_axios2.default.defaults.headers.common['Accept'] = 'application/json';

var isFetching = (key, _isFetching) => {
    return {
        key: key,
        isFetching: _isFetching,
        type: 'ajax_is_fetching'
    };
};

function checkResponse(response) {
    if (Math.floor(response.status / 100) !== 2) {
        return _promise2.default.reject(response);
    } else {
        return _promise2.default.resolve(response.data);
    }
}

function checkUnauthorized(error) {
    if (error.response && error.response.status == 401) {
        window.location = '/';
    }
}

function ajaxAction(action, ajaxAction) {
    return function (dispatch) {
        // dispatch((0, _errors.clearError)(action));
        // if (showLoading) {
        //     dispatch((0, _ui.startLoading)());
        // }
        dispatch(isFetching(action, true));
        return ajaxAction().then(checkResponse).then(function (response) {
            dispatch({
                type: action,
                data: response
            });
            dispatch(isFetching(action, false));
            // if (showLoading) {
            //     dispatch((0, _ui.finishLoading)());
            // }
            return response;
        }).catch(function (error) {
            // dispatch((0, _errors.setError)(action, error));
            dispatch(isFetching(action, false));
            checkUnauthorized(error);
            // if (showLoading) {
            //     dispatch((0, _ui.finishLoading)());
            // }
            // if (showAlertBool) {
            //     dispatch((0, _ui.showAlert)('Error', (0, _errors.formatErrorResponse)(error)));
            // }
            return _promise2.default.reject(error);
        });
    };
}

export function ajaxGet(action, url) {
    // var showLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    // var showAlert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    return ajaxAction(action, function () {
        return _axios2.default.get(url);
    });//, showLoading, showAlert);
}

export function ajaxPost(action, url, data) {
    // var showLoading = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    // var showAlert = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    return ajaxAction(action, function () {
        return _axios2.default.post(url, data);
    });//, showLoading, showAlert);
}

export function ajaxPut(action, url, data) {
    // var showLoading = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    // var showAlert = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

    return ajaxAction(action, function () {
        return _axios2.default.put(url, data);
    });//, showLoading, showAlert);
}

export function ajaxDelete(action, url) {
    // var showLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    // var showAlert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    return ajaxAction(action, function () {
        return _axios2.default.delete(url);
    });//, showLoading, showAlert);
}
