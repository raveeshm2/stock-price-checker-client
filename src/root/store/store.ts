import { applyMiddleware, compose, createStore as createStoreBase } from "redux";
import { createLogger } from 'redux-logger';
import * as Root from "./reducer";
import { History } from "history";

export function createStore(history: History, middlewares: any[]) {
    let composeEnhancers = compose;

    if (process.env.NODE_ENV === 'development') {
        if ('__REDUX_DEVTOOLS_EXTENSION_COMPOSE__' in window) {
            composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        }
        middlewares.push(createLogger());
    }

    return createStoreBase<Root.State, any, any, any>(
        Root.createReducer(history),
        Root.initialState,
        composeEnhancers(applyMiddleware(...middlewares))
    );
}
