import { ToastState } from './model';

export interface UpdateToast {
    type: 'UPDATE_TOAST',
    payload: ToastState
}

export const initialState = {
    show: false,
    header: null,
    body: null,
    autohide: true,
    minHeight: '100px',
    top: '5rem',
    right: '5rem',
    delay: 5000
}

export const reducer = (state: ToastState = initialState, action: UpdateToast): ToastState => {
    switch (action.type) {
        case "UPDATE_TOAST":
            return { ...state, ...action.payload }
        default:
            return state;
    }
}