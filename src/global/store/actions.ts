/**
 * General action when a request got failed
 */
export interface RequestFailedAction {
    type: 'REQUEST_FAILED';
    message: string;
}
