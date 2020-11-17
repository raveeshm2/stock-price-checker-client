import React, { useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { State } from "../../root/store/reducer";
import { ItemRequestState } from '../../global/model/state';
import { useDispatch, useSelector } from 'react-redux';
import { STOCK_DELETE_RESOURCE } from '../store/saga';
import { Response } from "../../global/model/response";

interface DeleteStockModalProps {
    show: boolean,
    onHide: () => void,
    name: string,
    symbol: string
}

export const DeleteStockModal: React.FC<DeleteStockModalProps> = ({ name, symbol, show, onHide }) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.stocks.delete);

    async function onSubmit() {
        dispatch(STOCK_DELETE_RESOURCE.request({
            symbol
        }));
    }

    useEffect(() => {
        return () => {
            dispatch(STOCK_DELETE_RESOURCE.clear())
        }
    }, [dispatch]);

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
                    {name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Are you sure, you want to remove this stock from watchlist ?</h5>
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