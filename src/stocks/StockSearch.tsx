import React, { useState } from 'react'
import { ListGroup } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { State } from "../root/store/reducer";
import './search-stocks.scss';
import { ItemRequestState } from '../global/model/state';
import { StockSearchPayload } from './models/stock';
import { STOCK_ADD_RESOURCE, STOCK_SEARCH_RESOURCE } from './store/saga';

interface StockSearchProps {

}

export const StockSearch: React.FC<StockSearchProps> = (props) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<StockSearchPayload[]>>(state => state.stocks.search);
    const [searched, setSearched] = useState<string | undefined>(undefined);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.length > 2) {
            setSearched(value);
            dispatch(STOCK_SEARCH_RESOURCE.request({ stockName: value }));
        } else {
            setSearched(undefined);
        }
    }

    function submitStock(symbol: string, name: string) {
        dispatch(STOCK_ADD_RESOURCE.request({ symbol, name }));
        setSearched(undefined);
    }

    return (
        <>
            <Form.Control name='stock' placeholder='Search stocks' autoComplete='off' size="lg" onChange={onChangeHandler} />
            {
                !response.loading && response.data && searched && searched.length > 2 &&
                <ListGroup className='search-stocks-list'>
                    {response.data.map(stock =>
                        <div onClick={submitStock.bind(null, stock.symbol, stock.name)}>
                            <ListGroup.Item>{stock.name}</ListGroup.Item>
                        </div>)}
                </ListGroup>
            }
        </>
    );
}