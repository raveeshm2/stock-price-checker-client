import React from 'react'
import { Button } from 'react-bootstrap';
import { TriggerResponsePayload } from './models/trigger';

interface TriggerProps extends TriggerResponsePayload {
    sno: number,
    setDeleteTrigger: React.Dispatch<React.SetStateAction<{
        symbol: string;
        id: string;
    } | null>>,
    setEditTrigger: React.Dispatch<React.SetStateAction<{
        id: string;
        symbol: string;
        type: 'gte' | 'lte';
        price: number;
    } | null>>
}


export const Trigger: React.FC<TriggerProps> = ({ sno, id, symbol, type, price, isTriggered, triggeredAt, setDeleteTrigger, setEditTrigger }) => {
    const formatedTrigger = triggeredAt ? new Date(triggeredAt) : null;
    return (
        <tr>
            <td>{sno}</td>
            <td>{symbol}</td>
            <td>{type === 'lte' ? "Less Than" : "Geater Than"}</td>
            <td>{price}</td>
            <td>{isTriggered ? `${formatedTrigger!.toLocaleDateString()} ${formatedTrigger!.toLocaleTimeString()}` : "No"}</td>
            <td>
                <div className='d-inline'>
                    <Button className='mr-2' variant="light" disabled={isTriggered} onClick={() => setEditTrigger({ id, symbol, type, price })}>Update</Button>
                    <Button variant="danger" onClick={() => setDeleteTrigger({ id, symbol })}>Delete</Button>
                </div>
            </td>
        </tr>
    );
}