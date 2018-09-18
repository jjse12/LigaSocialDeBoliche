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
import MatchScoreboards from "./components/matches/match-scoreboards";
import NotFound from "./components/errors/not-found";
import MatchTeamScoreboard from "./components/matches/match-team-scoreboard";

/*

let admin = document.head.querySelector('meta[name="permisos"]').getAttribute('content');
let nombre = document.head.querySelector('meta[name="nombre"]').getAttribute('content');
*/

const routes = (
    <Switch>
        <Redirect from={webBaseUrl} to={uri.web.home} exact />
        <Route exact path={uri.web.home} component={Dashboard} />
        <Route exact path={uri.web.matchScoreboards(':matchId')} component={MatchScoreboards} />
        <Route exact path={uri.web.matchTeamScoreboard(':matchId', ':seasonTeamId')} component={MatchTeamScoreboard} />
        <Route component={NotFound} />
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
