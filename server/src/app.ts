import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-router';
import { Stock } from "./stock";

const app = new Koa();
const apiRouter = new Router({
    prefix: '/api'
});
const siteRouter = new Router();

apiRouter
    .get('/symbols', async (ctx, next) => {
        ctx.body = await Stock.getSymbols();
    })
    .get('/history/:symbol', async (ctx, next) => {
        ctx.body = await Stock.fetchQuotes(ctx.params.symbol);
    })
    .get('/symbol/complete/:part/:max*', async (ctx) => {
        ctx.body = await Stock.suggest(ctx.params.part, ctx.params.max | 10);
    });

siteRouter
    .get('/symbols', async (ctx, next) => {
        const symbols = await Stock.getSymbols();
        let body = symbols.map(s => {
            return `<strong><a href="/symbol/${s.symbol}">${s.symbol}</a></strong>&nbsp;-&nbsp;${s.name}<br>`;
        }).join('');
        body = '<div style="font-family: sans-serif;">' + body + '</div>';
        ctx.set('Content-Type', 'text/html');
        ctx.body = body;
    });

app
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods());

app
    .use(siteRouter.routes())
    .use(siteRouter.allowedMethods());

app.listen({ port: 4000 }, () => {
    console.log('Server running at http://localhost:4000');
});

// async function run() {
//     console.log(await Iex.suggest('aa'));
// }
//
// run();