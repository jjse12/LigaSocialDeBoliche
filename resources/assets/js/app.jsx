/**
 * Created by Jenner Sánchez on 09/11/18.
 */

import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import store, { browserHistory } from './store';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import uri, { webBaseUrl  } from './services/uri';

// import { ReactTableDefaults } from "react-table";
import Dashboard from "./components/dashboard";

/*

let admin = document.head.querySelector('meta[name="permisos"]').getAttribute('content');
let nombre = document.head.querySelector('meta[name="nombre"]').getAttribute('content');
*/

const routes = (
    <Switch>
        <Redirect from={webBaseUrl} to={uri.web.home} exact />
        <Route exact path={uri.web.home} component={Dashboard} />
    </Switch>
);

ReactDom.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <div>
                {routes}
            </div>
        </Router>
    </Provider>,
    document.getElementById('react-app')
);
