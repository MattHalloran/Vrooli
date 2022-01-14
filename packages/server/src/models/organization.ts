import { PrismaType, RecursivePartial } from "../types";
import { Organization, OrganizationCountInput, OrganizationInput, OrganizationSearchInput, OrganizationSortBy, Project, Resource, Routine, Tag, User } from "../schema/types";
import { addCountQueries, addJoinTables, counter, creater, deleter, findByIder, FormatConverter, InfoType, MODEL_TYPES, PaginatedSearchResult, removeCountQueries, removeJoinTables, reporter, searcher, Sortable, updater } from "./base";

//======================================================================================================================
/* #region Type Definitions */
//======================================================================================================================

// Type 1. RelationshipList
export type OrganizationRelationshipList = 'comments' | 'resources' | 'wallets' | 'projects' | 'starredBy' |
    'routines' | 'tags' | 'reports' | 'donationResources';
// Type 2. QueryablePrimitives
export type OrganizationQueryablePrimitives = Omit<Organization, OrganizationRelationshipList>;
// Type 3. AllPrimitives
export type OrganizationAllPrimitives = OrganizationQueryablePrimitives;
// type 4. Database shape
export type OrganizationDB = OrganizationAllPrimitives &
    Pick<Organization, 'comments' | 'wallets' | 'reports'> &
{
    resources: { resource: Resource[] }[],
    donationResources: { resource: Resource[] }[],
    projects: { project: Project[] }[],
    starredBy: { user: User[] }[],
    routines: { routine: Routine[] }[],
    tags: { tag: Tag[] }[],
    _count: { starredBy: number }[],
};

//======================================================================================================================
/* #endregion Type Definitions */
//======================================================================================================================

//==============================================================
/* #region Custom Components */
//==============================================================

/**
 * Component for formatting between graphql and prisma types
 */
 const formatter = (): FormatConverter<Organization, OrganizationDB> => {
    const joinMapper = {
        donationResources: 'resource',
        resources: 'resource',
        projects: 'project',
        starredBy: 'user',
        routines: 'routine',
        tags: 'tag',
    };
    const countMapper = {
        stars: 'starredBy',
    }
    return {
        toDB: (obj: RecursivePartial<Organization>): RecursivePartial<OrganizationDB> => {
            let modified = addJoinTables(obj, joinMapper);
            modified = addCountQueries(modified, countMapper);
            return modified;
        },
        toGraphQL: (obj: RecursivePartial<OrganizationDB>): RecursivePartial<Organization> => {
            let modified = removeJoinTables(obj, joinMapper);
            modified = removeCountQueries(modified, countMapper);
            return modified;
        },
    }
}

/**
 * Component for search filters
 */
const sorter = (): Sortable<OrganizationSortBy> => ({
    defaultSort: OrganizationSortBy.AlphabeticalDesc,
    getSortQuery: (sortBy: string): any => {
        return {
            [OrganizationSortBy.AlphabeticalAsc]: { name: 'asc' },
            [OrganizationSortBy.AlphabeticalDesc]: { name: 'desc' },
            [OrganizationSortBy.CommentsAsc]: { comments: { _count: 'asc' } },
            [OrganizationSortBy.CommentsDesc]: { comments: { _count: 'desc' } },
            [OrganizationSortBy.DateCreatedAsc]: { created_at: 'asc' },
            [OrganizationSortBy.DateCreatedDesc]: { created_at: 'desc' },
            [OrganizationSortBy.DateUpdatedAsc]: { updated_at: 'asc' },
            [OrganizationSortBy.DateUpdatedDesc]: { updated_at: 'desc' },
            [OrganizationSortBy.StarsAsc]: { starredBy: { _count: 'asc' } },
            [OrganizationSortBy.StarsDesc]: { starredBy: { _count: 'desc' } },
            [OrganizationSortBy.VotesAsc]: { votes: { _count: 'asc' } },
            [OrganizationSortBy.VotesDesc]: { votes: { _count: 'desc' } },
        }[sortBy]
    },
    getSearchStringQuery: (searchString: string): any => {
        const insensitive = ({ contains: searchString.trim(), mode: 'insensitive' });
        return ({
            OR: [
                { name: { ...insensitive } },
                { bio: { ...insensitive } },
                { tags: { some: { tag: { tag: { ...insensitive } } } } },
            ]
        })
    }
})

/**
 * Component for searching
 */
 export const organizationSearcher = (
    model: keyof PrismaType, 
    toDB: FormatConverter<Organization, OrganizationDB>['toDB'],
    toGraphQL: FormatConverter<Organization, OrganizationDB>['toGraphQL'],
    sorter: Sortable<any>, 
    prisma?: PrismaType) => ({
    async search(where: { [x: string]: any }, input: OrganizationSearchInput, info: InfoType): Promise<PaginatedSearchResult> {
        // Many-to-many search queries
        const projectIdQuery = input.projectId ? { projects: { some: { projectId: input.projectId } } } : {};
        const routineIdQuery = input.routineId ? { routines: { some: { routineId: input.routineId } } } : {};
        const userIdQuery = input.userId ? { members: { some: { userId: input.userId } } } : {};
        // One-to-many search queries
        const reportIdQuery = input.reportId ? { reports: { some: { id: input.reportId } } } : {};
        const standardIdQuery = input.standardId ? { standards: { some: { id: input.standardId } } } : {};
        const search = searcher<OrganizationSortBy, OrganizationSearchInput, Organization, OrganizationDB>(model, toDB, toGraphQL, sorter, prisma);
        return search.search({...projectIdQuery, ...routineIdQuery, ...userIdQuery, ...reportIdQuery, ...standardIdQuery, ...where}, input, info);
    }
})

//==============================================================
/* #endregion Custom Components */
//==============================================================

//==============================================================
/* #region Model */
//==============================================================

export function OrganizationModel(prisma?: PrismaType) {
    const model = MODEL_TYPES.Organization;
    const format = formatter();
    const sort = sorter();

    return {
        prisma,
        model,
        ...format,
        ...sort,
        ...counter<OrganizationCountInput>(model, prisma),
        ...creater<OrganizationInput, Organization, OrganizationDB>(model, format.toDB, prisma),
        ...deleter(model, prisma),
        ...findByIder<Organization, OrganizationDB>(model, format.toDB, prisma),
        ...reporter(),
        ...organizationSearcher(model, format.toDB, format.toGraphQL, sort, prisma),
        ...updater<OrganizationInput, Organization, OrganizationDB>(model, format.toDB, prisma),
    }
}

//==============================================================
/* #endregion Model */
//==============================================================