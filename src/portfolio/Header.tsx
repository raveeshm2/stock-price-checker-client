import React from 'react'
import { Card } from 'react-bootstrap';
import { Total } from "./models/holding"
import './Header.scss';

interface HeaderProps extends Total { }

export const Header: React.FC<HeaderProps> = ({ totalInvested = 0, totalCurrentValue = 0, totalProfit = 0, totalProfitChange = 0 }) => {
    return (
        <Card body className='mb-1' text={'white'} style={{ background: '#356693' }}>
            <div className='d-flex'>
                <div className='w-50 text-center'>
                    <div>
                        <Card.Subtitle style={{ color: '#ddd' }}>Invested</Card.Subtitle>
                    </div>
                    <div className='my-2'>
                        <Card.Title>{totalInvested.toFixed(2)}</Card.Title>
                    </div>
                </div>
                <div className='w-50 d-flex justify-content-center'>
                    <div>
                        <div>
                            <Card.Subtitle style={{ color: '#ddd' }}>Current</Card.Subtitle>
                        </div>
                        <div className='my-2'>
                            <Card.Title>{totalCurrentValue.toFixed(2)}</Card.Title>
                        </div>
                    </div>
                </div>
            </div>
            <hr className='header-hr' />
            <div className='d-flex'>
                <div className='w-50 text-center'>
                    <div>
                        <Card.Subtitle style={{ color: '#ddd', fontSize: '1.25rem' }}>P&amp;L</Card.Subtitle>
                    </div>
                </div>
                <div className='w-50 d-flex justify-content-center'>
                    <div style={{ marginTop: '-.4rem' }}>
                        <Card.Title style={{ display: 'inline' }} className={totalProfit >= 0 ? 'color-green' : 'color-red'}>{totalProfit >= 0 ? `+${totalProfit.toFixed(2)}` : totalProfit.toFixed(2)} </Card.Title>
                        <span style={{ fontSize: '0.8rem' }} className={totalProfitChange >= 0 ? 'color-green' : 'color-red'}>{totalProfitChange >= 0 ? `+${totalProfitChange.toFixed(2)}` : totalProfitChange.toFixed(2)}% </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}