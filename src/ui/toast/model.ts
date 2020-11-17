import { ReactElement } from "react";

export interface ToastState {
    animation?: boolean;
    autohide?: boolean;
    delay?: number;
    minHeight?: string;
    top?: string;
    right?: string;
    header: ReactElement | null;
    body: ReactElement | null;
    show: boolean;
}