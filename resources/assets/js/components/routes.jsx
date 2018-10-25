import {Redirect, Route, Switch} from "react-router-dom";
import {webBaseUrl} from "../services/uri";
import uri from "../services/uri";
import Dashboard from "./dashboard";
import MatchSeasonTeamScoreboard from "./matches/match-season-team-scoreboard";
import NotFound from "./errors/not-found";
import React from "react";
import Match from "./matches/match";

const routes = (
    <Switch>
        <Redirect from={webBaseUrl} to={uri.web.home} exact />
        <Route exact path={uri.web.home} component={Dashboard} />
        <Route exact path={uri.web.match(':id([0-9]+)')} component={Match} />
        <Route exact path={uri.web.matchSeasonTeamScoreboard(':matchId([0-9]+)', ':seasonTeamId([0-9]+)')} component={MatchSeasonTeamScoreboard} />
        <Route component={NotFound} />
    </Switch>
);

export default routes;
