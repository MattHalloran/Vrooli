import { Count, Node, NodeCreateInput, NodeType, NodeUpdateInput } from "../schema/types";
import { CUDInput, CUDResult, deconstructUnion, FormatConverter, relationshipToPrisma, RelationshipTypes, selectHelper, modelToGraphQL, ValidateMutationsInput, GraphQLModelType } from "./base";
import { CustomError } from "../error";
import { CODE, nodeCreate, nodeEndCreate, nodeEndUpdate, nodeLinksCreate, nodeLinksUpdate, loopCreate, loopUpdate, nodeRoutineListCreate, nodeRoutineListItemsCreate, nodeRoutineListItemsUpdate, nodeRoutineListUpdate, nodeTranslationCreate, nodeTranslationUpdate, nodeUpdate, whilesCreate, whilesUpdate, whensCreate, whensUpdate } from "@local/shared";
import { PrismaType } from "types";
import { hasProfanityRecursive } from "../utils/censor";
import { RoutineModel } from "./routine";
import pkg from '@prisma/client';
import { TranslationModel } from "./translation";
const { MemberRole } = pkg;

const MAX_NODES_IN_ROUTINE = 100;

//==============================================================
/* #region Custom Components */
//==============================================================

export const nodeFormatter = (): FormatConverter<Node> => ({
    relationshipMap: {
        '__typename': GraphQLModelType.Node,
        'data': {
            'NodeEnd': GraphQLModelType.NodeEnd,
            'NodeRoutineList': GraphQLModelType.NodeRoutineList,
        },
        'loop': GraphQLModelType.NodeLoop,
        'routine': GraphQLModelType.Routine,
    },
    constructUnions: (data) => {
        let { nodeEnd, nodeRoutineList, ...modified } = data;
        modified.data = nodeEnd ?? nodeRoutineList;
        return modified;
    },
    deconstructUnions: (partial) => {
        console.log('in node deconstructunions')
        let modified = deconstructUnion(partial, 'data', 
        [
            [GraphQLModelType.NodeEnd, 'nodeEnd'],
            [GraphQLModelType.NodeRoutineList, 'nodeRoutineList'],
        ]);
        return modified;
    },
})

export const nodeRoutineListFormatter = (): FormatConverter<Node> => ({
    relationshipMap: {
        'routines': {
            '__typename': GraphQLModelType.NodeRoutineList,
            'routine': GraphQLModelType.Routine,
        },
    },
})

/**
 * Authorization checks
 */
