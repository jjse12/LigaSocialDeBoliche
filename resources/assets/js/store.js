import reducer from './reducers';
import thunk from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const routerMiddlewareImpl = routerMiddleware(browserHistory);

const store = createStore(reducer, composeEnhancers(
  applyMiddleware(routerMiddlewareImpl, thunk)
));

export { browserHistory };
export default store;
