import React, { ComponentType } from 'react';
import { Field, FieldProps } from 'formik';
import { Form } from 'react-bootstrap';

interface InputFieldProps {
    size?: 'sm' | 'lg';
    readOnly?: boolean;
    disabled?: boolean;
    type?: string,
    className?: string,
    autoComplete?: 'on' | 'off';

    name: string,
    placeholder?: string
}

/**
 * Props adapter
 * @param WrappedComponent
 */
const inputFieldAdapter = (
    /**
     * input control component
     */
    WrappedComponent: ComponentType<any>
) => (
    props: FieldProps<string> & InputFieldProps
) => {
        const { field, form, meta, ...rest } = props;
        return (
            <>
                <WrappedComponent {...field}
                    onChange={((val: any) => {
                        form.setFieldValue(field.name, val.target.value, true)
                    })}
                    {...rest}
                    isValid={form.touched[field.name] && !form.errors[field.name]}
                    isInvalid={!!form.errors[field.name]}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {form.errors[field.name]}
                </Form.Control.Feedback>
            </>
        );
    };

const InputAdapted = inputFieldAdapter(Form.Control);


export const InputField: React.FC<InputFieldProps> = ({ ...props }) => {

    return (
        <Field
            {...props}
            component={InputAdapted}
        />
    );
}