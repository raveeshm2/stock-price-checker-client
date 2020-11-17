import React from 'react'
import { Toast as BootstrapToast } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { State } from "../../root/store/reducer";
import { ToastState } from './model';
import { initialState } from "./reducer";

interface toastProps { }

export const Toast: React.FC<toastProps> = () => {
    const data = useSelector<State, ToastState>(state => state.toast);
    const dispatch = useDispatch();
    return (
        <BootstrapToast
            style={{
                position: 'fixed',
                top: data.top,
                right: data.right,
                zIndex: 10
            }}
            show={data.show}
            autohide={data.autohide}
            onClose={() => dispatch({
                type: 'UPDATE_TOAST',
                payload: initialState
            })}
            delay={data.delay}
        >
            <BootstrapToast.Header>
                {data.header}
            </BootstrapToast.Header>
            <BootstrapToast.Body>{data.body}</BootstrapToast.Body>
        </BootstrapToast>
    );
}