import React, { useContext, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from '../Navbar/Navigation'
import { State } from "../root/store/reducer";
import { ItemRequestState } from '../global/model/state';
import { Spinner } from '../ui/Spinner';
import { GlobalContext } from '../global/context';
import { HoldingListResponsePayload, isHoldingListPayload, isMarketOpenPayload, isTodaysPayload, isTotalsPayload } from './models/holding';
import { HOLDING_LIST_RESOURCE } from './store/saga';
import { Holding } from './Holding';
import { Header } from './Header';
import { Footer } from './Footer';

interface holdingListProps { }

export const HoldingList: React.FC<holdingListProps> = (props) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<HoldingListResponsePayload>>(state => state.portfolio.list);
    const context = useContext(GlobalContext);

    useEffect(() => {
        dispatch(HOLDING_LIST_RESOURCE.request(null));
    }, [dispatch]);

    // Clear intervals when unmounting component
    useEffect(() => {
        return () => {
            if (context.global.portfolioInterval) {
                clearInterval(context.global.portfolioInterval);
                context.dispatch!({
                    type: "UPDATE_PORTFOLIO_INTERVAL_KEY", payload: {
                        portfolioInterval: null
                    }
                });
            }
        }
    }, [context.dispatch, context.global.portfolioInterval])

    useEffect(() => {
        if (response?.data) {
            const marketOpen = Object.values(response.data).find(value => isMarketOpenPayload(value))
            if (marketOpen && isMarketOpenPayload(marketOpen)) {
                const isOpen = marketOpen.open;
                const change = marketOpen.change;
                if (isOpen) {
                    if (!context.global.portfolioInterval) {
                        const key = setInterval(() => {
                            dispatch(HOLDING_LIST_RESOURCE.request(null));
                        }, change);
                        context.dispatch!({
                            type: "UPDATE_PORTFOLIO_INTERVAL_KEY", payload: {
                                portfolioInterval: key
                            }
                        });
                    }
                } else {
                    if (context.global.portfolioInterval) {
                        clearInterval(context.global.portfolioInterval);
                        context.dispatch!({
                            type: "UPDATE_PORTFOLIO_INTERVAL_KEY", payload: {
                                portfolioInterval: null
                            }
                        });
                    }
                }
            }
        }
    }, [response?.data, context.dispatch, context.global.portfolioInterval, dispatch]);

    return (
        <>
            <Navigation />
            <Container>
                <div className='mb-4' style={{ marginTop: '5rem' }}>
                    <h1 className='mb-3'>Portfolio</h1>
                    {response.data && Object.keys(response.data).map((symbol, index) => {
                        const holding = response.data![symbol];
                        if (isTotalsPayload(holding))
                            return <Header {...holding} key={index} />
                        else
                            return null;
                    })}
                    {response.data && Object.keys(response.data).map((symbol, index) => {
                        const holding = response.data![symbol];
                        if (isHoldingListPayload(holding))
                            return <Holding {...holding} key={index} />
                        else
                            return null;
                    })}
                    {response.data && Object.keys(response.data).map((symbol, index) => {
                        const holding = response.data![symbol];
                        if (isTodaysPayload(holding))
                            return <Footer {...holding} key={index} />
                        else
                            return null;
                    })}
                </div>
            </Container>
            {/* Display Spinner only during the first load */}
            <Spinner loading={response.loading && !response.data ? true : false} type='wave' color='#000' size={120} text='Loading your portfolio. Please wait...' />
        </>
    );
}