import { AnyAction } from "redux"
import { Response } from "../../global/model/response";
import { ItemRequestState } from "../../global/model/state";
import { addReducers, combineSimplyfiedReducers, handleUndefinedState } from "../../global/store/reducer";
import { getResourceInitialState } from "../../global/store/request";
import { HoldingListResponsePayload } from "../models/holding";
import { HOLDING_ADD_RESOURCE, HOLDING_DELETE_RESOURCE, HOLDING_LIST_RESOURCE } from "./saga";


export interface State {
    add: ItemRequestState<Response>;
    delete: ItemRequestState<Response>;
    list: ItemRequestState<HoldingListResponsePayload>;
}

export const initialState: State = {
    add: getResourceInitialState(null),
    delete: getResourceInitialState(null),
    list: getResourceInitialState(null)
};

export const reducer = handleUndefinedState(
    addReducers([
        combineSimplyfiedReducers<State, AnyAction>({
            // @ts-ignore
            add: HOLDING_ADD_RESOURCE.reducer,
            // @ts-ignore
            delete: HOLDING_DELETE_RESOURCE.reducer,
            // @ts-ignore
            list: HOLDING_LIST_RESOURCE.reducer
        })
    ]),
    initialState
);