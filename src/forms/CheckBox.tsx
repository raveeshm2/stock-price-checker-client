import React, { ComponentType } from 'react';
import { Field, FieldProps } from 'formik';
import { Form } from 'react-bootstrap';

interface CheckBoxProps {
    label?: string
    disabled?: boolean;
    className?: string,

    name: string,
}

/**
 * Props adapter
 * @param WrappedComponent
 */
const checkBoxAdapter = (
    /**
     * input control component
     */
    WrappedComponent: ComponentType<any>
) => (
    props: FieldProps<string> & CheckBoxProps
) => {
        const { field, form, meta, ...rest } = props;
        return (
            <>
                <WrappedComponent {...field}
                    onChange={((val: any) => form.setFieldValue(field.name, val.target.checked, true))}
                    {...rest}
                />
            </>
        );
    };

const CheckBoxAdapted = checkBoxAdapter(Form.Check);


export const CheckBox: React.FC<CheckBoxProps> = ({ ...props }) => {

    return (
        <Field
            type='checkbox'
            {...props}
            component={CheckBoxAdapted}
        />
    );
}