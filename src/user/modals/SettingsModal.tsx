import React, { useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "../../root/store/reducer";
import { Response } from "../../global/model/response";
import { ItemRequestState } from '../../global/model/state';
import { CHANGE_PASSWORD_RESOURCE } from '../store/saga';
import { SettingsValidationSchema } from '../../utils/validation';
import { InputField } from '../../forms/InputField';
import { ButtonSpinner } from '../../ui/ButtonSpinner';


interface SettingsModalProps {
    show: boolean,
    onHide: () => void,
}

interface SettingsFormModal {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ show, onHide }) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.user.changePassword);

    async function onSubmit(user: Pick<SettingsFormModal, "currentPassword" | "newPassword">) {
        dispatch(CHANGE_PASSWORD_RESOURCE.request(user));
    }

    useEffect(() => {
        return () => {
            dispatch(CHANGE_PASSWORD_RESOURCE.clear())
        }
    }, [dispatch]);

    useEffect(() => {
        if (!response.loading && (response.data || response.error) && show) {
            onHide();
        }
    }, [response, onHide, show]);

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
            >
                <Formik<SettingsFormModal>
                    initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    }}
                    onSubmit={(settings) => onSubmit({ currentPassword: settings.currentPassword, newPassword: settings.newPassword })}
                    validationSchema={SettingsValidationSchema}
                >{({ dirty, isValid }) =>
                    <FormikForm>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Change Password
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <Form.Group controlId="currentPassword">
                                <Form.Label>Current Password</Form.Label>
                                <InputField name="currentPassword" type="password" placeholder="Please enter current password" autoComplete="off" />
                            </Form.Group>

                            <Form.Group controlId="newPassword">
                                <Form.Label>New Password</Form.Label>
                                <InputField name="newPassword" type="password" placeholder="Please enter new password" autoComplete="off" />
                            </Form.Group>

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <InputField name="confirmPassword" type="password" placeholder="Please enter same password again" autoComplete="off" />
                            </Form.Group>

                        </Modal.Body>
                        <Modal.Footer>
                            <ButtonSpinner
                                type='submit'
                                loading={response.loading}
                                disabled={response.loading || !isValid || !dirty}
                                loadingText='Changing..'
                                staticText="Submit"
                            />
                            <Button variant="secondary" onClick={onHide}>Close</Button>
                        </Modal.Footer>
                    </FormikForm>}
                </Formik>
            </Modal>
        </>
    );
}