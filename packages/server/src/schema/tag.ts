import { gql } from 'apollo-server-express';
import { TagSortBy } from '@local/shared';
import { countHelper, createHelper, deleteManyHelper, readManyHelper, readOneHelper, TagModel, updateHelper } from '../models';
import { IWrap, RecursivePartial } from '../types';
import { Count, DeleteManyInput, FindByIdInput, Tag, TagCountInput, TagCreateInput, TagUpdateInput, TagSearchInput, TagSearchResult } from './types';
import { Context } from '../context';
import { GraphQLResolveInfo } from 'graphql';

export const typeDef = gql`
    enum TagSortBy {
        AlphabeticalAsc
        AlphabeticalDesc
        DateCreatedAsc
        DateCreatedDesc
        DateUpdatedAsc
        DateUpdatedDesc
        StarsAsc
        StarsDesc
    }

    input TagCreateInput {
        anonymous: Boolean
        tag: String!
        translationsCreate: [TagTranslationCreateInput!]
    }
    input TagUpdateInput {
        id: ID!
        anonymous: Boolean
        tag: String
        translationsDelete: [ID!]
        translationsCreate: [TagTranslationCreateInput!]
        translationsUpdate: [TagTranslationUpdateInput!]
    }

    type Tag {
        id: ID!
        tag: String!
        created_at: Date!
        updated_at: Date!
        stars: Int!
        isStarred: Boolean!
        isOwn: Boolean!
        starredBy: [User!]!
        translations: [TagTranslation!]!
    }

    input TagTranslationCreateInput {
        language: String!
        description: String
    }
    input TagTranslationUpdateInput {
        id: ID!
        language: String
        description: String
    }
    type TagTranslation {
        id: ID!
        language: String!
        description: String
    }

    # Wraps tag with hidden/blurred option
    type TagHidden {
        isBlur: Boolean!
        tag: Tag!
    }

    input TagSearchInput {
        after: String
        createdTimeFrame: TimeFrame
        hidden: Boolean
        ids: [ID!]
        languages: [String!]
        minStars: Int
        myTags: Boolean
        searchString: String
        sortBy: TagSortBy
        take: Int
        updatedTimeFrame: TimeFrame
    }

    # Return type for search result
    type TagSearchResult {
        pageInfo: PageInfo!
        edges: [TagEdge!]!
    }

    # Return type for search result edge
    type TagEdge {
        cursor: String!
        node: Tag!
    }

    # Input for count
    input TagCountInput {
        createdTimeFrame: TimeFrame
        updatedTimeFrame: TimeFrame
    }

    extend type Query {
        tag(input: FindByIdInput!): Tag
        tags(input: TagSearchInput!): TagSearchResult!
        tagsCount(input: TagCountInput!): Int!
    }

    extend type Mutation {
        tagCreate(input: TagCreateInput!): Tag!
        tagUpdate(input: TagUpdateInput!): Tag!
        tagDeleteMany(input: DeleteManyInput!): Count!
    }
`

export const resolvers = {
    TagSortBy: TagSortBy,
    Query: {
        tag: async (_parent: undefined, { input }: IWrap<FindByIdInput>, { prisma, req }: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag> | null> => {
            return readOneHelper(req.userId, input, info, TagModel(prisma));
        },
        tags: async (_parent: undefined, { input }: IWrap<TagSearchInput>, { prisma, req }: Context, info: GraphQLResolveInfo): Promise<TagSearchResult> => {
            return readManyHelper(req.userId, input, info, TagModel(prisma));
        },
        tagsCount: async (_parent: undefined, { input }: IWrap<TagCountInput>, { prisma }: Context, _info: GraphQLResolveInfo): Promise<number> => {
            return countHelper(input, TagModel(prisma));
        },
    },
    Mutation: {
        /**
         * Create a new tag. Must be unique.
         * @returns Tag object if successful
         */
        tagCreate: async (_parent: undefined, { input }: IWrap<TagCreateInput>, { prisma, req }: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag>> => {
            return createHelper(req.userId, input, info, TagModel(prisma));
        },
        /**
         * Update tags you've created
         * @returns 
         */
        tagUpdate: async (_parent: undefined, { input }: IWrap<TagUpdateInput>, { prisma, req }: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag>> => {
            return updateHelper(req.userId, input, info, TagModel(prisma));
        },
        /**
         * Delete tags you've created. Other tags must go through a reporting system
         * @returns 
         */
        tagDeleteMany: async (_parent: undefined, { input }: IWrap<DeleteManyInput>, { prisma, req }: Context, _info: GraphQLResolveInfo): Promise<Count> => {
            return deleteManyHelper(req.userId, input, TagModel(prisma));
        },
    }
}