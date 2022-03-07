/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrganizationUpdateInput, MemberRole } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: organizationUpdate
// ====================================================

export interface organizationUpdate_organizationUpdate_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface organizationUpdate_organizationUpdate_tags {
  __typename: "Tag";
  id: string;
  tag: string;
  translations: organizationUpdate_organizationUpdate_tags_translations[];
}

export interface organizationUpdate_organizationUpdate_translations {
  __typename: "OrganizationTranslation";
  id: string;
  language: string;
  bio: string | null;
  name: string;
}

export interface organizationUpdate_organizationUpdate {
  __typename: "Organization";
  id: string;
  created_at: any;
  isOpenToNewMembers: boolean;
  isStarred: boolean;
  role: MemberRole | null;
  stars: number;
  tags: organizationUpdate_organizationUpdate_tags[];
  translations: organizationUpdate_organizationUpdate_translations[];
}

export interface organizationUpdate {
  organizationUpdate: organizationUpdate_organizationUpdate;
}

export interface organizationUpdateVariables {
  input: OrganizationUpdateInput;
}
