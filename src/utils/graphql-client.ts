import { GraphQLClient } from 'graphql-request';

const client_secret = process.env.NEXT_PUBLIC_FAUNA_SECRET;
const endpoint = 'https://graphql.fauna.com/graphql';
export const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
        authorization: `Bearer ${client_secret}`,
        'X-Schema-Preview': 'partial-update-mutation'
    },
});