export interface YFinanceAuth {
    cookie: string;
    crumb: string;
}

export enum QuoteInterval {
    Day = '1d'
}

export interface Quote {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    adjClose?: number;
}

export interface Company {
    symbol: string;
    name: string;
}