/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrganizationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: organizationAdd
// ====================================================

export interface organizationAdd_organizationAdd_tags {
  __typename: "Tag";
  id: string;
  tag: string;
  description: string | null;
  created_at: any;
}

export interface organizationAdd_organizationAdd {
  __typename: "Organization";
  id: string;
  name: string;
  description: string | null;
  created_at: any;
  tags: organizationAdd_organizationAdd_tags[];
}

export interface organizationAdd {
  organizationAdd: organizationAdd_organizationAdd;
}

export interface organizationAddVariables {
  input: OrganizationInput;
}