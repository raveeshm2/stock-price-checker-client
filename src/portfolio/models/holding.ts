export interface DeleteHolding {
    symbol: string;
    quantity: number
}

export interface AddHolding extends DeleteHolding {
    price: number;
}

export interface HoldingListPayload {
    symbol: string,
    quantity: number,
    totalInvested: number,
    avgPrice: number,
    currentPrice: number,
    change: number,
    pChange: number,
    profit: number,
    profitChange: number
}

export interface MarketOpen {
    open: boolean,
    change: number
}

export interface Total {
    totalInvested: number,
    totalCurrentValue: number,
    totalProfit: number,
    totalProfitChange: number
}

export interface Today {
    todayProfit: number,
    todayProfitChange: number
}

export interface HoldingListResponsePayload {
    [key: string]: HoldingListPayload | MarketOpen | Total | Today,
}

export function isMarketOpenPayload(obj: HoldingListPayload | MarketOpen | Total | Today): obj is MarketOpen {
    if ("open" in obj)
        return true;
    return false;
}

export function isHoldingListPayload(obj: HoldingListPayload | MarketOpen | Total | Today): obj is HoldingListPayload {
    if ("symbol" in obj)
        return true;
    return false;
}

export function isTotalsPayload(obj: HoldingListPayload | MarketOpen | Total | Today): obj is Total {
    if ("totalProfit" in obj)
        return true;
    return false;
}

export function isTodaysPayload(obj: HoldingListPayload | MarketOpen | Total | Today): obj is Today {
    if ("todayProfit" in obj)
        return true;
    return false;
}