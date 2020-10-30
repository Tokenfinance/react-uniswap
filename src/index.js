import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      transactions: (_, args, { getCacheKey }) =>
        getCacheKey({ __typename: 'transactions', id: args.id }),
    },
  },
});

const storage = window.localStorage;
const waitOnCache = persistCache({ cache, storage });

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap',
  cache,
});

waitOnCache.then(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
