import React, { useEffect } from 'react'
import { Formik, Form as FormikForm } from 'formik';
import { Button, Modal, Form } from 'react-bootstrap';
import { InputField } from '../../forms/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "../../root/store/reducer";
import { ItemRequestState } from '../../global/model/state';
import { ButtonSpinner } from '../../ui/ButtonSpinner';
import { DeleteHoldingValidationSchema } from "../../utils/validation";
import { Response } from "../../global/model/response";
import { HOLDING_DELETE_RESOURCE } from '../store/saga';

interface DeleteHoldingModalProps {
    show: boolean,
    onHide: () => void,
    name: string,
    symbol: string
}

interface DeleteHoldingFormModal {
    quantity: number;
}


export const DeleteHoldingModal: React.FC<DeleteHoldingModalProps> = ({ show, onHide, name, symbol }) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.portfolio.delete)

    async function onSubmit(holding: DeleteHoldingFormModal) {
        dispatch(HOLDING_DELETE_RESOURCE.request({
            quantity: parseInt(holding.quantity.toString()),
            symbol
        }));
    }

    useEffect(() => {
        return () => {
            dispatch(HOLDING_DELETE_RESOURCE.clear())
        }
    }, [dispatch])

    useEffect(() => {
        if (!response.loading && (response.data || response.error) && show) {
            onHide();
        }
    }, [response, show, onHide]);

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
        >
            <Formik<DeleteHoldingFormModal>
                initialValues={{
                    quantity: 0
                }}
                onSubmit={(holding) => onSubmit(holding)}
                validationSchema={DeleteHoldingValidationSchema}
            >{({ dirty, isValid }) =>
                <FormikForm>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Delete Stock Holding
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <h5 className='mb-4'>{name}</h5>

                        <Form.Group controlId="quantity">
                            <Form.Label>Quantity</Form.Label>
                            <InputField name="quantity" type="number" placeholder="Enter Stock Quantity" autoComplete="off" />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonSpinner
                            type='submit'
                            loading={response.loading}
                            disabled={response.loading || !isValid || !dirty}
                            loadingText="Loading..."
                            staticText="Delete Stock"
                        />
                        <Button variant="secondary" onClick={onHide}>Close</Button>
                    </Modal.Footer>
                </FormikForm>}
            </Formik>
        </Modal>
    );
}