export const nodeVerifier = () => ({
    /**
     * Verify that the user can modify the routine of the node(s)
     */
    async authorizedCheck(userId: string, routineId: string, prisma: PrismaType): Promise<void> {
        let routine = await prisma.routine.findFirst({
            where: {
                AND: [
                    { id: routineId },
                    {
                        OR: [
                            { userId },
                            {
                                organization: {
                                    members: {
                                        some: {
                                            userId,
                                            role: { in: [MemberRole.Owner, MemberRole.Admin] }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        })
        if (!routine) throw new CustomError(CODE.Unauthorized, 'User does not own the routine, or is not an admin of its organization');
    },
    /**
     * Verify that the maximum number of nodes on a routine will not be exceeded
     */
    async maximumCheck(routineId: string, numAdding: number, prisma: PrismaType): Promise<void> {
        // If removing, no need to check
        if (numAdding < 0) return;
        const existingCount = await prisma.routine.findUnique({
            where: { id: routineId },
            include: { _count: { select: { nodes: true } } }
        });
        if ((existingCount?._count.nodes ?? 0) + numAdding > MAX_NODES_IN_ROUTINE) {
            throw new CustomError(CODE.ErrorUnknown, `To prevent performance issues, no more than ${MAX_NODES_IN_ROUTINE} nodes can be added to a routine. If you think this is a mistake, please contact us`);
        }
    },
    profanityCheck(data: NodeCreateInput | NodeUpdateInput): void {
        if (hasProfanityRecursive(data, ['condition', 'description', 'title'])) throw new CustomError(CODE.BannedWord);
    },
})

export const nodeMutater = (prisma: PrismaType, verifier: any) => ({
    /**
     * Add, update, or remove a node relationship from a routine
     */
    async relationshipBuilder(
        userId: string | null,
        routineId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
        relationshipName: string = 'nodes',
    ): Promise<{ [x: string]: any } | undefined> {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by nodes (since they can only be applied to one routine)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName, isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate input, with routine ID added to each update node
        let { create: createMany, update: updateMany, delete: deleteMany } = formattedInput;
        if (updateMany) updateMany = updateMany.map(node => ({ ...node, routineId }));
        await this.validateMutations({ 
            userId, 
            createMany: createMany as NodeCreateInput[], 
            updateMany: updateMany as NodeUpdateInput[], 
            deleteMany: deleteMany?.map(d => d.id) 
        });
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove node link whens from a routine
     */
    relationshipBuilderNodeLinkWhens(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node links (since they can only be applied to one node orchestration)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'whens', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            // Check for valid arguments
            whensCreate.validateSync(formattedInput.create, { abortEarly: false });
            for (const data of formattedInput.create) {
                TranslationModel().profanityCheck(data);
            }
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            // Check for valid arguments
            whensUpdate.validateSync(formattedInput.update, { abortEarly: false });
            for (const data of formattedInput.update) {
                TranslationModel().profanityCheck(data);
            }
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove node link from a node orchestration
     */
    relationshipBuilderNodeLink(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node data (since they can only be applied to one node)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'nodeLinks', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            // Check for valid arguments
            nodeLinksCreate.validateSync(formattedInput.create, { abortEarly: false });
            for (let data of formattedInput.create) {
                // Convert nested relationships
                data.whens = this.relationshipBuilderNodeLinkWhens(userId, data, isAdd);
                let { fromId, toId, ...rest } = data;
                data = {
                    ...rest,
                    from: { connect: { id: data.fromId } },
                    to: { connect: { id: data.toId } },
                };
            }
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            // Check for valid arguments
            nodeLinksUpdate.validateSync(formattedInput.update, { abortEarly: false });
            for (let data of formattedInput.update) {
                // Convert nested relationships
                data.whens = this.relationshipBuilderNodeLinkWhens(userId, data, isAdd);
                let { fromId, toId, ...rest } = data;
                data = {
                    ...rest,
                    from: fromId ? { connect: { id: data.fromId } } : undefined,
                    to: toId ? { connect: { id: data.toId } } : undefined,
                }
            }
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove combine node data from a node
     */
    relationshipBuilderEndNode(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node data (since they can only be applied to one node)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'nodeEnd', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            for (const data of formattedInput.create) {
                // Check for valid arguments
                nodeEndCreate.validateSync(data, { abortEarly: false });
            }
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            for (const data of formattedInput.update) {
                // Check for valid arguments
                nodeEndUpdate.validateSync(data, { abortEarly: false });
            }
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove loop while data from a node
     */
    relationshipBuilderLoopWhiles(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node data (since they can only be applied to one node)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'whiles', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            // Check for valid arguments (censored words must be checked in earlier function)
            whilesCreate.validateSync(formattedInput.create, { abortEarly: false });
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            // Check for valid arguments (censored words must be checked in earlier function)
            whilesUpdate.validateSync(formattedInput.update, { abortEarly: false });
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove loop data from a node
     */
    relationshipBuilderLoop(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node data (since they can only be applied to one node)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'loop', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            for (const data of formattedInput.create) {
                // Check for valid arguments
                loopCreate.validateSync(data, { abortEarly: false });
                // Convert nested relationships
                data.whiles = this.relationshipBuilderLoopWhiles(userId, data, isAdd);
            }
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            for (const data of formattedInput.update) {
                // Check for valid arguments
                loopUpdate.validateSync(data, { abortEarly: false });
                // Convert nested relationships
                data.whiles = this.relationshipBuilderLoopWhiles(userId, data, isAdd);
            }
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove routine list node item data from a node
     */
    relationshipBuilderRoutineListNodeItem(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node data (since they can only be applied to one node)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'routines', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        const routineModel = RoutineModel(prisma);
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            // Check for valid arguments
            nodeRoutineListItemsCreate.validateSync(formattedInput.create, { abortEarly: false });
            for (const data of formattedInput.create) {
                // Convert nested relationships
                data.routines = routineModel.relationshipBuilder(userId, data, isAdd);
            }
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            // Check for valid arguments
            nodeRoutineListItemsUpdate.validateSync(formattedInput.update, { abortEarly: false });
            for (const data of formattedInput.update) {
                // Convert nested relationships
                data.routines = routineModel.relationshipBuilder(userId, data, isAdd);
            }
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * Add, update, or remove routine list node data from a node
     */
    relationshipBuilderRoutineListNode(
        userId: string | null,
        input: { [x: string]: any },
        isAdd: boolean = true,
    ): { [x: string]: any } | undefined {
        // Convert input to Prisma shape
        // Also remove anything that's not an create, update, or delete, as connect/disconnect
        // are not supported by node data (since they can only be applied to one node)
        let formattedInput = relationshipToPrisma({ data: input, relationshipName: 'nodeRoutineList', isAdd, relExcludes: [RelationshipTypes.connect, RelationshipTypes.disconnect] })
        // Validate create
        if (Array.isArray(formattedInput.create)) {
            for (const data of formattedInput.create) {
                // Check for valid arguments
                nodeRoutineListCreate.validateSync(data, { abortEarly: false });
                // Convert nested relationships
                data.routines = this.relationshipBuilderRoutineListNodeItem(userId, data, isAdd);
            }
        }
        // Validate update
        if (Array.isArray(formattedInput.update)) {
            for (const data of formattedInput.update) {
                // Check for valid arguments
                nodeRoutineListUpdate.validateSync(data, { abortEarly: false });
                // Convert nested relationships
                data.routines = this.relationshipBuilderRoutineListNodeItem(userId, data, isAdd);
            }
        }
        return Object.keys(formattedInput).length > 0 ? formattedInput : undefined;
    },
    /**
     * NOTE: Nodes must all be applied to the same routine
     */
    async validateMutations({
        userId, createMany, updateMany, deleteMany
    }: ValidateMutationsInput<NodeCreateInput, NodeUpdateInput>): Promise<void> {
        if (!userId) throw new CustomError(CODE.Unauthorized);
        if ((createMany || updateMany || deleteMany) && !userId) throw new CustomError(CODE.Unauthorized, 'User must be logged in to perform CRUD operations');
        // Make sure every node applies to the same routine
        const routineId = Array.isArray(createMany) && createMany.length > 0
            ? createMany[0].routineId
            : Array.isArray(updateMany) && updateMany.length > 0
                ? updateMany[0].routineId
                : Array.isArray(deleteMany) && deleteMany.length > 0
                    ? deleteMany[0] : null;
        console.log('NODE VALIDATE MUTATIONS ROUTINE ID', routineId, updateMany);
        if (!routineId ||
            createMany?.some(n => n.routineId !== routineId) ||
            updateMany?.some(n => n.routineId !== routineId ||
                deleteMany?.some(n => n !== routineId))) throw new CustomError(CODE.InvalidArgs, 'All nodes must be in the same routine!');
        // Make sure the user has access to the routine
        await verifier.authorizedCheck(userId, routineId, prisma);
        if (createMany) {
            console.log('checking node createMany', createMany);
            createMany.forEach(input => nodeCreate.validateSync(input, { abortEarly: false }));
            createMany.forEach(input => verifier.profanityCheck(input));
            // Check if will pass max nodes (on routine) limit
            await verifier.maxNodesCheck(routineId, (createMany?.length ?? 0) - (deleteMany?.length ?? 0), prisma);
        }
        if (updateMany) {
            console.log('checking node updateMany', updateMany);
            updateMany.forEach(input => nodeUpdate.validateSync(input, { abortEarly: false }));
            updateMany.forEach(input => verifier.profanityCheck(input));
        }
    },
    /**
     * Performs adds, updates, and deletes of nodes. First validates that every action is allowed.
     */
    async cud({ partial, userId, createMany, updateMany, deleteMany }: CUDInput<NodeCreateInput, NodeUpdateInput>): Promise<CUDResult<Node>> {
        await this.validateMutations({ userId, createMany, updateMany, deleteMany });
        /**
         * Helper function for creating create/update Prisma value
         */
        const createData = async (input: NodeCreateInput | NodeUpdateInput): Promise<{ [x: string]: any }> => {
            let nodeData: { [x: string]: any } = {
                columnIndex: input.columnIndex,
                routineId: input.routineId,
                rowIndex: input.rowIndex,
                type: input.type,
                translations: TranslationModel().relationshipBuilder(userId, input, { create: nodeTranslationCreate, update: nodeTranslationUpdate }, false),
            };
            // Create type-specific data, and make sure other types are null
            nodeData.nodeEnd = null;
            nodeData.nodeRoutineList = null;
            switch (input.type) {
                case NodeType.End:
                    if ((input as NodeCreateInput)?.nodeEndCreate) nodeData.nodeEnd = this.relationshipBuilderEndNode(userId, input, true);
                    else if ((input as NodeUpdateInput)?.nodeEndUpdate) nodeData.nodeEnd = this.relationshipBuilderEndNode(userId, input, false);
                    break;
                case NodeType.RoutineList:
                    if ((input as NodeCreateInput).nodeRoutineListCreate) nodeData.nodeRoutineList = this.relationshipBuilderRoutineListNode(userId, input, true);
                    else if ((input as NodeUpdateInput)?.nodeRoutineListUpdate) nodeData.nodeRoutineList = this.relationshipBuilderRoutineListNode(userId, input, false);
                    break;
            }
            if (nodeData.loop) {
                if (input.loopCreate) nodeData.loop = this.relationshipBuilderLoop(userId, input, true);
                else if ((input as NodeUpdateInput)?.loopUpdate) nodeData.loop = this.relationshipBuilderLoop(userId, input, false);
            }
            return nodeData;
        }
        // Perform mutations
        let created: any[] = [], updated: any[] = [], deleted: Count = { count: 0 };
        if (createMany) {
            // Loop through each create input
            for (const input of createMany) {
                // Call createData helper function
                const data = await createData(input);
                // Create object
                const currCreated = await prisma.node.create({ data, ...selectHelper(partial) });
                // Convert to GraphQL
                const converted = modelToGraphQL(currCreated, partial);
                // Add to created array
                created = created ? [...created, converted] : [converted];
            }
        }
        if (updateMany) {
            // Loop through each update input
            for (const input of updateMany) {
                // Call createData helper function
                const data = await createData(input);
                // Update object
                const currUpdated = await prisma.node.update({
                    where: { id: input.id },
                    data,
                    ...selectHelper(partial)
                });
                // Convert to GraphQL
                const converted = modelToGraphQL(currUpdated, partial);
                // Add to updated array
                updated = updated ? [...updated, converted] : [converted];
            }
        }
        if (deleteMany) {
            deleted = await prisma.node.deleteMany({
                where: { id: { in: deleteMany } }
            })
        }
        return {
            created: createMany ? created : undefined,
            updated: updateMany ? updated : undefined,
            deleted: deleteMany ? deleted : undefined,
        };
    },
})

//==============================================================
/* #endregion Custom Components */
//==============================================================

//==============================================================
/* #region Model */
//==============================================================

export function NodeModel(prisma: PrismaType) {
    const prismaObject = prisma.node;
    const format = nodeFormatter();
    const verify = nodeVerifier();
    const mutate = nodeMutater(prisma, verify);

    return {
        prisma,
        prismaObject,
        ...format,
        ...verify,
        ...mutate,
    }
}

//==============================================================
/* #endregion Model */
//==============================================================