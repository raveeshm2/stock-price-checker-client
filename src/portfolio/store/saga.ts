import { call, put } from "redux-saga/effects";
import { push } from "connected-react-router";
import { Resource } from "../../global/store/request";
import { ItemRequestState } from "../../global/model/state";
import { SagaBase } from "../../global/store/saga-base";
import { Requests } from "../../global/requests";
import { createToast } from "../../ui/toast/action";
import { Response } from "../../global/model/response";
import { AddHolding, DeleteHolding, HoldingListResponsePayload } from "../models/holding";

export const HOLDING_ADD_RESOURCE = new Resource<AddHolding, Response, ItemRequestState<Response>>('/HOLDING/ADD');
export const HOLDING_DELETE_RESOURCE = new Resource<DeleteHolding, Response, ItemRequestState<Response>>('/HOLDING/DELETE');
export const HOLDING_LIST_RESOURCE = new Resource<null, HoldingListResponsePayload, ItemRequestState<HoldingListResponsePayload>>('/HOLDING/LIST');

export class PortfolioSaga extends SagaBase {

    assignment: {
        [actionType: string]: (action: any) => IterableIterator<any>
    } = {
            [HOLDING_ADD_RESOURCE.requestActionType]: this.addHolding,
            [HOLDING_DELETE_RESOURCE.requestActionType]: this.deleteHolding,
            [HOLDING_LIST_RESOURCE.requestActionType]: this.list,
        };

    /**
     * Sends holding add request
     * @param action 
     */
    *addHolding(action: ReturnType<typeof HOLDING_ADD_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.post, {
                url: '/holding/add',
                payload: action.payload
            }))! as Response;
            yield put(HOLDING_ADD_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
        } catch (err) {
            yield put(HOLDING_ADD_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }


    /**
     * Sends Stock delete request
     * @param action 
     */
    *deleteHolding(action: ReturnType<typeof HOLDING_DELETE_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.post, {
                url: '/holding/delete',
                payload: action.payload
            }))! as Response;
            yield put(HOLDING_DELETE_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
        } catch (err) {
            yield put(HOLDING_DELETE_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }

    /**
     * Sends Stock list request
     * @param action 
     */
    *list(action: ReturnType<typeof HOLDING_LIST_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.get, {
                url: '/holding/list'
            }))! as HoldingListResponsePayload;
            yield put(HOLDING_LIST_RESOURCE.response(response));
        } catch (err) {
            yield put(HOLDING_LIST_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }
}