// import fetch from 'isomorphic-unfetch'
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from 'subscriptions-transport-ws'

const createHttpLink = (headers: Record<string, string>) => {
  const httpLink = new HttpLink({
    uri: 'https://shorten-url.hasura.app/v1/graphql',
    credentials: 'include',
    headers, // auth token is fetched on the server side
    // fetch,
  })
  return httpLink;
}

const createWSLink = (headers: Record<string, string>) => {
  return new WebSocketLink(
    new SubscriptionClient('wss://shorten-url.hasura.app/v1/graphql', {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        return {
          headers,
        }
      },
    })
  )
}

export default function createApolloClient(initialState: NormalizedCacheObject, headers: Record<string, string>) {
  const ssrMode = typeof window === 'undefined'
  let link
  if (ssrMode) {
    link = createHttpLink(headers)
  } else {
    link = createWSLink(headers)
  }
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  })
}
