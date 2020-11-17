import React from 'react'
import { Card } from 'react-bootstrap';
import { StockResponsePayload } from './models/stock';
import './stock.scss';

interface StockProps extends StockResponsePayload {
    symbol: string,
    setAddTrigger: React.Dispatch<React.SetStateAction<{
        symbol: string;
        name: string;
    } | null>>
    setDeleteStock: React.Dispatch<React.SetStateAction<{
        symbol: string;
        name: string;
    } | null>>,
    error?: string
}

export const Stock: React.FC<StockProps> = ({ setAddTrigger, setDeleteStock, ...stock }) => {

    return (
        !stock.error ? <Card style={{ minWidth: '18rem' }} className='h-100'>
            <Card.Header>
                <div className='d-flex justify-content-between'>
                    <span><b>{stock.symbol}</b></span>
                    <div className='d-inline-flex justify-content-end'>
                        <span className="material-icons mr-2" style={{ cursor: 'pointer' }} onClick={() => setAddTrigger({ symbol: stock.symbol, name: stock.name })}>add_alert</span>
                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => setDeleteStock({ symbol: stock.symbol, name: stock.name })}>delete</span>
                    </div>
                </div>

                <div className='d-flex '></div>
            </Card.Header>
            <Card.Body className='d-flex flex-column justify-content-end'>
                <Card.Title>{stock.name}</Card.Title>
                <Card.Text className='mt-2'>
                    <h5>Price: {stock.lastPrice} <span className={stock.change >= 0 ? 'color-green' : 'color-red'}>{stock.change > 0 ?
                        "+".concat(stock.change.toFixed(2).toString()).concat(` (+${stock.pChange.toFixed(2)}%)`)
                        : stock.change.toFixed(2).toString().concat(` (${stock.pChange.toFixed(2)}%)`)}</span></h5>
                    Open: {stock.open} <br />
                    Close: {stock.close} <br />
                    Previous Close: {stock.previousClose} <br />
                    Lower CP: {stock.lowerCP} <br />
                    Upper CP: {stock.upperCP} <br />
                    Intraday Low: {stock.intraDayHighLow.min} <br />
                    Intraday High: {stock.intraDayHighLow.max} <br />
                </Card.Text>
            </Card.Body>
        </Card> : null);
}