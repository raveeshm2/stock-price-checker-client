import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ConnectedRouter } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import { createStore } from './root/store/store';
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { MainSaga } from './global/store/main-saga';
import { UserSaga } from './user/store/saga';
import { Provider } from "react-redux";
import { StocksSaga } from './stocks/store/saga';
import { SubscriptionSaga } from './Navbar/subscription/store/saga';
import { TriggersSaga } from './triggers/store/saga';
import { PortfolioSaga } from "./portfolio/store/saga";

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();

const store = createStore(history, [
  sagaMiddleware,
  routerMiddleware(history)
]);

const saga = new MainSaga([
  new UserSaga(),
  new StocksSaga(),
  new SubscriptionSaga(),
  new TriggersSaga(),
  new PortfolioSaga()
]);

sagaMiddleware.run(saga.rootSaga.bind(saga));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
