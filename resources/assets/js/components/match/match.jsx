import React, {Component} from 'react';
import { number, string, object, func, bool, shape } from 'prop-types';
import { connect } from "react-redux";
import {
    getMatchSummary,
    getMatchScoreboards,
    setPlayersSelectionDialogOpen,
    setNewGameDialogOpen,
    setEndPhaseDialogOpen,
    matchTeamEndPhase,
} from "../../reducers/match";
import selectors from "../../reducers/selectors";
import _ from 'lodash';
import NewGameDialog from "./dialogs/new-game-dialog";
import PlayersSelectionDialog from "./dialogs/players-selection-dialog";
import MatchScoreboards from "./match-scoreboards";
import MatchSummary from "./match-summary";
import EndPhaseDialog from "./dialogs/end-phase-dialog";

export const scoreIdGameNumberIndex = [
    'firstGame',
    'secondGame',
    'thirdGame',
];

export const gameNumberStrings = {
    warming: 'Calentamiento',
    firstGame: 'Primera Linea',
    secondGame: 'Segunda Linea',
    thirdGame: 'Tercera Linea'
};

@connect(
    store => ({
        id: selectors.matchSummary(store).id,
        matchStatus: selectors.matchStatus(store),
        matchPhase: selectors.matchPhase(store),
        matchScoreboards: selectors.matchScoreboards(store),
        userSeasonTeamId: selectors.userCurrentSeasonTeamId(store),
        isMatchPlayer: selectors.isMatchPlayer(store),
        fetchingMatchScoreboards: selectors.loadingMatchScoreboards(store),
        isPlayersSelectionDialogOpen: selectors.matchPlayersSelection(store).isDialogOpen,
        isNewGameDialogOpen: selectors.matchNewGame(store).isDialogOpen,
        isEndPhaseDialogOpen: selectors.matchEndPhase(store).isDialogOpen,
    }),
    {
        getMatchSummary,
        getMatchScoreboards,
        setPlayersSelectionDialogOpen,
        setNewGameDialogOpen,
        setEndPhaseDialogOpen,
        matchTeamEndPhase,
    }
)
export default class Match extends Component {
    static propTypes = {
        match: shape({
            params: shape({
                id: string.isRequired
            })
        }).isRequired,

        id: number.isRequired,
        matchStatus: string.isRequired,
        matchPhase: string,
        matchScoreboards: object.isRequired,
        userSeasonTeamId: number.isRequired,
        isMatchPlayer: bool.isRequired,
        fetchingMatchScoreboards: bool.isRequired,
        isPlayersSelectionDialogOpen: bool.isRequired,
        isNewGameDialogOpen: bool.isRequired,
        isEndPhaseDialogOpen: bool.isRequired,

        getMatchSummary: func.isRequired,
        getMatchScoreboards: func.isRequired,
        setPlayersSelectionDialogOpen: func.isRequired,
        setNewGameDialogOpen: func.isRequired,
        setEndPhaseDialogOpen: func.isRequired,
        matchTeamEndPhase: func.isRequired,
    };

    state = {
        fillOfflineScoreboardDialogOpen: false,
        pollingTime: 30,
    };

    setMatchPollingTime = time => {
        this.setState({pollingTime : time});
    };

    matchScoreboardsPoller = async () => {
        let promise = new Promise(resolve => setTimeout(() => {resolve('Done')}, this.state.pollingTime * 1000));
        if (await promise === 'Done'){
            this.loadMatchScoreboardsWithCallbacks(() => {
                const { matchStatus } = this.props;
                if (matchStatus === 'active'){
                    this.setNewGameDialogOpenAsRequired();
                    this.matchScoreboardsPoller();
                }
            });
        } else {
            this.matchScoreboardsPoller();
        }
    };

    componentWillMount = async () => {
        const id = this.props.match.params.id;
        const { getMatchSummary } = this.props;
        await getMatchSummary(id);

        this.loadMatchScoreboardsWithCallbacks(() => {
            const { matchStatus } = this.props;
            if (matchStatus === 'active'){
                // Poller for updating match scoreboards every `this.state.pollingTime` seconds
                // this.matchScoreboardsPoller();
                this.setNewGameDialogOpenAsRequired();
            }
        });
    };

    loadMatchScoreboards = () => {
        const { id, getMatchScoreboards } = this.props;
        return getMatchScoreboards(id);
    };

    loadMatchScoreboardsWithCallbacks = (thenCallback = null, catchCallback = null, finallyCallback = null) => {
        const promise = this.loadMatchScoreboards();
        if (thenCallback !== null)
            promise.then(response => thenCallback(response));

        if (catchCallback !== null)
            promise.catch(jqXHR => catchCallback(jqXHR));

        if (finallyCallback !== null)
            promise.finally(response => finallyCallback(response));
    };

    requestEndPhase = () => {
        if (this.getMatchMyTeam().gamesConfirmed === 0)
            this.seasonTeamEndPhase();
        else{
            const { setEndPhaseDialogOpen } = this.props;
            setEndPhaseDialogOpen(true);
        }
    };

