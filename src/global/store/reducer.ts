import { Action, AnyAction, Reducer } from "redux";

export type SimplifiedReducer<State, Action> = (state: State, action: Action) => State;
export type SimplifiedReducersMapObject<S> = { [key in keyof S]: SimplifiedReducer<S[key], any> };

/**
 * A wrapper to handle undefined state for a SimplifiedReducer, so that it matches standard redux's Reducer
 * @param reducer
 * @param initialState
 */
export function handleUndefinedState<State, Action extends AnyAction>(
    reducer: SimplifiedReducer<State, Action>,
    initialState: State
): Reducer<State, Action> {
    return (state: State | undefined, action: Action) => {
        if (!state) {
            return initialState;
        }
        return reducer(state, action);
    }
}


/**
 * This combines simplified reducers like the normal combine method to another simplified reducer
 * @param reducers
 */
export function combineSimplyfiedReducers<S, A extends Action<any>>(
    reducers: SimplifiedReducersMapObject<Partial<S>>
): SimplifiedReducer<S, A> {
    return (state: S, action: A) => ({
        ...state,
        ...Object.keys(reducers).reduce<{ [key: string]: any }>((acc, key: string) => {
            acc[key] = reducers[key as keyof S](state[key as keyof S], action);
            return acc;
        }, {}) as SimplifiedReducersMapObject<S>
    });
}

/**
 * Add reducers to make both operate on the same store key
 * @param reducers
 */
export function addReducers<S, A extends Action<any>>(reducers: SimplifiedReducer<S, A>[]): SimplifiedReducer<S, A> {
    return reducers.reduce((prev: SimplifiedReducer<S, A>, reducer: SimplifiedReducer<S, A>) => {
        return (state: S, action: A) => reducer(prev(state, action), action);
    }, (state: S, action: A) => state);
}
