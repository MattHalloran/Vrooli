import { gql } from 'apollo-server-express';
import { IWrap, RecursivePartial } from '../types';
import { Count, DeleteManyInput, FindByIdInput, Run, RunCancelInput, RunCompleteInput, RunCountInput, RunCreateInput, RunSearchInput, RunSearchResult, RunSortBy, RunStatus, RunStepStatus, RunUpdateInput } from './types';
import { Context } from '../context';
import { GraphQLResolveInfo } from 'graphql';
import { countHelper, createHelper, deleteManyHelper, LogType, readManyHelper, readOneHelper, RunModel, updateHelper } from '../models';
import { rateLimit } from '../rateLimit';

export const typeDef = gql`
    enum RunSortBy {
        DateStartedAsc
        DateStartedDesc
        DateCompletedAsc
        DateCompletedDesc
        DateCreatedAsc
        DateCreatedDesc
        DateUpdatedAsc
        DateUpdatedDesc
    }

    enum RunStatus {
        Scheduled
        InProgress
        Completed
        Failed
        Cancelled
    }

    enum RunStepStatus {
        InProgress
        Completed
        Skipped
    }

    type Run {
        id: ID!
        completedComplexity: Int!
        contextSwitches: Int!
        timeStarted: Date
        timeElapsed: Int
        timeCompleted: Date
        title: String!
        status: RunStatus!
        routine: Routine
        steps: [RunStep!]!
        user: User!
    }

    type RunStep {
        id: ID!
        order: Int!
        contextSwitches: Int!
        timeStarted: Date
        timeElapsed: Int
        timeCompleted: Date
        title: String!
        status: RunStepStatus!
        step: [Int!]!
        run: Run!
        node: Node
        subroutine: Routine
    }

    input RunSearchInput {
        after: String
        createdTimeFrame: TimeFrame
        startedTimeFrame: TimeFrame
        completedTimeFrame: TimeFrame
        excludeIds: [ID!]
        ids: [ID!]
        status: RunStatus
        routineId: ID
        searchString: String
        sortBy: RunSortBy
        take: Int
        updatedTimeFrame: TimeFrame
    }

    # Return type for search result
    type RunSearchResult {
        pageInfo: PageInfo!
        edges: [RunEdge!]!
    }

    # Return type for search result edge
    type RunEdge {
        cursor: String!
        node: Run!
    }

    # Input for count
    input RunCountInput {
        createdTimeFrame: TimeFrame
        updatedTimeFrame: TimeFrame
    }

    input RunCreateInput {
        id: ID!
        routineId: ID!
        title: String!
        version: String!
        stepsCreate: [RunStepCreateInput!]
        # If scheduling info provided, not starting immediately
        # TODO
    }

    input RunUpdateInput {
        id: ID!
        completedComplexity: Int # Total completed complexity, including what was completed before this update
        contextSwitches: Int # Total contextSwitches, including what was completed before this update
        timeElapsed: Int # Total time elapsed, including what was completed before this update
        stepsDelete: [ID!]
        stepsCreate: [RunStepCreateInput!]
        stepsUpdate: [RunStepUpdateInput!]
    }

    input RunStepCreateInput {
        id: ID!
        nodeId: ID
        contextSwitches: Int
        subroutineId: ID
        order: Int!
        step: [Int!]!
        timeElapsed: Int
        title: String!
    }

    input RunStepUpdateInput {
        id: ID!
        contextSwitches: Int
        status: RunStepStatus
        timeElapsed: Int
    }

    input RunCompleteInput {
        id: ID! # Run ID if "exists" is true, or routine ID if "exists" is false
        completedComplexity: Int # Even though the run was completed, the user may not have completed every subroutine
        exists: Boolean # If true, run ID is provided, otherwise routine ID so we can create a run
        title: String! # Title of routine, so run name stays consistent even if routine updates/deletes
        finalStepCreate: RunStepCreateInput
        finalStepUpdate: RunStepUpdateInput
        version: String! # Version of routine which was ran
        wasSuccessful: Boolean
    }

    input RunCancelInput {
        id: ID!
    }

    extend type Query {
        run(input: FindByIdInput!): Run
        runs(input: RunSearchInput!): RunSearchResult!
        runsCount(input: RunCountInput!): Int!
    }

    extend type Mutation {
        runCreate(input: RunCreateInput!): Run!
        runUpdate(input: RunUpdateInput!): Run!
        runDeleteAll: Count!
        runDeleteMany(input: DeleteManyInput!): Count!
        runComplete(input: RunCompleteInput!): Run!
        runCancel(input: RunCancelInput!): Run!
    }
`

export const resolvers = {
    RunSortBy: RunSortBy,
    RunStatus: RunStatus,
    RunStepStatus: RunStepStatus,
    Query: {
        run: async (_parent: undefined, { input }: IWrap<FindByIdInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Run>> => {
            await rateLimit({ context, info, max: 1000 });
            return readOneHelper(context.req.userId, input, info, RunModel(context.prisma));
        },
        runs: async (_parent: undefined, { input }: IWrap<RunSearchInput>, context: Context, info: GraphQLResolveInfo): Promise<RunSearchResult> => {
            await rateLimit({ context, info, max: 1000 });
            return readManyHelper(context.req.userId, input, info, RunModel(context.prisma));
        },
        runsCount: async (_parent: undefined, { input }: IWrap<RunCountInput>, context: Context, info: GraphQLResolveInfo): Promise<number> => {
            await rateLimit({ context, info, max: 1000 });
            return countHelper(input, RunModel(context.prisma));
        },
    },
    Mutation: {
        runCreate: async (_parent: undefined, { input }: IWrap<RunCreateInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Run>> => {
            await rateLimit({ context, info, max: 1000, byAccount: true });
            return createHelper(context.req.userId, input, info, RunModel(context.prisma));
        },
        runUpdate: async (_parent: undefined, { input }: IWrap<RunUpdateInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Run>> => {
            await rateLimit({ context, info, max: 1000, byAccount: true });
            return updateHelper(context.req.userId, input, info, RunModel(context.prisma));
        },
        runDeleteAll: async (_parent: undefined, _input: undefined, context: Context, info: GraphQLResolveInfo): Promise<Count> => {
            await rateLimit({ context, info, max: 25, byAccount: true });
            return RunModel(context.prisma).deleteAll(context.req.userId ?? '');
        },
        runDeleteMany: async (_parent: undefined, { input }: IWrap<DeleteManyInput>, context: Context, info: GraphQLResolveInfo): Promise<Count> => {
            await rateLimit({ context, info, max: 100, byAccount: true });
            return deleteManyHelper(context.req.userId, input, RunModel(context.prisma));
        },
        runComplete: async (_parent: undefined, { input }: IWrap<RunCompleteInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Run>> => {
            await rateLimit({ context, info, max: 1000, byAccount: true });
            return RunModel(context.prisma).complete(context.req.userId ?? '', input, info);
        },
        runCancel: async (_parent: undefined, { input }: IWrap<RunCancelInput>, context: Context, info: GraphQLResolveInfo): Promise<RecursivePartial<Run>> => {
            await rateLimit({ context, info, max: 1000, byAccount: true });
            return RunModel(context.prisma).cancel(context.req.userId ?? '', input, info);
        },
    }
}