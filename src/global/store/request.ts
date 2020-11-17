import { Errors } from "../model/errors";
import { RequestStateBase } from "../model/state";

export function getResourceInitialState<T>(val: RequestStateBase<T>['data']): RequestStateBase<T> {
    return {
        loading: false,
        error: null,
        data: val
    };
}

export class Resource<RequestPayload, ResponsePayload, State extends RequestStateBase<any>> {
    constructor(
        protected readonly type: string
    ) { }

    public readonly requestActionType = `${this.type}_REQUEST`;
    public readonly errorActionType = `${this.type}_ERROR`;
    public readonly responseActionType = `${this.type}_RESPONSE`;
    public readonly clearActionType = `${this.type}_CLEAR`;

    request = (payload: RequestPayload) => {
        return {
            type: this.requestActionType,
            payload
        }
    };

    response = (payload: ResponsePayload) => {
        return {
            type: this.responseActionType,
            payload
        }
    };

    error = (error: Errors, payload?: ResponsePayload) => {
        return {
            type: this.errorActionType,
            error,
            payload
        }
    };

    clear = () => {
        return {
            type: this.clearActionType
        }
    }

    reducer = (state: State, action: any): RequestStateBase<any> => {
        switch (action.type) {
            case this.requestActionType:
                return {
                    ...state,
                    loading: true
                };
            case this.responseActionType:
                return {
                    loading: false,
                    data: action.payload,
                    error: null
                };
            case this.errorActionType:
                return {
                    ...state,
                    loading: false,
                    error: [...action.error.errors],
                    data: action.payload ? action.payload : state.data
                };
            case this.clearActionType: {
                return { ...getResourceInitialState(null) }
            }
            default:
                return state;
        }
    }
}
