import { Organization, Project, ProjectInput, ProjectSearchInput, ProjectSortBy, Resource, Tag, User } from "../schema/types";
import { BaseState, creater, deleter, findByIder, FormatConverter, MODEL_TYPES, reporter, searcher, Sortable, updater } from "./base";

//======================================================================================================================
/* #region Type Definitions */
//======================================================================================================================

// Type 1. RelationshipList
export type ProjectRelationshipList = 'resources' | 'wallets' | 'users' | 'organizations' | 'starredBy' |
    'parent' | 'forks' | 'reports' | 'tags' | 'comments';
// Type 2. QueryablePrimitives
export type ProjectQueryablePrimitives = Omit<Project, ProjectRelationshipList>;
// Type 3. AllPrimitives
export type ProjectAllPrimitives = ProjectQueryablePrimitives;
// type 4. FullModel
export type ProjectFullModel = ProjectAllPrimitives &
    Pick<Project, 'wallets' | 'reports' | 'comments'> &
{
    resources: { resource: Resource[] }[],
    users: { user: User[] }[],
    organizations: { organization: Organization[] }[],
    starredBy: { user: User[] }[],
    parent: { project: Project[] }[],
    forks: { project: Project[] }[],
    tags: { tag: Tag[] }[],
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
const formatter = (): FormatConverter<any, any> => ({
    toDB: (obj: any): any => ({ ...obj }),
    toGraphQL: (obj: any): any => ({ ...obj })
})

/**
 * Component for search filters
 */
const sorter = (): Sortable<ProjectSortBy> => ({
    defaultSort: ProjectSortBy.DateUpdatedDesc,
    getSortQuery: (sortBy: string): any => {
        return {
            [ProjectSortBy.AlphabeticalAsc]: { name: 'asc' },
            [ProjectSortBy.AlphabeticalDesc]: { name: 'desc' },
            [ProjectSortBy.CommentsAsc]: { comments: { count: 'asc' } },
            [ProjectSortBy.CommentsDesc]: { comments: { count: 'desc' } },
            [ProjectSortBy.ForksAsc]: { forks: { count: 'asc' } },
            [ProjectSortBy.ForksDesc]: { forks: { count: 'desc' } },
            [ProjectSortBy.DateCreatedAsc]: { created_at: 'asc' },
            [ProjectSortBy.DateCreatedDesc]: { created_at: 'desc' },
            [ProjectSortBy.DateUpdatedAsc]: { updated_at: 'asc' },
            [ProjectSortBy.DateUpdatedDesc]: { updated_at: 'desc' },
            [ProjectSortBy.StarsAsc]: { stars: { count: 'asc' } },
            [ProjectSortBy.StarsDesc]: { stars: { count: 'desc' } },
            [ProjectSortBy.VotesAsc]: { votes: { count: 'asc' } },
            [ProjectSortBy.VotesDesc]: { votes: { count: 'desc' } },
        }[sortBy]
    },
    getSearchStringQuery: (searchString: string): any => {
        const insensitive = ({ contains: searchString.trim(), mode: 'insensitive' });
        return ({
            OR: [
                { name: { ...insensitive } },
                { description: { ...insensitive } },
                { tags: { tag: { name: { ...insensitive } } } },
            ]
        })
    }
})

//==============================================================
/* #endregion Custom Components */
//==============================================================

//==============================================================
/* #region Model */
//==============================================================

export function ProjectModel(prisma?: any) {
    let obj: BaseState<Project, ProjectFullModel> = {
        prisma,
        model: MODEL_TYPES.Project,
        formatter: formatter(),
        sorter: sorter(),
    }

    return {
        ...obj,
        ...creater<ProjectInput, ProjectFullModel>(obj),
        ...deleter(obj),
        ...findByIder<ProjectFullModel>(obj),
        ...formatter(),
        ...reporter(),
        ...searcher<ProjectSortBy, ProjectSearchInput, Project, ProjectFullModel>(obj),
        ...sorter(),
        ...updater<ProjectInput, ProjectFullModel>(obj),
    }
}

//==============================================================
/* #endregion Model */
//==============================================================