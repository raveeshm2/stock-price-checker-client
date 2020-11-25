
import React from "react";

export interface Global {
    interval: NodeJS.Timeout | null,
    portfolioInterval: NodeJS.Timeout | null,
}

export interface InitialState {
    global: Global
}

export interface UpdateIntervalKey {
    type: 'UPDATE_INTERVAL_KEY',
    payload: { interval: NodeJS.Timeout | null }
}

export interface UpdatePortfolioIntervalKey {
    type: 'UPDATE_PORTFOLIO_INTERVAL_KEY',
    payload: { portfolioInterval: NodeJS.Timeout | null }
}

export type Action = UpdateIntervalKey | UpdatePortfolioIntervalKey;

export interface GlobalState extends InitialState {
    dispatch?: React.Dispatch<Action>
}

export const initialState: InitialState = {
    global: {
        interval: null,
        portfolioInterval: null
    }
}

export function reducer(state = initialState, action: Action): InitialState {
    switch (action.type) {
        case 'UPDATE_INTERVAL_KEY':
            return {
                ...state,
                global: { ...state.global, ...action.payload }
            }
        case 'UPDATE_PORTFOLIO_INTERVAL_KEY':
            return {
                ...state,
                global: {
                    ...state.global,
                    ...action.payload
                }
            }
        default:
            return initialState;
    }
}

export const GlobalContext = React.createContext<GlobalState>(initialState);