    setFillOfflineScoreboardDialogOpen = (open = false) => {
        this.setState({fillOfflineScoreboardDialog: open});
    };

    matchMyTeamGameScoresCount = gameNumber => {
        const playersScores = this.getMatchMyTeam().results.playersScores;
        if (playersScores.length === 0)
            return 0;

        let count = 0;
        playersScores.map(playerScore => {
            if (playerScore[gameNumber] !== undefined){
                count++;
            }
        });
        return count;
    };

    setNewGameDialogOpenAsRequired = () => {
        const {
            isMatchPlayer,
            isPlayersSelectionDialogOpen,
            setPlayersSelectionDialogOpen,
            isNewGameDialogOpen,
            setNewGameDialogOpen,
        } = this.props;
        if (isMatchPlayer){
            if (this.matchPhaseByMyTeamGamesConfirmed().includes('Game')) {
                if ( this.matchMyTeamGameScoresCount(this.matchPhaseByMyTeamGamesConfirmed()) === 0) {
                    if (isPlayersSelectionDialogOpen)
                        return;

                    if (this.matchPhaseByMyTeamGamesConfirmed() === 'firstGame'){
                        // For first game there are no players to keep, open the players selection dialog immediately
                        if (!isPlayersSelectionDialogOpen)
                            setPlayersSelectionDialogOpen(true);
                    }
                    else {
                        if (!isNewGameDialogOpen)
                            setNewGameDialogOpen(true);
                    }
                    return ;
                }
            }
        }

        if (isPlayersSelectionDialogOpen)
            setPlayersSelectionDialogOpen(false);
        if (isNewGameDialogOpen)
            setNewGameDialogOpen(false);
    };

    getMatchMyTeam = () => {
        const { isMatchPlayer, matchScoreboards, userSeasonTeamId } = this.props;
        if (!isMatchPlayer || _.isEmpty(matchScoreboards))
            return null;

        if (userSeasonTeamId === matchScoreboards.team1.data.id)
            return matchScoreboards.team1;

        if (userSeasonTeamId === matchScoreboards.team2.data.id)
            return matchScoreboards.team2;
        
        return null;
    };

    getMatchRivalTeam = () => {
        const { isMatchPlayer, matchScoreboards, userSeasonTeamId } = this.props;
        if (!isMatchPlayer || _.isEmpty(matchScoreboards))
            return null;

        if (userSeasonTeamId !== matchScoreboards.team1.data.id)
            return matchScoreboards.team1;

        if (userSeasonTeamId !== matchScoreboards.team2.data.id)
            return matchScoreboards.team2;

        return null;
    };

    matchPhaseByMyTeamGamesConfirmed = () => {
        const { isMatchPlayer, matchStatus } = this.props;
        if (!isMatchPlayer) return null;

        if (matchStatus === 'active'){
            const myTeam = this.getMatchMyTeam();
            if (myTeam === null) return null;
            const { data: { gamesConfirmed } } = myTeam;
            if (gamesConfirmed === null)
                return 'warming';
            switch (gamesConfirmed) {
                case 0:
                    return 'firstGame';
                case 1:
                    return 'secondGame';
                case 2:
                    return 'thirdGame';
                case 3:
                    return 'concluded';
            }
        }
        return matchStatus;
    };

    seasonTeamEndPhase = () => {
        const { id, matchTeamEndPhase, userSeasonTeamId } = this.props;
        let promise = matchTeamEndPhase(id, userSeasonTeamId, this.matchPhaseByMyTeamGamesConfirmed());
        promise.then(() => {
                this.loadMatchScoreboardsWithCallbacks(this.setNewGameDialogOpenAsRequired);
            });

        return promise;
    };

    render() {
        return (
            <div style={{alignItems: 'center', alignContent: 'center'}} className={'mr-2 ml-2 mt-2 mb-2'}>
                <MatchSummary/>
                <MatchScoreboards
                    loadMatchScoreboards={this.loadMatchScoreboardsWithCallbacks}
                    fetchingMatchScoreboards={this.props.fetchingMatchScoreboards}
                    requestEndPhase={this.requestEndPhase}
                    matchMyTeam={this.getMatchMyTeam()}
                    matchRivalTeam={this.getMatchRivalTeam()}
                    matchMyTeamGameScoresCount={this.matchMyTeamGameScoresCount}
                />
                {
                    this.getMatchMyTeam() !== null && (
                        <React.Fragment>
                            <PlayersSelectionDialog
                                teamMatchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                                teamGamesConfirmed={this.getMatchMyTeam().data.gamesConfirmed}
                                playersScores={this.getMatchMyTeam().results.playersScores}
                                loadMatchScoreboards={this.loadMatchScoreboards}
                            />
                            <NewGameDialog
                                matchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                                loadMatchScoreboards={this.loadMatchScoreboards}
                            />
                            <EndPhaseDialog
                                matchPhase={this.matchPhaseByMyTeamGamesConfirmed()}
                                endPhaseCallback={this.seasonTeamEndPhase}
                            />
                        </React.Fragment>
                    )
                }
            </div>
        );
    }
}
