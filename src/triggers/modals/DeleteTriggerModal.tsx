import React, { useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { ItemRequestState } from '../../global/model/state';
import { useDispatch } from 'react-redux';
import { DELETE_TRIGGER_ALL_RESOURCE, DELETE_TRIGGER_RESOURCE } from '../store/saga';
import { Response } from "../../global/model/response";
import { DeleteAllTriggerModel, DeleteTriggerModel } from '../models/trigger';

interface DeleteTriggerModalProps {
    show: boolean,
    onHide: () => void,
    symbol?: string,
    text: string,
    type: 'single' | 'multiple',
    payload: DeleteTriggerModel | DeleteAllTriggerModel,
    response: ItemRequestState<Response>
}

export const DeleteTriggerModal: React.FC<DeleteTriggerModalProps> = ({ symbol, show, onHide, text, type, payload, response }) => {

    const dispatch = useDispatch();

    async function onSubmit() {
        if (type === 'single' && "id" in payload) {
            dispatch(DELETE_TRIGGER_RESOURCE.request({
                ...payload
            }));
        } else {
            if ("onlyTriggered" in payload) {
                dispatch(DELETE_TRIGGER_ALL_RESOURCE.request({
                    ...payload
                }));
            }
        }
    }

    useEffect(() => {
        return () => {
            if (type === 'single')
                dispatch(DELETE_TRIGGER_RESOURCE.clear());
            else
                dispatch(DELETE_TRIGGER_ALL_RESOURCE.clear());
        }
    }, [dispatch, type]);

    useEffect(() => {
        if (!response.loading && (response.data || response.error)) {
            onHide();
        }
    }, [response, onHide]);

    return (

        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {symbol || "Delete Alerts"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>{text}</h5>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" type="submit" disabled={response.loading} onClick={onSubmit}>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className={response.loading ? 'd-inline-block' : 'd-none'}
                    />
                    <span className={response.loading ? 'ml-3 d-inline-block' : 'd-none'}>Loading...</span>
                    <span className={!response.loading ? 'd-inline-block' : 'd-none'}>Yes, I confirm</span>
                </Button>
                <Button variant="primary" onClick={onHide}>No</Button>
            </Modal.Footer>

        </Modal>

    );
}