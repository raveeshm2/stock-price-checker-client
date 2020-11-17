import { AnyAction } from "redux"
import { Response } from "../../global/model/response";
import { ItemRequestState } from "../../global/model/state";
import { addReducers, combineSimplyfiedReducers, handleUndefinedState } from "../../global/store/reducer";
import { getResourceInitialState } from "../../global/store/request";
import { StockListResponsePayload, StockSearchPayload } from "../models/stock";
import { STOCK_SEARCH_RESOURCE, STOCK_ADD_RESOURCE, STOCK_LIST_RESOURCE, STOCK_DELETE_RESOURCE } from "./saga";


export interface State {
    search: ItemRequestState<StockSearchPayload[]>;
    add: ItemRequestState<Response>;
    delete: ItemRequestState<Response>;
    list: ItemRequestState<StockListResponsePayload>;
}

export const initialState: State = {
    search: getResourceInitialState(null),
    add: getResourceInitialState(null),
    delete: getResourceInitialState(null),
    list: getResourceInitialState(null)
};

export const reducer = handleUndefinedState(
    addReducers([
        combineSimplyfiedReducers<State, AnyAction>({
            // @ts-ignore
            search: STOCK_SEARCH_RESOURCE.reducer,
            // @ts-ignore
            add: STOCK_ADD_RESOURCE.reducer,
            // @ts-ignore
            delete: STOCK_DELETE_RESOURCE.reducer,
            // @ts-ignore
            list: STOCK_LIST_RESOURCE.reducer
        })
    ]),
    initialState
);