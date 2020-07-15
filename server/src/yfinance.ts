import { httpGet } from './http';
import { DayQuote, YFinanceAuth } from "./yfinance_i";

function encodeParams(params: { [key in string]: any }) {
    return Object.keys(params).map(k =>
        encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    ).join('&');
}

export class YFinance {
    private static _auth?: YFinanceAuth;

    static fetchAuth(): Promise<YFinanceAuth> {
        if (this._auth) {
            return Promise.resolve(this._auth);
        }
        return httpGet('https://uk.finance.yahoo.com/quote/MSFT/history')
            .then(response => {
                const { text, headers } = response;
                const cookie = headers['set-cookie']?.[0]?.split(';')?.[0];
                if (!cookie) {
                    throw new Error('Failed to retrieve YFinance auth cookie.');
                }
                // Example: "CrumbStore":{"crumb":"l45fI\u002FklCHs"}
                const keyword = 'CrumbStore":{"crumb":"';
                const start = text.indexOf(keyword);
                const end = text.indexOf('"}', start);
                const crumb = text.substring(start + keyword.length, end);
                return this._auth = {
                    cookie,
                    crumb
                };
            });
    }

    static async fetchData(symbol: string): Promise<DayQuote[]> {
        const { cookie, crumb } = await this.fetchAuth();
        const then = new Date().getTime() - 360 * 24 * 60 * 60 * 1000;

        const params = {
            period1: Math.round(then / 1000),
            period2: Math.round(Date.now() / 1000),
            interval: '1d',
            events: 'history',
            crumb
        };
        const urlParams = encodeParams(params);

        return httpGet({
                hostname: 'query1.finance.yahoo.com',
                path: `/v7/finance/download/${symbol}?${urlParams}`,
                headers: {
                    'Cookie': cookie,
                    'User-Agent': 'Chrome/69.0.3497.100 Safari/537.36'
                }
            })
            .then(response => {
                // First line is the CSV header:
                // Date,Open,High,Low,Close,Adj Close,Volume
                const lines = response.text.trim().split('\n').slice(1);
                return lines.map(line => {
                    const [date, open, high, low, close, adjClose, volume] = line.split(',');
                    return {
                        date: new Date(date).getTime(),
                        open: +open,
                        high: +high,
                        low: +low,
                        close: +close,
                        adjClose: +adjClose,
                        volume: +volume
                    };
                });
            });
    }
}
