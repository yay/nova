import https, { RequestOptions } from 'https';
import { IncomingHttpHeaders } from "http";
import { URL } from "url";

interface HttpGetResult<T> {
    text: string;
    headers: IncomingHttpHeaders;
    json: () => T;
}

export function httpGet<T = any>(options: RequestOptions | string | URL): Promise<HttpGetResult<T>> {
    return new Promise((resolve, reject) => {
        const req = https.get(options, res => {
            let text = '';
            res.setEncoding('utf8');
            res.on('data', chunk => text += chunk);
            res.on('end', () => {
                resolve({
                    text,
                    headers: res.headers,
                    json: () => JSON.parse(text)
                });
            });
        });
        req.on('error', error => reject(error));
        req.end();
    });
}