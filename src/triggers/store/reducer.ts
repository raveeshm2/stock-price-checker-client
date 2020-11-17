import { AnyAction } from "redux"
import { Response } from "../../global/model/response";
import { ItemRequestState } from "../../global/model/state";
import { addReducers, combineSimplyfiedReducers, handleUndefinedState } from "../../global/store/reducer";
import { getResourceInitialState } from "../../global/store/request";
import { TriggerResponsePayload } from "../models/trigger";
import { ADD_TRIGGER_RESOURCE, DELETE_TRIGGER_RESOURCE, GET_TRIGGER_RESOURCE, UPDATE_TRIGGER_RESOURCE } from "./saga";


export interface State {
    list: ItemRequestState<TriggerResponsePayload[]>;
    add: ItemRequestState<Response>;
    update: ItemRequestState<Response>;
    delete: ItemRequestState<Response>;
}

export const initialState: State = {
    list: getResourceInitialState(null),
    add: getResourceInitialState(null),
    update: getResourceInitialState(null),
    delete: getResourceInitialState(null),
};

export const reducer = handleUndefinedState(
    addReducers([
        combineSimplyfiedReducers<State, AnyAction>({
            // @ts-ignore
            list: GET_TRIGGER_RESOURCE.reducer,
            // @ts-ignore
            add: ADD_TRIGGER_RESOURCE.reducer,
            // @ts-ignore
            update: UPDATE_TRIGGER_RESOURCE.reducer,
            // @ts-ignore
            delete: DELETE_TRIGGER_RESOURCE.reducer,
        })
    ]),
    initialState
);