// Logs user actions, such as viewing an item, starting/completing a routine, 
// joining/leaving an organization, etc.
import { GraphQLModelType } from '../../models/sql';
import mongoose from 'mongoose';
import { LogSearchInput, LogSortBy } from '../../schema/types';

// TODO ✅ = implemented
export enum LogType {
    Create = 'Create', // Create on object1Type ✅
    Delete = 'Delete', // Delete on object1Type ✅
    OrganizationAddMember = 'OrganizationAddMember', // Added member object2Id to organization object1Id
    OrganizationJoin = 'OrganizationJoin', // Joined organization object1Id
    OrganizationLeave = 'OrganizationLeave', // Left organization object1Id
    OrganizationRemoveMember = 'OrganizationRemoveMember', // Removed member object2Id from organization object1Id
    OrganizationUpdateMember = 'OrganizationUpdateMember', // Updated member object2Id in organization object1Id
    ProjectComplete = 'ProjectComplete', // Completed project
    RoutineCancel = 'RoutineCancel', // Canceled running routine object1Id
    RoutineComplete = 'RoutineComplete', // Finished running routine object1Id ✅
    RoutineStartIncomplete = 'RoutineStartIncomplete', // Started routine object1Id, and it has not been completed yet ✅
    RoutineStartCanceled = 'RoutineStartCanceled', // Started routine object1Id, but it was canceled. This is used to update a RoutineStartIncomplete, rather than creating a new log
    RoutineStartCompleted = 'RoutineStartCompleted', // Started routine object1Id, and it has been completed. This is used to update a RoutineStartIncomplete, rather than creating a new log ✅
    Update = 'Update', // Update on object1Type ✅
}

// Structure of data
const Schema = mongoose.Schema;
const logSchema = new Schema({
    timestamp: {
        type: Date,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: Object.values(LogType),
        required: true,
    },
    object1Type: {
        type: String,
        enum: [
            GraphQLModelType.Organization,
            GraphQLModelType.Project,
            GraphQLModelType.Routine,
            GraphQLModelType.Standard,
            GraphQLModelType.User,
        ],
        required: false,
    },
    object1Id: {
        type: String,
        required: false,
    },
    object2Type: {
        type: String,
        enum: [
            GraphQLModelType.Organization,
            GraphQLModelType.Project,
            GraphQLModelType.Routine,
            GraphQLModelType.Standard,
            GraphQLModelType.User,
        ],
        required: false,
    },
    object2Id: {
        type: String,
        required: false,
    },
    data: {
        type: String,
        required: false,
    },
}, {
    timeseries: {
        timeField: 'timestamp',
        timeGranularity: 'seconds',
    }
});

// Model for logs
export const Log = mongoose.model('Log', logSchema);

// Search for logs
export const logSearcher = () => ({
    defaultSort: LogSortBy.DateCreatedDesc,
    defaultProjection: { _id: 1, timestamp: 1, userId: 1, action: 1 },
    getSortQuery: (sortBy: string): any => {
        return {
            [LogSortBy.DateCreatedAsc]: { timestamp: 1, _id: 1 },
            [LogSortBy.DateCreatedDesc]: { timestamp: -1, _id: 1 },
        }[sortBy]
    },
    getFindQuery(userId: string, input: LogSearchInput): { [x: string]: any } {
        const queries = [
            input.createdTimeFrame ? { timestamp: { $gte: new Date(input.createdTimeFrame.after), $lte: new Date(input.createdTimeFrame.before) } } : undefined,
            input.ids ? { _id: { $in: input.ids } } : undefined,
            input.object1Id ? { object1Id: input.object1Id } : undefined,
            input.object2Id ? { object2Id: input.object2Id } : undefined,
            input.object1Type ? { object1Type: input.object1Type } : undefined,
            input.object2Type ? { object2Type: input.object2Type } : undefined,
            input.action ? { action: input.action } : undefined,
            input.data ? { data: input.data } : undefined,
        ]
        // Combine all the queries
        const existingQueries = queries.filter(q => q);
        if (existingQueries.length > 0) {
            return { $and: [{ userId }, ...existingQueries] };
        } else {
            return { userId };
        }
    },
})