import * as yup from "yup";

export const SettingsValidationSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().min(8, 'Must be atleast 8 characters'),
    confirmPassword: yup.string().when('newPassword', {
        is: (val => val && val.trim() !== ''), then: yup.string().required('Password is required').equals([yup.ref('newPassword')], 'Passwords must match'),
        otherwise: yup.string().max(0, "Please enter new password first")
    })
});

export const LoginValidationSchema = yup.object({
    email: yup.string().required('Email address is required'),
    password: yup.string().required('Password is required')
});

export const SignUpValidationSchema = yup.object({
    email: yup.string().required('Email address is required'),
    password: yup.string().min(8, 'Must be atleast 8 characters'),
    confirmPassword: yup.string().when('password', {
        is: (val => val && val.trim() !== ''), then: yup.string().required('Password is required').equals([yup.ref('password')], 'Passwords must match'),
        otherwise: yup.string().max(0, "Please enter password first")
    })
});

export const AddTriggerValidationSchema = yup.object({
    type: yup.string().required('Alias name is required'),
    price: yup.string().required('Cutoff price is required').matches(/^[0-9.]+$/, 'Only Numbers are supported')
});

export const AddHoldingValidationSchema = yup.object({
    quantity: yup.string().required('Quantity is required'),
    price: yup.string().required('Price is required').matches(/^[0-9.]+$/, 'Only Numbers are supported')
});

export const DeleteHoldingValidationSchema = yup.object({
    quantity: yup.string().required('Quantity is required')
});