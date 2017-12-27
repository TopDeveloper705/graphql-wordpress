import 'dotenv/config';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from 'graphql-tools';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import typeDefs from 'server/graphql/schema';
import resolvers from 'server/graphql/resolvers';
import addModelsToContext from './models';
import authenticate from './authenticate';

/* eslint-disable no-console */

const schema = makeExecutableSchema({ typeDefs, resolvers });

const { GRAPHQL_PORT = 8080, MONGO_URL, MONGO_DB } = process.env;

async function startServer() {
  const client = await MongoClient.connect(MONGO_URL);
  const db = client.db(MONGO_DB);

  const app = express().use('*', cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    req.context = addModelsToContext({ db });

    next();
  });

  authenticate(app);

  app.use(
    '/graphql',
    graphqlExpress(req => ({
      schema,
      context: req.context,
    }))
  );

  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
    })
  );

  app.listen(GRAPHQL_PORT, () =>
    console.log(`API Server is now running on http://localhost:${GRAPHQL_PORT}`)
  );
}

startServer()
  .then(() => {
    console.log('All systems go');
  })
  .catch(e => {
    console.error('Uncaught error in startup');
    console.error(e);
    console.trace(e);
  });
