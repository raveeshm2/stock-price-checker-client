import React from 'react'
import { Button, Spinner } from 'react-bootstrap';

interface ButtonSpinnerProps {
    className?: string,
    type?: 'submit' | 'reset',
    variant?: string,
    loading: boolean,
    disabled: boolean,
    loadingText?: string, // text displayed at the time of loading
    staticText: string // default text,
    onClick?: (event: any) => void
}

export const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ className = '', type = 'button', variant = 'primary', loading, disabled, loadingText = 'Loading...', staticText, onClick }) => {
    return (
        <Button
            className={className}
            variant={variant}
            type={type}
            disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            onClick={onClick}
        >
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className={loading ? 'd-inline-block' : 'd-none'}
            />
            <span className={loading ? 'ml-3 d-inline-block' : 'd-none'}>{loadingText}</span>
            <span className={!loading ? 'd-inline-block' : 'd-none'}>{staticText}</span>
        </Button>
    );
}