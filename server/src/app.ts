import Koa from 'koa';
import KoaStatic from 'koa-static';
import Router from 'koa-router';
import { ApolloServer, gql } from "apollo-server-koa";
import { Iex } from "./iex";
import { YFinance } from "./yfinance";

// https://create-react-app.dev/docs/proxying-api-requests-in-development/

// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;
//
// const resolvers = {
//     Query: {
//         hello: () => 'Hello world!',
//     },
// };
//
// const server = new ApolloServer({ typeDefs, resolvers });
//
const app = new Koa();
const apiRouter = new Router({
    prefix: '/api'
});

apiRouter
    .get('/symbols', async (ctx, next) => {
        ctx.body = await Iex.getSymbols();
    })
    .get('/history/:symbol', async (ctx, next) => {
        ctx.body = await YFinance.fetchData(ctx.params.symbol);
    })
    .get('/symbol/complete/:part/:max*', async (ctx) => {
        ctx.body = await Iex.suggest(ctx.params.part, ctx.params.max | 10);
    });
// server.applyMiddleware({ app });
//

app
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods());

app.listen({ port: 4000 }, () =>
    // console.log('Now browse to http://localhost:4000' + server.graphqlPath)
    console.log('Server running at http://localhost:4000')
);

// async function run() {
//     console.log(await Iex.suggest('aa'));
// }
//
// run();