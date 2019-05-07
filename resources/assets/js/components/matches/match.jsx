import React, {Component} from 'react';
import PropTypes, { shape } from 'prop-types';
import { connect } from "react-redux";
import {
    getMatchSummary,
    getMatchScoreboards,
    setPlayerSelectionDialogOpen,
    setNewGameDialogOpen,
    setEndPhaseDialogOpen,
    matchTeamEndPhase,
} from "../../reducers/match";
import { updateScore} from "../../reducers/match/edition/scores";
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
        matchScoreboards: selectors.matchScoreboards(store),
        userSeasonTeamId: selectors.userCurrentSeason(store).team.id,
        fetchingMatchScoreboards: selectors.loadingMatchScoreboards(store),
        isPlayerSelectionDialogOpen: selectors.matchPlayerSelection(store).isDialogOpen,
        isNewGameDialogOpen: selectors.matchNewGame(store).isDialogOpen,
        isEndPhaseDialogOpen: selectors.matchEndPhase(store).isDialogOpen,
    }),
    {
        getMatchSummary,
        getMatchScoreboards,
        setPlayerSelectionDialogOpen,
        setNewGameDialogOpen,
        setEndPhaseDialogOpen,
        matchTeamEndPhase,
    }
)
export default class Match extends Component {
    static propTypes = {
        match: shape({
            params: shape({
                id: PropTypes.string.isRequired
            })
        }).isRequired,

        id: PropTypes.number.isRequired,
        matchScoreboards: PropTypes.object.isRequired,
        userSeasonTeamId: PropTypes.number.isRequired,
        fetchingMatchScoreboards: PropTypes.bool.isRequired,
        isPlayerSelectionDialogOpen: PropTypes.bool.isRequired,
        isNewGameDialogOpen: PropTypes.bool.isRequired,
        isEndPhaseDialogOpen: PropTypes.bool.isRequired,

        getMatchSummary: PropTypes.func.isRequired,
        getMatchScoreboards: PropTypes.func.isRequired,
        setPlayerSelectionDialogOpen: PropTypes.func.isRequired,
        setNewGameDialogOpen: PropTypes.func.isRequired,
        setEndPhaseDialogOpen: PropTypes.func.isRequired,
        matchTeamEndPhase: PropTypes.func.isRequired,
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
                if (this.matchStatus() === 'active'){
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
            if (this.matchStatus() === 'active'){
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
            isPlayerSelectionDialogOpen,
            setPlayerSelectionDialogOpen,
            isNewGameDialogOpen,
            setNewGameDialogOpen,
        } = this.props;
        if (this.isMatchPlayer()){
            if (this.matchPhaseByMyTeamGamesConfirmed().includes('Game')) {
                if ( this.matchMyTeamGameScoresCount(this.matchPhaseByMyTeamGamesConfirmed()) === 0) {
                    if (isPlayerSelectionDialogOpen)
                        return;

                    if (this.matchPhaseByMyTeamGamesConfirmed() === 'firstGame'){
                        // For first game there are no players to keep, open the players selection dialog immediately
                        if (!isPlayerSelectionDialogOpen)
                            setPlayerSelectionDialogOpen(true);
                    }
                    else {
                        if (!isNewGameDialogOpen)
                            setNewGameDialogOpen(true);
                    }
                    return ;
                }
            }
        }

        if (isPlayerSelectionDialogOpen)
            setPlayerSelectionDialogOpen(false);
        if (isNewGameDialogOpen)
            setNewGameDialogOpen(false);
    };

    isMatchPlayer = () => {
        const { userSeasonTeamId } = this.props;
        return userSeasonTeamId !== 0;
    };

    getMatchMyTeam = () => {
        const { matchScoreboards, userSeasonTeamId } = this.props;
        if (!this.isMatchPlayer() || _.isEmpty(matchScoreboards))
            return null;

        if (userSeasonTeamId === matchScoreboards.team1.data.id)
            return matchScoreboards.team1;

        if (userSeasonTeamId === matchScoreboards.team2.data.id)
            return matchScoreboards.team2;
        
        return null;
    };

    getMatchRivalTeam = () => {
        const { matchScoreboards, userSeasonTeamId } = this.props;
        if (!this.isMatchPlayer() || _.isEmpty(matchScoreboards))
            return null;

        if (userSeasonTeamId !== matchScoreboards.team1.data.id)
            return matchScoreboards.team1;

        if (userSeasonTeamId !== matchScoreboards.team2.data.id)
            return matchScoreboards.team2;

        return null;
    };

    matchStatus = () => {
        const { matchScoreboards: { statusData }} = this.props;
        return statusData ? statusData.status : '';
    };

    matchPhase = () => {
        const { matchScoreboards: { statusData } } = this.props;
        return this.matchStatus() === 'active' ? statusData.phase : null;
    };

    matchPhaseByMyTeamGamesConfirmed = () => {
        if (!this.isMatchPlayer()) return null;

        if (this.matchStatus() === 'active'){
            const { data: { gamesConfirmed } } = this.getMatchMyTeam();
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
        return this.matchStatus();
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
        const { id, userSeasonTeamId, isPlayerSelectionDialogOpen } = this.props;
        return (
            <div style={{alignItems: 'center', alignContent: 'center'}} className={'mr-2 ml-2 mt-2 mb-2'}>
                <MatchSummary/>
                <MatchScoreboards
                    matchId={Number(id)}
                    matchScoreboards={this.props.matchScoreboards}
                    loadMatchScoreboards={this.loadMatchScoreboardsWithCallbacks}
                    fetchingMatchScoreboards={this.props.fetchingMatchScoreboards}
                    requestEndPhase={this.requestEndPhase}
                    isMatchPlayer={this.isMatchPlayer()}
                    matchPlayerSeasonTeamId={userSeasonTeamId}
                    matchStatus={this.matchStatus()}
                    matchPhase={this.matchPhase()}
                    matchMyTeam={this.getMatchMyTeam()}
                    matchRivalTeam={this.getMatchRivalTeam()}
                    matchMyTeamGameScoresCount={this.matchMyTeamGameScoresCount}
                    matchPhaseByMyTeamGamesConfirmed={this.matchPhaseByMyTeamGamesConfirmed()}
                    playerSelectionDialogOpen={isPlayerSelectionDialogOpen}
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
