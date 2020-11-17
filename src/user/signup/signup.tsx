import React from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { InputField } from "../../forms/InputField";
import { Form } from 'react-bootstrap';
import { ButtonSpinner } from '../../ui/ButtonSpinner';
import { SignUpValidationSchema } from "../../utils/validation";
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "../../root/store/reducer";
import { ItemRequestState } from '../../global/model/state';
import './signup.scss';
import { Response } from '../../global/model/response';
import { SIGNUP_RESOURCE } from '../store/saga';


interface signUpProps extends RouteComponentProps { }

interface SignupFormModel {
    email: string,
    password: string,
    confirmPassword: string
}

export const SignUp: React.FC<signUpProps> = () => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.user.signup);

    async function onSubmit(user: SignupFormModel) {
        dispatch(SIGNUP_RESOURCE.request(user));
    }

    return (
        <div id="cover" className="min-vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 col-xs-2 mx-auto form p-4" style={{ zIndex: 1 }}>
                        <Formik<SignupFormModel>
                            initialValues={{
                                email: '',
                                password: '',
                                confirmPassword: ''
                            }}
                            onSubmit={(user) => onSubmit(user)}
                            validationSchema={SignUpValidationSchema}
                        >{({ dirty, isValid }) =>
                            <FormikForm>
                                <h4 className='pt-1 pb-3'>Sign up</h4>

                                <Form.Group controlId="email">
                                    <InputField name="email" type="text" placeholder="Enter email address" autoComplete="off" />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <InputField name="password" type="password" placeholder="Enter password" autoComplete="off" />
                                </Form.Group>

                                <Form.Group controlId="confirmPassword">
                                    <InputField name="confirmPassword" type="password" placeholder="Enter password again" autoComplete="off" />
                                </Form.Group>

                                <ButtonSpinner
                                    type='submit'
                                    loading={response.loading}
                                    disabled={response.loading || !isValid || !dirty}
                                    loadingText='Creating Account...'
                                    staticText="Sign up"
                                />

                                <Form.Text>
                                    <div style={{ fontSize: '1.2em' }}>
                                        <div>Already have an account ?</div>
                                        <a href="/login">Click here to login</a>
                                    </div>
                                </Form.Text>
                            </FormikForm>
                            }
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}