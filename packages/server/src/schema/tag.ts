import { gql } from 'apollo-server-express';
import { CODE } from '@local/shared';
import { CustomError } from '../error';
import { PrismaSelect } from '@paljs/plugins';
import { TagModel } from '../models';
import { IWrap, RecursivePartial } from '../types';
import { Count, DeleteManyInput, FindByIdInput, ReportInput, Tag, TagInput, TagsQueryInput, TagVoteInput } from './types';
import { Context } from '../context';
import { GraphQLResolveInfo } from 'graphql';

export const typeDef = gql`

    input TagInput {
        id: ID
    }

    type Tag {
        id: ID!
    }

    input TagsQueryInput {
        first: Int
        skip: Int
    }

    input TagVoteInput {
        id: ID!
        isUpvote: Boolean!
        objectType: String!
        objectId: ID!
    }

    extend type Query {
        tag(input: FindByIdInput!): Tag
        tags(input: TagsQueryInput!): [Tag!]!
        tagsCount: Int!
    }

    extend type Mutation {
        addTag(input: TagInput!): Tag!
        updateTag(input: TagInput!): Tag!
        deleteTags(input: DeleteManyInput!): Count!
        reportTag(input: ReportInput!): Boolean!
        voteTag(input: TagVoteInput!): Boolean!
    }
`

export const resolvers = {
    Query: {
        tag: async (_parent: undefined, { input }: IWrap<FindByIdInput>, { prisma }: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag> | null> => {
            return await TagModel(prisma).findById(input, info);
        },
        tags: async (_parent: undefined, { input }: IWrap<TagsQueryInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag>[]> => {
            throw new CustomError(CODE.NotImplemented);
        },
        tagsCount: async (_parent: undefined, _args: undefined, context: Context, info: GraphQLResolveInfo): Promise<number> => {
            throw new CustomError(CODE.NotImplemented);
        },
    },
    Mutation: {
        /**
         * Add a new tag. Must be unique.
         * @returns Tag object if successful
         */
        addTag: async (_parent: undefined, { input }: IWrap<TagInput>, { prisma, req }: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag>> => {
            // Must be logged in
            if (!req.isLoggedIn) throw new CustomError(CODE.Unauthorized);
            // TODO add more restrictions
            return await TagModel(prisma).create(input, info)
        },
        /**
         * Update tags you've created
         * @returns 
         */
        updateTag: async (_parent: undefined, { input }: IWrap<TagInput>, { prisma, req }: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Tag>> => {
            // Must be logged in
            if (!req.isLoggedIn) throw new CustomError(CODE.Unauthorized);
            // TODO add more restrictions
            return await TagModel(prisma).update(input, info);
        },
        /**
         * Delete tags you've created. Other tags must go through a reporting system
         * @returns 
         */
        deleteTags: async (_parent: undefined, { input }: IWrap<DeleteManyInput>, { prisma, req }: Context, _info: GraphQLResolveInfo): Promise<Count> => {
            // Must be logged in
            if (!req.isLoggedIn) throw new CustomError(CODE.Unauthorized);
            // TODO add more restrictions
            return await TagModel(prisma).deleteMany(input);
        },
        /**
         * Reports a tag. After enough reports, the tag will be deleted.
         * Objects associated with the tag will not be deleted.
         * @returns True if report was successfully recorded
         */
         reportTag: async (_parent: undefined, { input }: IWrap<ReportInput>, { prisma, req }: Context, _info: GraphQLResolveInfo): Promise<boolean> => {
            // Must be logged in
            if (!req.isLoggedIn) throw new CustomError(CODE.Unauthorized);
            return await TagModel(prisma).report(input);
        },
        voteTag: async (_parent: undefined, { input }: IWrap<TagVoteInput>, context: Context, _info: GraphQLResolveInfo): Promise<boolean> => {
            throw new CustomError(CODE.NotImplemented);
        }
    }
}