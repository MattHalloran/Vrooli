/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: updateUser
// ====================================================

export interface updateUser_updateUser_roles {
  __typename: "Role";
  title: string;
  description: string | null;
}

export interface updateUser_updateUser {
  __typename: "User";
  id: string;
  theme: string;
  roles: updateUser_updateUser_roles[];
}

export interface updateUser {
  updateUser: updateUser_updateUser;
}

export interface updateUserVariables {
  input: UpdateUserInput;
}
