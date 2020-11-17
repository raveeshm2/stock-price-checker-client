import React, { useContext, useEffect, useState } from 'react'
import { CardDeck, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from '../Navbar/Navigation'
import { State } from "../root/store/reducer";
import { ItemRequestState } from '../global/model/state';
import { StockSearch } from './StockSearch';
import { STOCK_LIST_RESOURCE } from './store/saga';
import { StockListResponsePayload } from './models/stock';
import { Stock } from './Stock';
import { AddTriggerModal } from './modals/AddTriggerModal';
import { DeleteStockModal } from './modals/DeleteStockModal';
import { Spinner } from '../ui/Spinner';
import { GlobalContext } from '../global/context';

interface stockListProps {

}

export const StockList: React.FC<stockListProps> = (props) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<StockListResponsePayload>>(state => state.stocks.list);
    const [addTrigger, setAddTrigger] = useState<{ symbol: string, name: string } | null>(null);
    const [deleteStock, setDeleteStock] = useState<{ symbol: string, name: string } | null>(null);
    const context = useContext(GlobalContext);

    useEffect(() => {
        dispatch(STOCK_LIST_RESOURCE.request(null));
    }, [dispatch]);

    // Clear intervals when unmounting component
    useEffect(() => {
        return () => {
            if (context.global.interval) {
                clearInterval(context.global.interval);
                context.dispatch!({
                    type: "UPDATE_INTERVAL_KEY", payload: {
                        interval: null
                    }
                });
            }
        }
    }, [context.dispatch, context.global.interval])

    useEffect(() => {
        if (response?.data?.isMarketOpen) {
            const isOpen = (response.data.isMarketOpen.open) as any as boolean;
            const change = response.data.isMarketOpen.change;
            if (isOpen) {
                if (!context.global.interval) {
                    const key = setInterval(() => {
                        dispatch(STOCK_LIST_RESOURCE.request(null));
                    }, change);
                    context.dispatch!({
                        type: "UPDATE_INTERVAL_KEY", payload: {
                            interval: key
                        }
                    });
                }
            } else {
                if (context.global.interval) {
                    clearInterval(context.global.interval);
                    context.dispatch!({
                        type: "UPDATE_INTERVAL_KEY", payload: {
                            interval: null
                        }
                    });
                }
            }
        }
    }, [response?.data?.isMarketOpen, context.dispatch, context.global.interval, dispatch]);

    return (
        <>
            <Navigation />
            <Container>
                <div className='mb-4' style={{ marginTop: '5rem' }}>
                    <h1 className='mb-3'>Stock Watch List</h1>
                    <StockSearch />
                    {response.data &&
                        <CardDeck>
                            {Object.keys(response.data).map(symbol =>
                                symbol !== "isMarketOpen" ? <Col lg="4" className='mt-4' key={symbol}>
                                    <Stock symbol={symbol} {...response!.data![symbol]} setAddTrigger={setAddTrigger} setDeleteStock={setDeleteStock} />
                                </Col> : null
                            )}
                        </CardDeck>
                    }
                </div>
            </Container>
            {/* Display Spinner only during the first load */}
            <Spinner loading={response.loading && !response.data ? true : false} type='wave' color='#000' size={120} text='Loading your stocks watchlist. Please wait...' />
            {addTrigger && <AddTriggerModal
                show={addTrigger ? true : false}
                name={addTrigger ? addTrigger.name : ''}
                symbol={addTrigger ? addTrigger.symbol : ''}
                onHide={() => setAddTrigger(null)} />}
            {deleteStock && <DeleteStockModal
                show={deleteStock ? true : false}
                name={deleteStock ? deleteStock.name : ''}
                symbol={deleteStock ? deleteStock.symbol : ''}
                onHide={() => setDeleteStock(null)} />}
        </>
    );
}