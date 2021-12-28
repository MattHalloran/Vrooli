/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrganizationSearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: organizations
// ====================================================

export interface organizations_organizations_pageInfo {
  __typename: "PageInfo";
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface organizations_organizations_edges_node {
  __typename: "Organization";
  id: string;
  name: string;
  description: string | null;
  created_at: any;
}

export interface organizations_organizations_edges {
  __typename: "OrganizationEdge";
  cursor: string;
  node: organizations_organizations_edges_node;
}

export interface organizations_organizations {
  __typename: "OrganizationSearchResult";
  pageInfo: organizations_organizations_pageInfo;
  edges: organizations_organizations_edges[];
}

export interface organizations {
  organizations: organizations_organizations;
}

export interface organizationsVariables {
  input: OrganizationSearchInput;
}
