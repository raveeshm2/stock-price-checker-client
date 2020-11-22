import React, { useEffect, useState } from 'react'
import { Container, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigation } from '../Navbar/Navigation'
import { State } from "../root/store/reducer";
import { ItemRequestState } from '../global/model/state';
import { TriggerResponsePayload } from './models/trigger';
import { GET_TRIGGER_RESOURCE } from './store/saga';
import { Trigger } from './Trigger';
import { DeleteTriggerModal } from './modals/DeleteTriggerModal';
import { EditTriggerModal } from './modals/EditTriggerModal';
import { Spinner } from '../ui/Spinner';
import { DeleteAllTriggers } from './DeleteAllTriggers';
import { Response } from "../global/model/response";

interface TriggerListProps {

}

export const TriggerList: React.FC<TriggerListProps> = (props) => {

    const dispatch = useDispatch();
    const response = useSelector<State, ItemRequestState<TriggerResponsePayload[]>>(state => state.triggers.list);
    const [deleteTrigger, setDeleteTrigger] = useState<{ id: string, symbol: string } | null>(null);
    const [editTrigger, setEditTrigger] = useState<{ id: string, symbol: string, type: 'gte' | 'lte', price: number } | null>(null);
    const deleteResponse = useSelector<State, ItemRequestState<Response>>(state => state.triggers.delete);

    useEffect(() => {
        dispatch(GET_TRIGGER_RESOURCE.request(null));
    }, [dispatch]);

    return (
        <>
            <Navigation />
            <Container>
                <div className='mb-4' style={{ marginTop: '5rem' }}>
                    <h1 className='mb-3'>Manage Alerts</h1>
                    {response.data ?
                        response.data.length > 0 ?
                            <Table responsive="lg" striped bordered hover variant="dark" size="lg">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Stock</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Is Triggered</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {response.data.map((trigger, index) => <Trigger key={index} setDeleteTrigger={setDeleteTrigger} setEditTrigger={setEditTrigger} sno={index + 1} {...trigger} />)}
                                </tbody>
                            </Table>
                            :
                            <h3 className='mt-3'>You haven't set any alerts !!</h3>
                        : null}
                </div>
            </Container>
            <Spinner loading={response.loading && !response.data ? true : false} type='metro' color='#000' size={120} text='Loading your alerts. Please wait...' />
            {deleteTrigger && <DeleteTriggerModal
                show={true}
                onHide={() => setDeleteTrigger(null)}
                type='single'
                text="Are you sure, you want to remove this alert ?"
                payload={{ id: deleteTrigger.id }}
                symbol={deleteTrigger.symbol}
                response={deleteResponse}
            />}
            {editTrigger && <EditTriggerModal
                show={true}
                onHide={() => setEditTrigger(null)}
                {...editTrigger} />}
            {response.data && response.data.length > 0 && <DeleteAllTriggers />}
        </>
    );
}