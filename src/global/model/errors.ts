import { isRequestError, RequestError } from "../request";
import { OptionalInterpreter } from "./interpreter";
/**
 * A type for JS error exception object.
 *
 * TODO: make proper typing
 */
type Error = any;

export interface Errors {
    errors: string[]
}

/**
 * Check if this is errors object.
 * This just checks for errors property, and not its format. The data format is expected to be either some payload,
 * or errors. This recognises between these two.
 *
 * @param data
 */
export function isError<T>(data: T | Errors): data is Errors {
    return typeof (data) === 'object' && !(data) && !((data as unknown as Errors).errors);
}

export const makeRequestErrorDetector = <T = any>(
    statusCode: number,
    additionalCondition?: (e: RequestError<T>) => boolean
) => (
    e: any
): boolean => {
        if (e.status !== statusCode) {
            return false;
        }
        return !(additionalCondition) || additionalCondition(e);
    };

/**
 * This makes Interpreter for an HTTP request error which checks with `detector` if the `error` matches the model one.
 * If it does, then it generates a user readable message using status text and the error strings returned from backend,
 * if not returns undefined.
 * @param detector
 * @param errorMessage
 */
export const makeErrorInterpreter: (
    detector: (error: Error) => boolean,
    errorMessage: Errors
) => OptionalInterpreter<Error, Errors> = (
    detector: (e: any) => boolean,
    errorMessage: Errors
) => (error: Error): Errors | undefined => {
    if (detector(error)) {
        const serverErrors: string[] = error.data && error.data.errors ? error.data.errors : [];
        if (serverErrors.length > 0)
            return { errors: serverErrors }
        return { errors: [...errorMessage.errors, ...serverErrors] };
    }
    return undefined;
};

/**
 * Generic Interpreter for an HTTP request error which checks for errors in Response
 * If found, then it generates a user readable message, with status text of HTTP error code
 * and error messages received from backend otherwise it returns undefined
 */
export function genericErrorInterpreter(error: any): Errors | undefined {
    if (isRequestError(error)) {
        const serverErrors = error.data && error.data.errors ? error.data.errors : [];
        return { errors: [error.statusText, ...serverErrors] };
    }
    return undefined;
};

/**
 * This makes Interpreter for an HTTP request error which checks with `detector` if the `error` matches the model one.
 * If it does, then it generates a user readable message, if not returns undefined. The difference from
 * makeErrorInterpreter is that getErrorMessage can use data from the error object.
 * @param detector
 * @param getErrorMessage - a function which generates error message out of error object
 */
export const makeErrorFunctionInterpreter: <Output>(
    detector: (error: Error) => boolean,
    getErrorMessage: (error: any) => Output
) => OptionalInterpreter<Error, Output> = <Output>(
    detector: (e: any) => boolean,
    getErrorMessage: (error: any) => Output
) => (error: any): Output | undefined => {
    if (detector(error)) {
        return getErrorMessage(error);
    }
    return undefined;
};

export const isNotFoundError = makeRequestErrorDetector(404);
export const notFoundErrorInterpreter = makeErrorInterpreter(isNotFoundError, { errors: ["Not found"] });
export const internalServerError = makeErrorInterpreter(makeRequestErrorDetector(500), { errors: ["Internal server error"] });

export const isAuthenticationErrorWithRedirect = makeRequestErrorDetector(401, (e: RequestError<any>) => {
    return (e.data) && e.data.errors.includes('Not authenticated');
});
