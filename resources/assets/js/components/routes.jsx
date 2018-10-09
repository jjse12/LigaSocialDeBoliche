import {Redirect, Route, Switch} from "react-router-dom";
import {webBaseUrl} from "../services/uri";
import uri from "../services/uri";
import Dashboard from "./dashboard";
import MatchScoreboards from "./matches/match-scoreboards";
import MatchSeasonTeamScoreboard from "./matches/match-season-team-scoreboard";
import NotFound from "./errors/not-found";
import React from "react";

const routes = (
    <Switch>
        <Redirect from={webBaseUrl} to={uri.web.home} exact />
        <Route exact path={uri.web.home} component={Dashboard} />
        <Route exact path={uri.web.matchScoreboards(':matchId')} component={MatchScoreboards} />
        <Route exact path={uri.web.matchSeasonTeamScoreboard(':matchId', ':seasonTeamId')} component={MatchSeasonTeamScoreboard} />
        <Route component={NotFound} />
    </Switch>
);

export default routes;
