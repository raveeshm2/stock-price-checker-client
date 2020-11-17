import { put, takeEvery } from "redux-saga/effects";
import { RequestFailedAction } from "./actions";

export abstract class SagaBase {

    abstract assignment: {
        [key: string]: (action: any) => IterableIterator<any>
    };

    /**
     * Returns an action handler with errors catching
     * @param key
     */
    getHandler(key: string) {
        function* handler(this: SagaBase, key: string, action: any): IterableIterator<any> {
            try {
                yield this.assignment[key](action);
            } catch (e) {
                alert(`${key}: ${e.message}`);
                yield put({ type: "REQUEST_FAILED", message: e.message } as RequestFailedAction);
                console.error(e);
            }
        }
        return handler.bind(this, key);
    }

    /**
     * Distributes actions among the assignment handlers
     */
    *rootSaga(): IterableIterator<any> {
        for (let key of Object.keys(this.assignment)) {
            yield takeEvery(key, this.getHandler(key));
        }
    }
}
