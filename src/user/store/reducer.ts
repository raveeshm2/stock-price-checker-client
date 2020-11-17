import { CHANGE_PASSWORD_RESOURCE, LOGIN_RESOURCE, LOGOUT_RESOURCE, SIGNUP_RESOURCE } from "./saga";
import { ItemRequestState } from "../../global/model/state";
import { getResourceInitialState, } from "../../global/store/request";
import { handleUndefinedState, addReducers, combineSimplyfiedReducers } from "../../global/store/reducer";
import { AnyAction } from "redux"
import { Response } from "../../global/model/response";


export interface State {
    login: ItemRequestState<Response>;
    signup: ItemRequestState<Response>;
    changePassword: ItemRequestState<Response>;
    logout: ItemRequestState<Response>
}

export const initialState: State = {
    login: getResourceInitialState(null),
    signup: getResourceInitialState(null),
    changePassword: getResourceInitialState(null),
    logout: getResourceInitialState(null)
};

export const reducer = handleUndefinedState(
    addReducers([
        combineSimplyfiedReducers<State, AnyAction>({
            // @ts-ignore
            login: LOGIN_RESOURCE.reducer,
            // @ts-ignore
            signup: SIGNUP_RESOURCE.reducer,
            // @ts-ignore
            changePassword: CHANGE_PASSWORD_RESOURCE.reducer,
            // @ts-ignore
            logout: LOGOUT_RESOURCE.reducer,
        })
    ]),
    initialState
);