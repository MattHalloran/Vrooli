/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: sessionFields
// ====================================================

export interface sessionFields_roles {
  __typename: "Role";
  title: string;
  description: string | null;
}

export interface sessionFields {
  __typename: "User";
  id: string;
  theme: string;
  roles: sessionFields_roles[];
}
