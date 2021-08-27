import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const Apollo = ({ children }) => {
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        ssrMode: false,
        uri: 'http://localhost:4000',
        cache: new InMemoryCache(),
        assumeImmutableResults: true,
      }),
    []
  );

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Apollo>
      <Component {...pageProps} />
    </Apollo>
  );
}

export default MyApp;
