
import { CustomRequestInit, requestWithErrorHandler } from "./request";
import {
    Errors,
    internalServerError,
    notFoundErrorInterpreter,
    genericErrorInterpreter,
    isAuthenticationErrorWithRedirect
} from "../global/model/errors"
import { composeInterpreters } from "../global/model/interpreter";

export type RequestType = 'GET' | 'PUT' | 'POST' | 'DELETE';

export interface RequestProps<RequestPayload, ResponsePayload, DeserializedPayload> {
    url: string;
    deserialize?: (response: ResponsePayload) => DeserializedPayload;
    payload?: RequestPayload;
}

/**
 * A base for a saga which makes requests
 */
export class Requests {

    static readonly defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json'
    };

    static post<RequestPayload, ResponsePayload, DeserializedPayload>(
        props: RequestProps<RequestPayload, ResponsePayload, DeserializedPayload>
    ): Promise<DeserializedPayload | Errors> {
        return Requests.fetch<RequestPayload, ResponsePayload, DeserializedPayload>(props.url, {
            method: 'POST',
            payload: props.payload
        }, !(props.deserialize) ? (val => val as unknown as DeserializedPayload) : props.deserialize);
    };

    static put<RequestPayload, ResponsePayload, DeserializedPayload>(
        props: RequestProps<RequestPayload, ResponsePayload, DeserializedPayload>
    ): Promise<DeserializedPayload | Errors> {
        return Requests.fetch<RequestPayload, ResponsePayload, DeserializedPayload>(props.url, {
            method: 'PUT',
            payload: props.payload
        }, !(props.deserialize) ? (val => val as unknown as DeserializedPayload) : props.deserialize);
    };

    static get<RequestPayload, ResponsePayload, DeserializedPayload>(
        props: RequestProps<RequestPayload, ResponsePayload, DeserializedPayload>
    ): Promise<DeserializedPayload | Errors> {
        return Requests.fetch<RequestPayload, ResponsePayload, DeserializedPayload>(props.url, {
            method: 'GET',
            queryParams: props.payload
        }, !(props.deserialize) ? (val => val as unknown as DeserializedPayload) : props.deserialize);
    };

    static delete<RequestPayload>(
        props: RequestProps<RequestPayload, null, null>
    ): Promise<null | Errors> {
        return Requests.fetch<RequestPayload, null, null>(props.url, {
            method: 'DELETE',
            payload: props.payload
        }, val => val);
    };

    static readonly requests: { [key: string]: (props: RequestProps<any, any, any>) => Promise<any> } = {
        'GET': Requests.get,
        'POST': Requests.post,
        'PUT': Requests.put,
        'DELETE': Requests.delete,
    };

    static errorPass = [isAuthenticationErrorWithRedirect];
    static errorDetectors = [notFoundErrorInterpreter, internalServerError, genericErrorInterpreter];
    static errorsInterpreter = composeInterpreters(Requests.errorDetectors, { errors: ['Unknown error'] });

    static async fetch<SentPayload, ReceivedPayload, DeserializedPayload>(
        input: RequestInfo,
        init: CustomRequestInit<SentPayload>,
        deserialize: (response: ReceivedPayload) => DeserializedPayload,
        headers?: HeadersInit,
    ): Promise<DeserializedPayload | Errors> {
        return requestWithErrorHandler<SentPayload, ReceivedPayload, Errors, DeserializedPayload>(
            input,
            init,
            Requests.errorsInterpreter,
            Requests.errorPass,
            deserialize,
            {
                ...Requests.defaultHeaders,
                ...headers
            }
        );
    }
}
