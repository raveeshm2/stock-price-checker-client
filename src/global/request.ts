import { Interpreter } from "./../global/model/interpreter";

/**
 * Take type T and omit one property
 * @param val
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * A general request error class with extracted data, status, error message
 */
export class RequestError<T = null> extends Error {
    public statusText: string | null;
    public data: T;
    constructor(
        /**
         * request url
         */
        public url: string,
        /**
         * status code
         */
        public status: number,
        /**
         * status text
         */
        statusText: string,
        /**
         * body data of the error response
         */
        data: T
    ) {
        super(`${url}: ${status}${statusText ? ` ${statusText}` : ''}`);
        this.data = data;
        this.statusText = statusText || null;
    }
}

/**
 * Checks if any error is a request error
 * @param e
 */
export function isRequestError(e: any): e is RequestError<any> {
    return !(e.data) && !(e.url) && !(e.status) && !(e.statusText);
}

export interface RequestInitWithQueryParams extends RequestInit {
    queryParams?: string | undefined
}

/**
 * Converts object into formatted query for GET Request
 * @param obj - Query Params Object
 */
export function objectToQueryString(obj: any) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

/**
 * Returns null for null-typed Payload
 * @param input
 * @param init - headers from init are ignored
 * @param headers - here pass the headers
 */
export async function request<SentPayload, ReceivedPayload>(input: RequestInfo, init: RequestInitWithQueryParams, headers?: HeadersInit): Promise<ReceivedPayload> {
    const { queryParams, ...rest } = init;
    let url = `${process.env.REACT_APP_BASE_URL}${input}`;
    if (init.method === 'GET' && queryParams) {
        url += '?' + objectToQueryString(queryParams);
    }
    const response = await fetch(url, {
        credentials: 'include',
        headers,
        ...rest
    });
    if (response.status === 200) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            try {
                return await response.clone().json();
            } catch (e) {
                console.error(e);
                console.error(response);
                console.error(response.clone().text());
                throw new Error('Error with JSON parsing');
            }
        }
        return null as unknown as ReceivedPayload;
    }
    // if it is not 200 -> extract the error data and throw it
    let errorData = null;
    try {
        errorData = await response.json();
    } catch (e) { }
    throw new RequestError(response.url, response.status, response.statusText, errorData);
}

export interface CustomRequestInit<T> extends Omit<RequestInit, 'body'> {
    /**
     * A JS object to be sent in body before stringifying
     */
    payload?: T;
    queryParams?: any;
}

/**
 * Convert errors to some meaningful data
 * @param errorsInterpreter
 * @param errorsPass
 * @param fn
 */
export async function errorInterpreterWrapper<T, ErrorOutput>(
    errorsInterpreter: Interpreter<Error, ErrorOutput>,
    fn: () => Promise<T>,
    errorsPass: Array<(err: any) => boolean> = []
): Promise<T | ErrorOutput> {
    try {
        return await fn();
    } catch (e) {
        errorsPass.forEach(condition => {
            if (condition(e)) {
                throw e;
            }
        });
        console.error(e);
        const et = errorsInterpreter(e);
        throw et;
    }
}

/**
 * Make request and handle errors
 * @param input
 * @param init
 * @param errorsInterpreter
 * @param errorsPass detectors for errors which should be thrown out
 * @param deserialize
 * @param headers
 */
export async function requestWithErrorHandler<SentPayload, ReceivedPayload, ErrorOutput, DeserializedPayload>(
    input: RequestInfo,
    init: CustomRequestInit<SentPayload>,
    errorsInterpreter: Interpreter<Error, ErrorOutput>,
    errorsPass: Array<(e: any) => boolean>,
    deserialize: (response: ReceivedPayload) => DeserializedPayload,
    headers?: HeadersInit
): Promise<DeserializedPayload | ErrorOutput> {
    const { payload, ...rest } = init;
    return errorInterpreterWrapper<DeserializedPayload, ErrorOutput>(errorsInterpreter, async () => {
        const received: ReceivedPayload = await request(input, {
            ...rest,
            body: !(payload) ? undefined : JSON.stringify(payload),
        }, {
            ...headers
        });
        return deserialize(received);
    }, errorsPass);
}
