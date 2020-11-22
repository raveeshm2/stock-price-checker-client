export interface AddTriggerModel {
    type: string,
    price: number,
    symbol: string
}

export interface DeleteTriggerModel {
    id: string
}

export interface DeleteAllTriggerModel {
    onlyTriggered: boolean
}

export interface UpdateTriggerModel {
    id: string,
    type: string,
    price: number
}

export interface TriggerResponsePayload {
    id: string,
    symbol: string,
    type: 'gte' | 'lte',
    price: number,
    isTriggered: boolean,
    triggeredAt: string | null
}