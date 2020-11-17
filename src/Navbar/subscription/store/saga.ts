import { call, put } from "redux-saga/effects";
import { push } from "connected-react-router";
import { Resource } from "../../../global/store/request";
import { SubscriptionPayload } from "../models/subscription";
import { Response } from "../../../global/model/response";
import { ItemRequestState } from "../../../global/model/state";
import { SagaBase } from "../../../global/store/saga-base";
import { Requests } from "../../../global/requests";
import { createToast } from "../../../ui/toast/action";
import { showNotification } from "../../../utils/notifications";

export const SUBSCRIPTION_ADD_RESOURCE = new Resource<SubscriptionPayload, Response, ItemRequestState<Response>>('/SUBSCRIPTION/ADD');

export class SubscriptionSaga extends SagaBase {

    assignment: {
        [actionType: string]: (action: any) => IterableIterator<any>
    } = {
            [SUBSCRIPTION_ADD_RESOURCE.requestActionType]: this.addSubscription
        };

    /**
     * Sends Subscription add request
     * @param action 
     */
    *addSubscription(action: ReturnType<typeof SUBSCRIPTION_ADD_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.post, {
                url: '/subscription/add',
                payload: action.payload
            }))! as Response;
            yield put(SUBSCRIPTION_ADD_RESOURCE.response(response));
            const body = response.message.join('');
            showNotification(body);
            //yield put(createToast("Success", ));
        } catch (err) {
            yield put(SUBSCRIPTION_ADD_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }
}