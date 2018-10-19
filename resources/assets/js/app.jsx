/**
 * Created by Jenner Sánchez on 09/11/18.
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import store, { browserHistory } from './store';
import { Router} from 'react-router-dom';
import Main from './components/main-container';

const appComponent = document.getElementById('react-app');
ReactDom.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Main auth={appComponent.getAttribute('data-auth') !== ''} />
        </Router>
    </Provider>,
    appComponent
);

