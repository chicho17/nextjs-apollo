import React, { useMemo } from 'react';

import { ApolloProvider, ApolloClient } from '@apollo/client';
import { createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-unfetch';

let clientSideApolloInstance;

function createClientSideApolloInstance(initialState) {
  if (clientSideApolloInstance) {
    return clientSideApolloInstance;
  }
  clientSideApolloInstance = new ApolloClient({
    ssrMode: false,
    uri: 'http://localhost:4000',
    cache: new InMemoryCache().restore(initialState ?? {}),
    assumeImmutableResults: true,
  });
  return clientSideApolloInstance;
}

function createServerSideApolloInstance() {
  return new ApolloClient({
    ssrMode: true,
    link: createHttpLink({ uri: 'http://localhost:4000', fetch }),
    cache: new InMemoryCache(),
    assumeImmutableResults: true,
  });
}

const withApollo = (Component) => {
  const WithApollo = (props) => {
    const apolloClient = useMemo(
      () => props.apolloClient ?? createClientSideApolloInstance(props.apolloState),
      [props.apolloState, props.apolloClient]
    );

    return (
      <ApolloProvider client={apolloClient}>
        <Component {...props} />
      </ApolloProvider>
    );
  };

  WithApollo.getInitialProps = async (ctx) => {
    if (typeof window === 'undefined') {
      const apolloClient = createServerSideApolloInstance();
      const AppTree = ctx.AppTree;
      const props = { pageProps: { apolloClient } };
      const { getDataFromTree } = await import('@apollo/client/react/ssr');
      await getDataFromTree(<AppTree {...props} />);
      const initialState = apolloClient.cache.extract();

      return {
        apolloState: initialState,
      };
    }

    return {
      apolloState: undefined,
    };
  };

  return WithApollo;
};

export { withApollo };
