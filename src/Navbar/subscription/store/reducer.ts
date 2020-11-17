import { AnyAction } from "redux"
import { ItemRequestState } from "../../../global/model/state";
import { Response } from "../../../global/model/response";
import { getResourceInitialState } from "../../../global/store/request";
import { addReducers, combineSimplyfiedReducers, handleUndefinedState } from "../../../global/store/reducer";


export interface State {
    add: ItemRequestState<Response>;
}

export const initialState: State = {
    add: getResourceInitialState(null)
};

export const reducer = handleUndefinedState(
    addReducers([
        combineSimplyfiedReducers<State, AnyAction>({
            // @ts-ignore
            add: STOCK_ADD_RESOURCE.reducer,
        })
    ]),
    initialState
);