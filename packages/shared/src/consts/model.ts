import { ValueOf } from '.';

export const AccountStatus = {
    DELETED: 'Deleted',
    UNLOCKED: 'Unlocked',
    SOFT_LOCKED: 'SoftLock',
    HARD_LOCKED: 'HardLock'
}
export type AccountStatus = ValueOf<typeof AccountStatus>;

export const ROLES = {
    Actor: 'Actor',
    Guest: 'Guest',
}
export type ROLES = ValueOf<typeof ROLES>;

// ============================================================
// Node Types
// ============================================================

export const NODE_TYPES = {
    Combine: 'combine',
    Decision: 'decision',
    End: 'end',
    Loop: 'loop',
    RoutineList: 'list',
    Redirect: 'redirect',
    Start: 'start',
}
export type NODE_TYPES = ValueOf<typeof NODE_TYPES>;

export type COMBINE_NODE_DATA = null // TODO: define combine data

export type DECISION_NODE_DATA = {
    title: string,
    description: string | null,
    decisions: Array<{
        id: string,
        title: string,
        next: string,
        when: Array<any> //TODO: define
    }>
}

export type END_NODE_DATA = {
    title: string,
    description: string | null,
    wasSuccessful: boolean,
}

export type LOOP_NODE_DATA = null; //TODO: define loop data

export type ROUTINE_LIST_NODE_DATA = {
    title: string,
    description: string | null,
    isOrdered: boolean,
    routines: Array<{
        id: string,
        title: string,
        description: string | null,
        isOptional: boolean,
    }>
};

export type REDIRECT_NODE_DATA = null; // Supposed to be null

export type START_NODE_DATA = null; // Supposed to be null

export type NODE_DATA = {
    id: string,
    type: NODE_TYPES,
    previous: string | null,
    next: string | null,
    data: COMBINE_NODE_DATA | DECISION_NODE_DATA | END_NODE_DATA | LOOP_NODE_DATA | ROUTINE_LIST_NODE_DATA | REDIRECT_NODE_DATA | START_NODE_DATA,
}

export type ORCHESTRATION_DATA = {
    title: string,
    description?: string,
    nodes: Array<NODE_DATA>,
}

export const PROJECT_SORT_BY = {
    AlphabeticalAsc: 'AlphabeticalAsc',
    AlphabeticalDesc: 'AlphabeticalDesc',
    CommentsAsc: 'CommentsAsc',
    CommentsDesc: 'CommentsDesc',
    ForksAsc: 'ForksAsc',
    ForksDesc: 'ForksDesc',
    DateCreatedAsc: 'DateCreatedAsc',
    DateCreatedDesc: 'DateCreatedDesc',
    DateUpdatedAsc: 'DateUpdatedAsc',
    DateUpdatedDesc: 'DateUpdatedDesc',
    StarsAsc: 'StarsAsc',
    StarsDesc: 'StarsDesc',
    VotesAsc: 'VotesAsc',
    VotesDesc: 'VotesDesc',
}
export type PROJECT_SORT_BY = ValueOf<typeof PROJECT_SORT_BY>;