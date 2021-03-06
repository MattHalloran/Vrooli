import { gql } from 'graphql-tag';
import { resourceFields } from 'graphql/fragment';

export const resourceUpdateMutation = gql`
    ${resourceFields}
    mutation resourceUpdate($input: ResourceUpdateInput!) {
        resourceUpdate(input: $input) {
            ...resourceFields
        }
    }
`