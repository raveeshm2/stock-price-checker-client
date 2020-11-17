import { call, put } from "redux-saga/effects";
import { push } from "connected-react-router";
import { Resource } from "../../global/store/request";
import { ItemRequestState } from "../../global/model/state";
import { SagaBase } from "../../global/store/saga-base";
import { Requests } from "../../global/requests";
import { createToast } from "../../ui/toast/action";
import { Response } from "../../global/model/response";
import { AddTriggerModel, DeleteTriggerModel, UpdateTriggerModel, TriggerResponsePayload } from "../models/trigger";

export const GET_TRIGGER_RESOURCE = new Resource<null, TriggerResponsePayload[], ItemRequestState<TriggerResponsePayload[]>>('/TRIGGER/LIST');
export const ADD_TRIGGER_RESOURCE = new Resource<AddTriggerModel, Response, ItemRequestState<Response>>('/TRIGGER/ADD');
export const UPDATE_TRIGGER_RESOURCE = new Resource<UpdateTriggerModel, Response, ItemRequestState<Response>>('/TRIGGER/UPDATE');
export const DELETE_TRIGGER_RESOURCE = new Resource<DeleteTriggerModel, Response, ItemRequestState<Response>>('/TRIGGER/DELETE');

export class TriggersSaga extends SagaBase {

    assignment: {
        [actionType: string]: (action: any) => IterableIterator<any>
    } = {
            [GET_TRIGGER_RESOURCE.requestActionType]: this.getTriggers,
            [ADD_TRIGGER_RESOURCE.requestActionType]: this.addTrigger,
            [UPDATE_TRIGGER_RESOURCE.requestActionType]: this.updateTrigger,
            [DELETE_TRIGGER_RESOURCE.requestActionType]: this.deleteTrigger
        };


    /**
     * Gets all triggers for the current user
     * @param action 
     */
    *getTriggers(action: ReturnType<typeof GET_TRIGGER_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.get, {
                url: '/trigger/list'
            }))! as TriggerResponsePayload[];
            yield put(GET_TRIGGER_RESOURCE.response(response));
        } catch (err) {
            yield put(GET_TRIGGER_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }


    /**
     * Sends Add Trigger Request
     * @param action 
     */
    *addTrigger(action: ReturnType<typeof ADD_TRIGGER_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.post, {
                url: '/trigger/add',
                payload: action.payload
            }))! as Response;
            yield put(ADD_TRIGGER_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
        } catch (err) {
            yield put(ADD_TRIGGER_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }

    /**
     * Sends Update Trigger Request
     * @param action 
     */
    *updateTrigger(action: ReturnType<typeof UPDATE_TRIGGER_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.put, {
                url: '/trigger/update',
                payload: action.payload
            }))! as Response;
            yield put(UPDATE_TRIGGER_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            yield put(UPDATE_TRIGGER_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }

    /**
     * Sends Delete Trigger Request
     * @param action 
     */
    *deleteTrigger(action: ReturnType<typeof DELETE_TRIGGER_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.delete, {
                url: '/trigger/delete',
                payload: action.payload
            }))! as Response;
            yield put(DELETE_TRIGGER_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            yield put(DELETE_TRIGGER_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }
}