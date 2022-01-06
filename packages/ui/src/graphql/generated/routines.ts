/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoutineSearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: routines
// ====================================================

export interface routines_routines_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface routines_routines_edges_node_tags {
  __typename: "Tag";
  id: string;
  tag: string;
  description: string | null;
  created_at: any;
}

export interface routines_routines_edges_node {
  __typename: "Routine";
  id: string;
  version: string | null;
  title: string | null;
  description: string | null;
  created_at: any;
  isAutomatable: boolean | null;
  tags: routines_routines_edges_node_tags[];
}

export interface routines_routines_edges {
  __typename: "RoutineEdge";
  cursor: string;
  node: routines_routines_edges_node;
}

export interface routines_routines {
  __typename: "RoutineSearchResult";
  pageInfo: routines_routines_pageInfo;
  edges: routines_routines_edges[];
}

export interface routines {
  routines: routines_routines;
}

export interface routinesVariables {
  input: RoutineSearchInput;
}