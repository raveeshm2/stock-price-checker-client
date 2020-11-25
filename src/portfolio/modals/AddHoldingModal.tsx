import React, { useEffect } from 'react'
import { Formik, Form as FormikForm } from 'formik';
import { Button, Modal, Form } from 'react-bootstrap';
import { InputField } from '../../forms/InputField';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "../../root/store/reducer";
import { ItemRequestState } from '../../global/model/state';
import { ButtonSpinner } from '../../ui/ButtonSpinner';
import { AddHoldingValidationSchema } from "../../utils/validation";
import { Response } from "../../global/model/response";
import { HOLDING_ADD_RESOURCE } from '../store/saga';

interface AddHoldingModalProps {
    show: boolean,
    onHide: () => void,
    name: string,
    symbol: string
}

interface AddHoldingFormModal {
    price: number;
    quantity: number;
}


export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({ show, onHide, name, symbol }) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.portfolio.add)

    async function onSubmit(holding: AddHoldingFormModal) {
        dispatch(HOLDING_ADD_RESOURCE.request({
            ...holding,
            quantity: parseInt(holding.quantity.toString()),
            price: parseFloat(holding.price.toString().trim()),
            symbol
        }));
    }

    useEffect(() => {
        return () => {
            dispatch(HOLDING_ADD_RESOURCE.clear())
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
            <Formik<AddHoldingFormModal>
                initialValues={{
                    quantity: 0,
                    price: 0
                }}
                onSubmit={(holding) => onSubmit(holding)}
                validationSchema={AddHoldingValidationSchema}
            >{({ dirty, isValid }) =>
                <FormikForm>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Stock Holding
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <h5 className='mb-4'>{name}</h5>

                        <Form.Group controlId="quantity">
                            <Form.Label>Quantity</Form.Label>
                            <InputField name="quantity" type="number" placeholder="Enter Stock Quantity" autoComplete="off" />
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <InputField name="price" type="number" placeholder="Enter Price" autoComplete="off" />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonSpinner
                            type='submit'
                            loading={response.loading}
                            disabled={response.loading || !isValid || !dirty}
                            loadingText="Loading..."
                            staticText="Add Stock"
                        />
                        <Button variant="secondary" onClick={onHide}>Close</Button>
                    </Modal.Footer>
                </FormikForm>}
            </Formik>
        </Modal>
    );
}