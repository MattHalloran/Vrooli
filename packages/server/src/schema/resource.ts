import { gql } from 'apollo-server-express';
import { countHelper, createHelper, deleteManyHelper, readManyHelper, readOneHelper, ResourceModel, updateHelper } from '../models';
import { IWrap, RecursivePartial } from 'types';
import { Count, DeleteManyInput, FindByIdInput, Resource, ResourceCountInput, ResourceCreateInput, ResourceUpdateInput, ResourceSearchInput, ResourceSearchResult, ResourceFor, ResourceSortBy, ResourceUsedFor } from './types';
import { Context } from '../context';
import { GraphQLResolveInfo } from 'graphql';
import { rateLimit } from '../rateLimit';

export const typeDef = gql`
    enum ResourceFor {
        Organization
        Project
        Routine
        User
    }

    enum ResourceSortBy {
        DateCreatedAsc
        DateCreatedDesc
        DateUpdatedAsc
        DateUpdatedDesc
        IndexAsc
        IndexDesc
    }

    enum ResourceUsedFor {
        Community
        Context
        Developer
        Donation
        ExternalService
        Feed
        Install
        Learning
        Notes
        OfficialWebsite
        Proposal
        Related
        Researching
        Scheduling
        Social
        Tutorial
    }

    input ResourceCreateInput {
        id: ID!
        listId: ID!
        index: Int
        link: String!
        translationsCreate: [ResourceTranslationCreateInput!]
        usedFor: ResourceUsedFor!
    }
    input ResourceUpdateInput {
        id: ID!
        listId: ID
        index: Int
        link: String
        translationsDelete: [ID!]
        translationsCreate: [ResourceTranslationCreateInput!]
        translationsUpdate: [ResourceTranslationUpdateInput!]
        usedFor: ResourceUsedFor
    }
    type Resource {
        id: ID!
        created_at: Date!
        updated_at: Date!
        listId: ID!
        index: Int
        link: String!
        translations: [ResourceTranslation!]!
        usedFor: ResourceUsedFor
    }

    input ResourceTranslationCreateInput {
        id: ID!
        language: String!
        description: String
        title: String
    }
    input ResourceTranslationUpdateInput {
        id: ID!
        language: String
        description: String
        title: String
    }
    type ResourceTranslation {
        id: ID!
        language: String!
        description: String
        title: String
    }

    input ResourceSearchInput {
        forId: ID
        forType: ResourceFor
        ids: [ID!]
        languages: [String!]
        sortBy: ResourceSortBy
        createdTimeFrame: TimeFrame
        updatedTimeFrame: TimeFrame
        searchString: String
        after: String
        take: Int
    }

    # Return type for search result
    type ResourceSearchResult {
        pageInfo: PageInfo!
        edges: [ResourceEdge!]!
    }

    # Return type for search result edge
    type ResourceEdge {
        cursor: String!
        node: Resource!
    }

    # Input for count
    input ResourceCountInput {
        createdTimeFrame: TimeFrame
        updatedTimeFrame: TimeFrame
    }

    extend type Query {
        resource(input: FindByIdInput!): Resource
        resources(input: ResourceSearchInput!): ResourceSearchResult!
        resourcesCount(input: ResourceCountInput!): Int!
    }

    extend type Mutation {
        resourceCreate(input: ResourceCreateInput!): Resource!
        resourceUpdate(input: ResourceUpdateInput!): Resource!
        resourceDeleteMany(input: DeleteManyInput!): Count!
    }
`

export const resolvers = {
    ResourceFor: ResourceFor,
    ResourceSortBy: ResourceSortBy,
    ResourceUsedFor: ResourceUsedFor,
    Query: {
        resource: async (_parent: undefined, { input }: IWrap<FindByIdInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Resource> | null> => {
            await rateLimit({ context, info, max: 1000 });
            return readOneHelper(context.req.userId, input, info, ResourceModel(context.prisma));
        },
        resources: async (_parent: undefined, { input }: IWrap<ResourceSearchInput>, context: Context, info: GraphQLResolveInfo): Promise<ResourceSearchResult> => {
            await rateLimit({ context, info, max: 1000 });
            return readManyHelper(context.req.userId, input, info, ResourceModel(context.prisma));
        },
        resourcesCount: async (_parent: undefined, { input }: IWrap<ResourceCountInput>, context: Context, info: GraphQLResolveInfo): Promise<number> => {
            await rateLimit({ context, info, max: 1000 });
            return countHelper(input, ResourceModel(context.prisma));
        },
    },
    Mutation: {
        resourceCreate: async (_parent: undefined, { input }: IWrap<ResourceCreateInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Resource>> => {
            await rateLimit({ context, info, max: 500, byAccount: true });
            return createHelper(context.req.userId, input, info, ResourceModel(context.prisma));
        },
        resourceUpdate: async (_parent: undefined, { input }: IWrap<ResourceUpdateInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Resource>> => {
            await rateLimit({ context, info, max: 1000, byAccount: true });
            return updateHelper(context.req.userId, input, info, ResourceModel(context.prisma));
        },
        resourceDeleteMany: async (_parent: undefined, { input }: IWrap<DeleteManyInput>, context: Context, info: GraphQLResolveInfo): Promise<Count> => {
            await rateLimit({ context, info, max: 500, byAccount: true });
            return deleteManyHelper(context.req.userId, input, ResourceModel(context.prisma));
        },
    }
}