import { httpGet } from './http';
import { Company } from "./iex_i";

export class Iex {
    static baseUrl: string = 'https://api.iextrading.com/1.0';
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
        return httpGet<Company[]>(`${this.baseUrl}/ref-data/symbols`)
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
     * Returns an array of {symbol, name} objects.
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
};