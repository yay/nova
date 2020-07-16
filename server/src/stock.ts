import { httpGet } from './http';
import { Company, Quote, QuoteInterval, YFinanceAuth } from "./stock_i";

function encodeParams(params: { [key in string]: any }) {
    return Object.keys(params).map(k =>
        encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    ).join('&');
}

export class Stock {
    private static yFinanceAuth?: YFinanceAuth;
    static symbols?: Company[] = undefined;
    static symbolToName = new Map<string, string>();

    static getSymbols(): Promise<Company[]> {
        if (this.symbols) {
            return Promise.resolve(this.symbols);
        }
        // {
        //     symbol: 'AAPL',
        //     name: 'APPLE INC',
        //     date: '2020-01-24',
        //     isEnabled: true,
        //     type: 'N/A',
        //     iexId: '11'
        // }
        const baseUrl: string = 'https://api.iextrading.com/1.0';
        return httpGet<Company[]>(`${baseUrl}/ref-data/symbols`)
            .then(response => {
                return this.symbols = response.json()
                    .filter(s => s.symbol && s.name) // discard entries that don't have both name and symbol
                    .map(({ symbol, name }) => {
                        this.symbolToName.set(symbol, name);
                        return { symbol, name };
                    });
            });
    }

    /**
     * Returns an array of Company objects.
     * @param part First letters of the symbol or any part of a company's name.
     * @param max Maximum number of returned suggestions.
     */
    static async suggest(part: string, max: number = 10): Promise<Company[]> {
        const symbols = await this.getSymbols();
        const results: Company[] = [];

        part = part.trim();
        if (!symbols || !part) {
            return results;
        }

        // match symbols first
        const PART = part.toUpperCase();
        for (let i = 0, k = results.length, n = symbols.length; i < n && k < max; i++) {
            const s = symbols[i];
            if (s.symbol.startsWith(PART)) {
                results.push(s);
                k++;
            }
        }
        // if we still don't have `max` results, match company names second
        for (let i = 0, k = results.length, n = symbols.length; i < n && k < max; i++) {
            const s = symbols[i];
            if (s.name.toLowerCase().indexOf(part) >= 0) {
                results.push(s);
                k++;
            }
        }
        return results;
    }

    static fetchYFinanceAuth(): Promise<YFinanceAuth> {
        if (this.yFinanceAuth) {
            return Promise.resolve(this.yFinanceAuth);
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
                return this.yFinanceAuth = {
                    cookie,
                    crumb
                };
            });
    }

    static async fetchQuotes(symbol: string, options?: {
        interval?: QuoteInterval
    }): Promise<Quote[]> {
        const { cookie, crumb } = await this.fetchYFinanceAuth();
        const then = new Date().getTime() - 360 * 24 * 60 * 60 * 1000;

        const params = {
            period1: Math.round(then / 1000),
            period2: Math.round(Date.now() / 1000),
            interval: options?.interval || QuoteInterval.Day,
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
