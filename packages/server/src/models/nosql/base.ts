import { Log } from "./log";

interface PaginatedMongoSearchProps {
    /**
     * Filter results
     */
    findQuery?: { [x: string]: any };
    /**
     * Sort results
     */
    sortQuery?: { [x: string]: any };
    /**
     * Amount of results to return
     */
    take?: number;
    /**
     * Current cursor
     */
    after?: string;
    /**
     * Fields to return
     */
    project?: { [x: string]: any };
    /**
     * Unique fields
     */
    group?: { [x: string]: any };
    /**
     * Often used with group to return all fields
     */
    replaceRoot?: { [x: string]: any };
}

/**
 * Performs a paginated search query using mongoose aggregate.
 * @param findQuery The query to use for the find operation.
 * @param sortQuery The query to use for the sort operation.
 * @param take The number of results to return.
 * @param after The cursor to use for pagination.
 * @param project The projection to use for the find operation (i.e. which fields to return)
 * @param otherQueries Any additional queries to use.
 */
export async function paginatedMongoSearch<ReturnType>({
    findQuery,
    sortQuery,
    take = 10,
    after,
    project,
    group,
    replaceRoot,
}: PaginatedMongoSearchProps): Promise<ReturnType> {
    // Initialize results
    let paginatedResults: any = { pageInfo: { endCursor: null, hasNextPage: false }, edges: [] };
    // Create cursor
    console.log('before aggregate');
    const pipeline: any[] = [];
    if (findQuery) pipeline.push({ $match: findQuery });
    if (sortQuery) pipeline.push({ $sort: sortQuery });
    if (after) pipeline.push({ $skip: parseInt(after) });
    if (take) pipeline.push({ $limit: take + 1 });
    if (project) pipeline.push({ $project: project });
    if (group) pipeline.push({ $group: group });
    if (replaceRoot) pipeline.push({ $replaceRoot: replaceRoot });
    console.log('pipeline', JSON.stringify(pipeline));
    //TODO try catch
    await Log.aggregate(pipeline).cursor({}).eachAsync((log: any) => {
        console.log('in cursor async', JSON.stringify(log))
        if (log) {
            paginatedResults.edges.push({
                // Node is log, except that _id is changed to id
                node: { ...log, id: log._id.toString(), _id: undefined },
                cursor: log._id,
            });
        } else {
            // If there are no more logs, set the endCursor to null
            paginatedResults.pageInfo.endCursor = null;
        }
    }).then(() => {
        console.log('after aggregate');
        // If there are more logs, set the endCursor to the last log's id
        if (paginatedResults.edges.length > take) {
            paginatedResults.pageInfo.endCursor = paginatedResults.edges[paginatedResults.edges.length - 1].cursor;
            paginatedResults.edges.pop();
            paginatedResults.pageInfo.hasNextPage = true;
        }
    });
    console.log('returning paginated results', JSON.stringify(paginatedResults));
    return paginatedResults;
}