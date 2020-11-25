import React from 'react'
import { Card } from 'react-bootstrap';
import { HoldingListPayload } from "./models/holding";

interface HoldingProps extends HoldingListPayload { }

export const Holding: React.FC<HoldingProps> = ({ symbol, quantity, totalInvested, avgPrice, currentPrice, pChange, profit, profitChange }) => {
    return (
        <Card body>
            <div className='d-flex'>
                <div className='w-50'>
                    <div>
                        <Card.Subtitle style={{ color: '#aaa', fontSize: '0.8rem' }} className='font-weight-bold'><span className='mr-2'> {quantity} Qty</span><span>Avg: {avgPrice}</span></Card.Subtitle>
                    </div>
                    <div className='my-2'>
                        <Card.Title>{symbol}</Card.Title>
                    </div>
                    <div>
                        <Card.Subtitle style={{ fontSize: '0.8rem' }}>Invested {totalInvested.toFixed(2)}</Card.Subtitle>
                    </div>
                </div>
                <div className='w-50 d-flex justify-content-end'>
                    <div style={{ marginTop: '-.35rem' }}>
                        <div style={{ marginTop: '-.20rem', fontSize: '0.8rem' }} className={profitChange >= 0 ? 'color-green text-right' : 'color-red text-right'}>{profitChange >= 0 ? `+${profitChange.toFixed(2)}` : profitChange.toFixed(2)}%</div>
                        <div className={profit >= 0 ? 'color-green text-right my-1' : 'color-red text-right my-1'}>{profit >= 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2)}</div>
                        <div style={{ fontSize: '0.8rem' }}><Card.Subtitle style={{ display: 'inline-block', fontSize: '0.8rem' }}>LTP {currentPrice.toFixed(2)}</Card.Subtitle><span className={pChange >= 0 ? 'color-green' : 'color-red'}> ({pChange >= 0 ? `+${pChange.toFixed(2)}` : pChange.toFixed(2)}%)</span></div>
                    </div>

                </div>
            </div>
        </Card>
    );
}