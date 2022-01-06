/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FindByIdInput, NodeType } from "./globalTypes";

// ====================================================
// GraphQL query operation: routine
// ====================================================

export interface routine_routine_inputs_standard_tags {
  __typename: "Tag";
  id: string;
  tag: string;
  description: string | null;
  created_at: any;
}

export interface routine_routine_inputs_standard {
  __typename: "Standard";
  id: string;
  default: string | null;
  description: string | null;
  isFile: boolean;
  name: string;
  schema: string;
  tags: routine_routine_inputs_standard_tags[];
}

export interface routine_routine_inputs {
  __typename: "RoutineInputItem";
  id: string;
  standard: routine_routine_inputs_standard;
}

export interface routine_routine_nodes_data_NodeCombine {
  __typename: "NodeCombine";
  id: string;
  from: string[];
  to: string;
}

export interface routine_routine_nodes_data_NodeDecision_decisions_when {
  __typename: "NodeDecisionItemCase";
  id: string;
  condition: string;
}

export interface routine_routine_nodes_data_NodeDecision_decisions {
  __typename: "NodeDecisionItem";
  id: string;
  description: string | null;
  title: string;
  toId: string | null;
  when: (routine_routine_nodes_data_NodeDecision_decisions_when | null)[];
}

export interface routine_routine_nodes_data_NodeDecision {
  __typename: "NodeDecision";
  id: string;
  decisions: routine_routine_nodes_data_NodeDecision_decisions[];
}

export interface routine_routine_nodes_data_NodeEnd {
  __typename: "NodeEnd";
  id: string;
  wasSuccessful: boolean;
}

export interface routine_routine_nodes_data_NodeLoop {
  __typename: "NodeLoop";
  id: string;
}

export interface routine_routine_nodes_data_NodeRoutineList_routines {
  __typename: "NodeRoutineListItem";
}

export interface routine_routine_nodes_data_NodeRoutineList {
  __typename: "NodeRoutineList";
  id: string;
  isOptional: boolean;
  isOrdered: boolean;
  routines: routine_routine_nodes_data_NodeRoutineList_routines[];
}

export interface routine_routine_nodes_data_NodeRedirect {
  __typename: "NodeRedirect";
  id: string;
}

export interface routine_routine_nodes_data_NodeStart {
  __typename: "NodeStart";
  id: string;
}

export type routine_routine_nodes_data = routine_routine_nodes_data_NodeCombine | routine_routine_nodes_data_NodeDecision | routine_routine_nodes_data_NodeEnd | routine_routine_nodes_data_NodeLoop | routine_routine_nodes_data_NodeRoutineList | routine_routine_nodes_data_NodeRedirect | routine_routine_nodes_data_NodeStart;

export interface routine_routine_nodes {
  __typename: "Node";
  id: string;
  created_at: any;
  description: string | null;
  next: string | null;
  previous: string | null;
  title: string;
  type: NodeType;
  updated_at: any;
  data: routine_routine_nodes_data | null;
}

export interface routine_routine_organizations {
  __typename: "Organization";
  id: string;
  name: string;
}

export interface routine_routine_outputs {
  __typename: "RoutineOutputItem";
}

export interface routine_routine_parent {
  __typename: "Routine";
  id: string;
  title: string | null;
}

export interface routine_routine_contextualResources {
  __typename: "Resource";
  id: string;
  title: string;
  description: string | null;
  link: string;
  displayUrl: string | null;
}

export interface routine_routine_externalResources {
  __typename: "Resource";
  id: string;
  title: string;
  description: string | null;
  link: string;
  displayUrl: string | null;
}

export interface routine_routine_tags {
  __typename: "Tag";
  id: string;
  tag: string;
  description: string | null;
  created_at: any;
}

export interface routine_routine_users {
  __typename: "User";
  id: string;
  username: string | null;
}

export interface routine_routine {
  __typename: "Routine";
  id: string;
  created_at: any;
  instructions: string | null;
  isAutomatable: boolean | null;
  title: string | null;
  updated_at: any;
  version: string | null;
  inputs: routine_routine_inputs[];
  nodes: routine_routine_nodes[];
  organizations: routine_routine_organizations[];
  outputs: routine_routine_outputs[];
  parent: routine_routine_parent | null;
  contextualResources: routine_routine_contextualResources[];
  externalResources: routine_routine_externalResources[];
  tags: routine_routine_tags[];
  users: routine_routine_users[];
}

export interface routine {
  routine: routine_routine | null;
}

export interface routineVariables {
  input: FindByIdInput;
}