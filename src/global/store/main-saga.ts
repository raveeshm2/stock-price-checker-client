import { SagaBase } from "./saga-base";
import { all } from "redux-saga/effects"
/**
 * Redistributes actions to all the sagas
 */
export class MainSaga {

    // eslint-disable-next-line
    constructor(
        /**
         * All the sagas which are used at redux
         */
        protected sagas: SagaBase[]
    ) { }

    /**
     * This should be passed as the main function of Saga middleware
     */
    *rootSaga(): IterableIterator<any> {
        yield all(this.sagas.map(saga => saga.rootSaga()));
    }
}
