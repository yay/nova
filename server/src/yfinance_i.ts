export interface YFinanceAuth {
    cookie: string;
    crumb: string;
}

export interface DayQuote {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
}