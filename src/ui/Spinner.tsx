import React from 'react'
import { WaveSpinner, MetroSpinner } from "react-spinners-kit";

interface SpinnerProps {
    size: number;
    loading: boolean;
    color: string
    text: string,
    type: 'wave' | 'metro'
}

export const Spinner: React.FC<SpinnerProps> = ({ size, loading, color, text, type }) => {
    return (
        <div style={{ height: '70vh' }} className={loading ? 'd-flex justify-content-center align-items-center flex-column' : 'd-none'}>
            {type === 'wave' ? <WaveSpinner size={size} color={color} loading={loading} /> : <MetroSpinner size={size} color={color} loading={loading} />}
            <div className={loading ? 'mt-2' : 'd-none'}>
                <h5 className="text-center"> {text}</h5>
            </div>
        </div>

    );
}