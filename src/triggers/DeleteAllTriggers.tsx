import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { DeleteTriggerModal } from './modals/DeleteTriggerModal';
import { State } from "../root/store/reducer";
import { ItemRequestState } from '../global/model/state';
import { Response } from "../global/model/response";

interface DeleteAllTriggersProps {

}

export const DeleteAllTriggers: React.FC<DeleteAllTriggersProps> = (props) => {

    const [deleteState, setDeleteState] = useState<{ onlyTriggered: boolean } | null>(null);
    const response = useSelector<State, ItemRequestState<Response>>(state => state.triggers.deleteAll);

    return (
        <>
            <div className='d-flex justify-content-center mb-3'>
                <Button className='mr-2' variant="danger" onClick={() => setDeleteState({ onlyTriggered: false })}>Delete All</Button>
                <Button variant="info" onClick={() => setDeleteState({ onlyTriggered: true })}>Delete Only Triggered</Button>
            </div>
            {deleteState &&
                <DeleteTriggerModal
                    type='multiple'
                    show={true}
                    onHide={() => setDeleteState(null)}
                    payload={{ onlyTriggered: deleteState.onlyTriggered }}
                    text={deleteState.onlyTriggered ? "Are you sure you want to delete all triggered alerts ?" : "Are you sure you want to delete all alerts ?"}
                    response={response}
                />}
        </>
    );
}