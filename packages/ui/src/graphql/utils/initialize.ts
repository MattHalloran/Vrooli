import { useMemo } from 'react';
import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error'
import { createUploadLink } from 'apollo-upload-client';
import { removeTypename } from './removeTypename';

let apolloClient: ApolloClient<NormalizedCacheObject>;

const createApolloClient = (): ApolloClient<NormalizedCacheObject> => {
    // Define link for error handling
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        // Only developers should see these error messages
        if (process.env.NODE_ENV === 'production') return;
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
                console.error('GraphQL error occurred');
                console.error(`Path: ${path}`);
                console.error(`Location: ${locations}`);
                console.error(`Message: ${message}`);
            })
        }
        if (networkError) {
            console.error('GraphQL network error occurred', networkError);
        }
    });
    // Define link for handling file uploads
    const uploadLink = createUploadLink({
        uri: window.location.origin.includes('localhost:') ? 
            `http://localhost:5329/api/v1` : 
            `https://app.vrooli.com/api/v1`,
        credentials: 'include'
    });
    // Define link for removing '__typename'. This field cannot be in queries or mutations, 
    // and is sometimes tedious to remove manually
    const cleanTypenameLink = new ApolloLink((operation, forward) => {
        if (operation.variables && !operation.variables.file && !operation.variables.files) {
            operation.variables = removeTypename(operation.variables);
        }
        return forward(operation);
    })
    // Create Apollo client
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([errorLink, cleanTypenameLink, uploadLink]),
    })
}

export const initializeApollo = (): ApolloClient<NormalizedCacheObject> => {
    const _apolloClient = apolloClient ?? createApolloClient();
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export const useApollo = (): ApolloClient<NormalizedCacheObject> => {
    const store = useMemo(() => initializeApollo(), []);
    return store;
}