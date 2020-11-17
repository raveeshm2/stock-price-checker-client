import { call, put } from "redux-saga/effects";
import { push } from "connected-react-router";
import { Resource } from "../../global/store/request";
import { StockSearchPayload, StockInput, StockListResponsePayload, StockDeletePayload } from "../models/stock";
import { ItemRequestState } from "../../global/model/state";
import { SagaBase } from "../../global/store/saga-base";
import { Requests } from "../../global/requests";
import { createToast } from "../../ui/toast/action";
import { Response } from "../../global/model/response";
import { history } from "../../index";

export const STOCK_SEARCH_RESOURCE = new Resource<StockInput, StockSearchPayload[], ItemRequestState<StockSearchPayload[]>>('/STOCK/SEARCH');
export const STOCK_ADD_RESOURCE = new Resource<StockSearchPayload, Response, ItemRequestState<Response>>('/STOCK/ADD');
export const STOCK_DELETE_RESOURCE = new Resource<StockDeletePayload, Response, ItemRequestState<Response>>('/STOCK/DELETE');
export const STOCK_LIST_RESOURCE = new Resource<null, StockListResponsePayload, ItemRequestState<StockListResponsePayload>>('/STOCK/LIST');

export class StocksSaga extends SagaBase {

    assignment: {
        [actionType: string]: (action: any) => IterableIterator<any>
    } = {
            [STOCK_SEARCH_RESOURCE.requestActionType]: this.searchStock,
            [STOCK_ADD_RESOURCE.requestActionType]: this.addStock,
            [STOCK_DELETE_RESOURCE.requestActionType]: this.deleteStock,
            [STOCK_LIST_RESOURCE.requestActionType]: this.list,
        };

    /**
     * Sends scraping request
     * @param action 
     */
    *searchStock(action: ReturnType<typeof STOCK_SEARCH_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.get, {
                url: '/stock/search',
                payload: action.payload
            }))! as StockSearchPayload[];
            yield put(STOCK_SEARCH_RESOURCE.response(response));
        } catch (err) {
            yield put(STOCK_SEARCH_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }

    /**
     * Sends Stock add request
     * @param action 
     */
    *addStock(action: ReturnType<typeof STOCK_ADD_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.post, {
                url: '/stock/add',
                payload: action.payload
            }))! as Response;
            yield put(STOCK_ADD_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            yield put(STOCK_ADD_RESOURCE.error(err));
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
    *deleteStock(action: ReturnType<typeof STOCK_DELETE_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.post, {
                url: '/stock/delete',
                payload: action.payload
            }))! as Response;
            yield put(STOCK_DELETE_RESOURCE.response(response));
            yield put(createToast("Success", response.message.join('')));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            yield put(STOCK_DELETE_RESOURCE.error(err));
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
    *list(action: ReturnType<typeof STOCK_LIST_RESOURCE.request>): IterableIterator<any> {
        try {
            const response = (yield call(Requests.get, {
                url: '/stock/list'
            }))! as StockListResponsePayload;
            yield put(STOCK_LIST_RESOURCE.response(response));
            const url = history.location.pathname;
            // Redirect to Stock List page when already logged in and are trying to open login page
            if (url === '/')
                yield put(push('/stockList'));
        } catch (err) {
            yield put(STOCK_LIST_RESOURCE.error(err));
            if (err.errors.includes("User is not authenticated")) {
                yield put(push('/')); // Redirect to login page
            }
            yield put(createToast("Error", err.errors.join('. ')));
        }
    }
}