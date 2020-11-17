export interface StockInput {
    stockName: string;
}

// Used both for response as well as sending Request to save
export interface StockSearchPayload {
    symbol: string;
    name: string;
}

export interface StockDeletePayload {
    symbol: string
}

export interface StockResponsePayload {
    lastPrice: number,
    change: number,
    pChange: number,
    previousClose: number,
    open: number,
    close: number,
    lowerCP: string,
    upperCP: string,
    intraDayHighLow: {
        min: number,
        max: number
    },
    name: string
}


export interface StockListResponsePayload {
    [key: string]: StockResponsePayload
}