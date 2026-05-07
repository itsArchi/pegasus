import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const PHOENIX_URL = process.env.NEXT_PUBLIC_PHOENIX_URL ?? 'http://localhost:3000/graphql'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: PHOENIX_URL,
    headers: { 'apollo-require-preflight': '1' },
  }),
  cache: new InMemoryCache(),
})
