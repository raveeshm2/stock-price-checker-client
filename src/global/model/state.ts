export interface RequestStateBase<TData> {
    loading: boolean;
    data: TData;
    error: string[] | null;
}

export interface ItemRequestState<TData> extends RequestStateBase<TData | null> { }
