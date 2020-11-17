import React from "react";
import { UpdateToast } from "./reducer";

export const createToast = (header: string, body: string): UpdateToast => {
    return {
        type: "UPDATE_TOAST",
        payload: {
            show: true,
            header: <>
                <strong className="mr-auto"> {header} </strong>
            </>,
            body: <>{body}</>
        }
    }
}