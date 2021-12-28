import { Node, NodeDecisionItem, NodeDecisionItemInput, NodeInput } from "schema/types";
import { BaseState, deleter, findByIder, FormatConverter, MODEL_TYPES, updater } from "./base";
import pkg from '@prisma/client';
import { PrismaSelect } from "@paljs/plugins";
import { CustomError } from "../error";
import { CODE } from "@local/shared";
import { onlyPrimitives } from "../utils";
import { RecursivePartial } from "types";
const { NodeType } = pkg;

const MAX_NODES_IN_ROUTINE = 100;

//======================================================================================================================
/* #region Type Definitions */
//======================================================================================================================

// Type 1. RelationshipList
export type NodeRelationshipList = 'dataCombine' | 'dataDecision' | 'dataEnd' | 'dataLoop' |
    'dataRoutineList' | 'dataRedirect' | 'dataStart' | 'previous' | 'next' | 'routine' | 'Previous' | 
    'Next' | 'To' | 'From' | 'DecisionItem';
// Type 2. QueryablePrimitives
export type NodeQueryablePrimitives = Omit<Node, NodeRelationshipList>;
// Type 3. AllPrimitives
export type NodeAllPrimitives = NodeQueryablePrimitives;
// type 4. FullModel
export type NodeFullModel = NodeAllPrimitives &
Pick<Node, 'previous' | 'next' | 'routine' | 'Previous' | 'Next'> &
{
    dataCombine?: { from: Node[], to: Node },
    dataDecision?: NodeDecisionItem[],
    dataEnd?: {}, //TODO
    dataLoop?: {}, //TODO
    dataRoutineList?: {}, //TODO
    dataRedirect?: {}, //TODO
    dataStart?: {}, //TODO
    To: {}[] //TODO
    From: {}[] //TODO
    DecisionItem?: NodeDecisionItem[]
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
 const formatter = (): FormatConverter<Node, NodeFullModel>  => ({
    toDB: (obj: RecursivePartial<Node>): RecursivePartial<NodeFullModel> => ({ ...obj}), //TODO
    toGraphQL: (obj: RecursivePartial<NodeFullModel>): RecursivePartial<Node> => ({ ...obj }) //TODO
})

/**
 * Custom compositional component for creating nodes
 * @param state 
 * @returns 
 */
 const creater = (state: any) => ({
    async createCombineHelper(data: any): Promise<{ dataCombineId: string }> {
        const row = await state.prisma.nodeCombine.create({ data });
        return { dataCombineId: row.id };
    },
    async createDecisionHelper(data: any): Promise<{ dataDecisionId: string }> {
        const row = await state.prisma.nodeDecision.create({ data });
        return { dataDecisionId: row.id };
    },
    async createEndHelper(data: any): Promise<{ dataEndId: string }> {
        const row = await state.prisma.nodeEnd.create({ data });
        return { dataEndId: row.id };
    },
    async createLoopHelper(data: any): Promise<{ dataLoopId: string }> {
        const row = await state.prisma.nodeLoop.create({ data });
        return { dataLoopId: row.id };
    },
    async createRoutineListHelper(data: any): Promise<{ dataRoutineListId: string }> {
        const row = await state.prisma.nodeRoutineList.create({ data });
        return { dataRoutineListId: row.id };
    },
    async createRedirectHelper(data: any): Promise<{ dataRedirectId: string }> {
        const row = await state.prisma.nodeRedirect.create({ data });
        return { dataRedirectId: row.id };
    },
    async createStartHelper(data: any): Promise<{ dataStartId: string }> {
        const row = await state.prisma.nodeStart.create({ data });
        return { dataStartId: row.id };
    },
    async create(data: NodeInput, info: any): Promise<NodeFullModel> {
        // Check if routine ID was provided
        if (!data.routineId) throw new CustomError(CODE.InvalidArgs, 'Routine ID not specified')
        if (!data.type) throw new CustomError(CODE.InvalidArgs, 'Node type not specified')
        // Check if routine has reached max nodes
        const nodeCount = await state.prisma.routine.findUnique({
            where: { id: data.routineId },
            include: { _count: { select: { nodes: true } } }
        });
        if (nodeCount._count.nodes >= MAX_NODES_IN_ROUTINE) throw new CustomError(CODE.MaxNodesReached);
        // Remove relationship data, as they are handled on a case-by-case basis
        let cleanedData = onlyPrimitives(data);
        // Map node type to helper function and correct data field
        const typeMapper: any = {
            [NodeType.COMBINE]: [this.createCombineHelper, 'combineData'],
            [NodeType.DECISION]: [this.createDecisionHelper, 'decisionData'],
            [NodeType.END]: [this.createEndHelper, 'endData'],
            [NodeType.LOOP]: [this.createLoopHelper, 'loopData'],
            [NodeType.ROUTINE_LIST]: [this.createRoutineListHelper, 'routineListData'],
            [NodeType.REDIRECT]: [this.createRedirectHelper, 'redirectData'],
            [NodeType.START]: [this.createStartHelper, 'startData'],
        }
        const mapResult: [any, keyof NodeInput] = typeMapper[data.type];
        // Create type-specific data
        const typeData = await mapResult[0](data[mapResult[1]]);
        // Create base node object
        return await state.prisma.node.create({ 
            data: {
                ...cleanedData,
                ...typeData
            },
            ...(new PrismaSelect(info).value)
        });
    }
})

//==============================================================
/* #endregion Custom Components */
//==============================================================

//==============================================================
/* #region Model */
//==============================================================

export function NodeModel(prisma?: any) {
    let obj: BaseState<Node, NodeFullModel> = {
        prisma,
        model: MODEL_TYPES.Node,
    }
    
    return {
        ...obj,
        ...findByIder<NodeFullModel>(obj),
        ...formatter(),
        ...creater(obj),
        ...updater<NodeInput, NodeFullModel>(obj),
        ...deleter(obj)
    }
}

//==============================================================
/* #endregion Model */
//==============================================================