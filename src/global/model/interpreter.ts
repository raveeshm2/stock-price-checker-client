/**
 * A function which takes an item and may convert it to string readable for a user or return undefined if impossible.
 */
export type OptionalInterpreter<T, Output> = (value: T) => Output | undefined;

export type Interpreter<T, Output> = (value: T) => Output;

/**
 * Takes an array of interpreters and return first interpreted value
 * @param interpreters
 * @param defaultValue information about unknown error
 */
export const composeInterpreters = <T, Output>(
    interpreters: Array<OptionalInterpreter<T, Output>>,
    defaultValue: Output
): Interpreter<T, Output> => (
    value: T
): Output => {
        for (let interpreter of interpreters) {
            const result = interpreter(value);
            if (result) {
                return result;
            }
        }
        return defaultValue;
    };
