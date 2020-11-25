import { Action, combineReducers, Reducer } from "redux";
import { connectRouter, RouterState } from 'connected-react-router';
import * as User from "../../user/store/reducer";
import * as Stock from "../../stocks/store/reducer";
import * as Trigger from "../../triggers/store/reducer";
import * as Portfolio from "../../portfolio/store/reducer";
import { History } from "history";
import { ToastState } from "../../ui/toast/model";
import * as Toast from "../../ui/toast/reducer";

export interface State {
    user: User.State;
    router: RouterState;
    stocks: Stock.State;
    triggers: Trigger.State;
    toast: ToastState;
    portfolio: Portfolio.State
}

export const initialState: State = {
    user: User.initialState,
    router: undefined as unknown as RouterState,
    stocks: Stock.initialState,
    toast: Toast.initialState,
    triggers: Trigger.initialState,
    portfolio: Portfolio.initialState
};

export function createReducer(history: History): Reducer<State, Action> {
    const combinedReducer = combineReducers({
        user: User.reducer,
        router: connectRouter(history),
        stocks: Stock.reducer,
        toast: Toast.reducer,
        triggers: Trigger.reducer,
        portfolio: Portfolio.reducer
    });

    return combinedReducer;
}
