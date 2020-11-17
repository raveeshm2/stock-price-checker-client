import React, { useEffect } from 'react';
import { Formik, Form as FormikForm } from 'formik';
import { InputField } from "../../forms/InputField";
import { Form } from 'react-bootstrap';
import { ButtonSpinner } from '../../ui/ButtonSpinner';
import { LoginValidationSchema } from "../../utils/validation";
import { RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN_RESOURCE } from '../store/saga';
import { State } from "../../root/store/reducer";
import { ItemRequestState } from '../../global/model/state';
import './login.scss';
import { Response } from '../../global/model/response';
import { STOCK_LIST_RESOURCE } from '../../stocks/store/saga';


interface loginProps extends RouteComponentProps { }

interface LoginFormModel {
    email: string,
    password: string
}

export const Login: React.FC<loginProps> = () => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<Response>>(state => state.user.login);

    //Redirect to Stock List page when already logged in and not present on Stock list page
    useEffect(() => {
        dispatch(STOCK_LIST_RESOURCE.request(null));
    }, [dispatch])

    async function onSubmit(user: LoginFormModel) {
        dispatch(LOGIN_RESOURCE.request(user));
    }

    return (
        <div id="cover" className="min-vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 col-xs-2 mx-auto form p-4" style={{ zIndex: 1 }}>
                        <Formik<LoginFormModel>
                            initialValues={{
                                email: '',
                                password: ''
                            }}
                            onSubmit={(user) => onSubmit(user)}
                            validationSchema={LoginValidationSchema}
                        >{({ dirty, isValid }) =>
                            <FormikForm>
                                <h4 className='pt-1 pb-3'>Sign In</h4>

                                <Form.Group controlId="email">
                                    <InputField name="email" type="text" placeholder="Enter email address" autoComplete="off" />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <InputField name="password" type="password" placeholder="Enter password" autoComplete="off" />
                                </Form.Group>

                                <ButtonSpinner
                                    type='submit'
                                    loading={response.loading}
                                    disabled={response.loading || !isValid || !dirty}
                                    loadingText='Logging in..'
                                    staticText="Login"
                                />

                                <Form.Text>
                                    <div style={{ fontSize: '1.2em' }}>
                                        <div>Don't have an account ?</div>
                                        <a href="/signup">Create one now !</a>
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