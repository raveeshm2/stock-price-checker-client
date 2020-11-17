import React, { useEffect } from 'react'
import { Formik, Form as FormikForm } from 'formik';
import { Button, Modal, Form } from 'react-bootstrap';
import { InputField } from '../../forms/InputField';
import { SelectField } from '../../forms/SelectField';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "../../root/store/reducer";
import { ItemRequestState } from '../../global/model/state';
import { ButtonSpinner } from '../../ui/ButtonSpinner';
import { AddTriggerValidationSchema } from "../../utils/validation";
import { Response } from "../../global/model/response";
import { AddTriggerModel } from '../../triggers/models/trigger';
import { ADD_TRIGGER_RESOURCE } from '../../triggers/store/saga';
interface AddTriggerModalProps {
    show: boolean,
    onHide: () => void,
    name: string,
    symbol: string
}

type AddTriggerFormModal = Pick<AddTriggerModel, "price" | "type">


export const AddTriggerModal: React.FC<AddTriggerModalProps> = ({ show, onHide, name, symbol }) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.triggers.add)

    async function onSubmit(trigger: AddTriggerFormModal) {
        dispatch(ADD_TRIGGER_RESOURCE.request({
            ...trigger,
            price: parseFloat(trigger.price.toString().trim()),
            symbol
        }));
    }

    useEffect(() => {
        return () => {
            dispatch(ADD_TRIGGER_RESOURCE.clear())
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
            <Formik<AddTriggerFormModal>
                initialValues={{
                    type: 'gte',
                    price: 0
                }}
                onSubmit={(trigger) => onSubmit(trigger)}
                validationSchema={AddTriggerValidationSchema}
            >{({ dirty, isValid }) =>
                <FormikForm>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Price Alert
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <h5 className='mb-4'>{name}</h5>

                        <Form.Group controlId="type">
                            <Form.Label>Select Type</Form.Label>
                            <SelectField options={[{ key: 'lte', value: 'Less Than equal to' }, { key: 'gte', value: 'Greater than equal to' }]} name="type" type="select" placeholder="Select Trigger Type" />
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Cut Off Price</Form.Label>
                            <InputField name="price" type="text" placeholder="Enter Cut Off Price" autoComplete="off" />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonSpinner
                            type='submit'
                            loading={response.loading}
                            disabled={response.loading || !isValid || !dirty}
                            loadingText="Loading..."
                            staticText="Add Trigger"
                        />
                        <Button variant="secondary" onClick={onHide}>Close</Button>
                    </Modal.Footer>
                </FormikForm>}
            </Formik>
        </Modal>
    );
}