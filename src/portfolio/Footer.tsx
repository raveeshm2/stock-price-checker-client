import React from 'react'
import { Card } from 'react-bootstrap';
import { Today } from "./models/holding";

interface FooterProps extends Today { }

export const Footer: React.FC<FooterProps> = ({ todayProfit = 0, todayProfitChange = 0 }) => {
    return (
        <Card body className='my-1' text={'white'} style={{ background: '#356693' }}>
            <div className='d-flex'>
                <div className='w-50'>
                    Today's P&amp;L
                </div>
                <div className='w-50 text-right font-weight-bold'>
                    <span className={todayProfit >= 0 ? 'color-green' : 'color-red'}>{todayProfit >= 0 ? `+${todayProfit.toFixed(2)}` : todayProfit.toFixed(2)} {todayProfitChange >= 0 ? `+${todayProfitChange.toFixed(2)}` : todayProfitChange.toFixed(2)}%</span>
                </div>
            </div>
        </Card>);
}