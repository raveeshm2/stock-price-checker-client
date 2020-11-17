
import React from "react";

export interface Global {
    interval: NodeJS.Timeout | null
}

export interface InitialState {
    global: Global
}

export interface UpdateIntervalKey {
    type: 'UPDATE_INTERVAL_KEY',
    payload: Global
}

export type Action = UpdateIntervalKey;

export interface GlobalState extends InitialState {
    dispatch?: React.Dispatch<Action>
}

export const initialState: InitialState = {
    global: {
        interval: null
    }
}

export function reducer(state = initialState, action: Action): InitialState {
    switch (action.type) {
        case 'UPDATE_INTERVAL_KEY':
            return {
                ...state,
                global: { ...state.global, ...action.payload }
            }
        default:
            return initialState;
    }
}

export const GlobalContext = React.createContext<GlobalState>(initialState);