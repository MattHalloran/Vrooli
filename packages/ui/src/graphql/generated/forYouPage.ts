/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ForYouPageInput, RunStatus, MemberRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: forYouPage
// ====================================================

export interface forYouPage_forYouPage_activeRuns_routine_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_activeRuns_routine_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_activeRuns_routine_tags_translations[];
}

export interface forYouPage_forYouPage_activeRuns_routine_translations {
  __typename: "RoutineTranslation";
  id: string;
  language: string;
  description: string | null;
  title: string;
}

export interface forYouPage_forYouPage_activeRuns_routine {
  __typename: "Routine";
  id: string;
  completedAt: any | null;
  complexity: number;
  created_at: any;
  isAutomatable: boolean | null;
  isInternal: boolean | null;
  isComplete: boolean;
  isStarred: boolean;
  isUpvoted: boolean | null;
  role: MemberRole | null;
  score: number;
  simplicity: number;
  stars: number;
  tags: forYouPage_forYouPage_activeRuns_routine_tags[];
  translations: forYouPage_forYouPage_activeRuns_routine_translations[];
  version: string | null;
}

export interface forYouPage_forYouPage_activeRuns {
  __typename: "Run";
  id: string;
  completedComplexity: number;
  pickups: number;
  timeStarted: any | null;
  timeElapsed: number | null;
  timeCompleted: any | null;
  title: string;
  status: RunStatus;
  routine: forYouPage_forYouPage_activeRuns_routine | null;
}

export interface forYouPage_forYouPage_completedRuns_routine_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_completedRuns_routine_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_completedRuns_routine_tags_translations[];
}

export interface forYouPage_forYouPage_completedRuns_routine_translations {
  __typename: "RoutineTranslation";
  id: string;
  language: string;
  description: string | null;
  title: string;
}

export interface forYouPage_forYouPage_completedRuns_routine {
  __typename: "Routine";
  id: string;
  completedAt: any | null;
  complexity: number;
  created_at: any;
  isAutomatable: boolean | null;
  isInternal: boolean | null;
  isComplete: boolean;
  isStarred: boolean;
  isUpvoted: boolean | null;
  role: MemberRole | null;
  score: number;
  simplicity: number;
  stars: number;
  tags: forYouPage_forYouPage_completedRuns_routine_tags[];
  translations: forYouPage_forYouPage_completedRuns_routine_translations[];
  version: string | null;
}

export interface forYouPage_forYouPage_completedRuns {
  __typename: "Run";
  id: string;
  completedComplexity: number;
  pickups: number;
  timeStarted: any | null;
  timeElapsed: number | null;
  timeCompleted: any | null;
  title: string;
  status: RunStatus;
  routine: forYouPage_forYouPage_completedRuns_routine | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Organization_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Organization_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyViewed_to_Organization_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_Organization_translations {
  __typename: "OrganizationTranslation";
  id: string;
  language: string;
  name: string;
  bio: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Organization {
  __typename: "Organization";
  id: string;
  handle: string | null;
  stars: number;
  isStarred: boolean;
  role: MemberRole | null;
  tags: forYouPage_forYouPage_recentlyViewed_to_Organization_tags[];
  translations: forYouPage_forYouPage_recentlyViewed_to_Organization_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_Project_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Project_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyViewed_to_Project_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_Project_translations {
  __typename: "ProjectTranslation";
  id: string;
  language: string;
  name: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Project {
  __typename: "Project";
  id: string;
  handle: string | null;
  role: MemberRole | null;
  score: number;
  stars: number;
  isUpvoted: boolean | null;
  isStarred: boolean;
  tags: forYouPage_forYouPage_recentlyViewed_to_Project_tags[];
  translations: forYouPage_forYouPage_recentlyViewed_to_Project_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_Routine_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Routine_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyViewed_to_Routine_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_Routine_translations {
  __typename: "RoutineTranslation";
  id: string;
  language: string;
  description: string | null;
  title: string;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Routine {
  __typename: "Routine";
  id: string;
  completedAt: any | null;
  complexity: number;
  created_at: any;
  isAutomatable: boolean | null;
  isInternal: boolean | null;
  isComplete: boolean;
  isStarred: boolean;
  isUpvoted: boolean | null;
  role: MemberRole | null;
  score: number;
  simplicity: number;
  stars: number;
  tags: forYouPage_forYouPage_recentlyViewed_to_Routine_tags[];
  translations: forYouPage_forYouPage_recentlyViewed_to_Routine_translations[];
  version: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Standard_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Standard_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyViewed_to_Standard_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_Standard_translations {
  __typename: "StandardTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyViewed_to_Standard {
  __typename: "Standard";
  id: string;
  score: number;
  stars: number;
  isUpvoted: boolean | null;
  isStarred: boolean;
  name: string;
  role: MemberRole | null;
  tags: forYouPage_forYouPage_recentlyViewed_to_Standard_tags[];
  translations: forYouPage_forYouPage_recentlyViewed_to_Standard_translations[];
}

export interface forYouPage_forYouPage_recentlyViewed_to_User {
  __typename: "User";
  id: string;
  handle: string | null;
  name: string;
  stars: number;
  isStarred: boolean;
}

export type forYouPage_forYouPage_recentlyViewed_to = forYouPage_forYouPage_recentlyViewed_to_Organization | forYouPage_forYouPage_recentlyViewed_to_Project | forYouPage_forYouPage_recentlyViewed_to_Routine | forYouPage_forYouPage_recentlyViewed_to_Standard | forYouPage_forYouPage_recentlyViewed_to_User;

export interface forYouPage_forYouPage_recentlyViewed {
  __typename: "View";
  id: string;
  lastViewed: any;
  title: string;
  to: forYouPage_forYouPage_recentlyViewed_to;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Comment {
  __typename: "Comment" | "Tag";
}

export interface forYouPage_forYouPage_recentlyStarred_to_Organization_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Organization_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyStarred_to_Organization_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_Organization_translations {
  __typename: "OrganizationTranslation";
  id: string;
  language: string;
  name: string;
  bio: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Organization {
  __typename: "Organization";
  id: string;
  handle: string | null;
  stars: number;
  isStarred: boolean;
  role: MemberRole | null;
  tags: forYouPage_forYouPage_recentlyStarred_to_Organization_tags[];
  translations: forYouPage_forYouPage_recentlyStarred_to_Organization_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_Project_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Project_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyStarred_to_Project_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_Project_translations {
  __typename: "ProjectTranslation";
  id: string;
  language: string;
  name: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Project {
  __typename: "Project";
  id: string;
  handle: string | null;
  role: MemberRole | null;
  score: number;
  stars: number;
  isUpvoted: boolean | null;
  isStarred: boolean;
  tags: forYouPage_forYouPage_recentlyStarred_to_Project_tags[];
  translations: forYouPage_forYouPage_recentlyStarred_to_Project_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_Routine_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Routine_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyStarred_to_Routine_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_Routine_translations {
  __typename: "RoutineTranslation";
  id: string;
  language: string;
  description: string | null;
  title: string;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Routine {
  __typename: "Routine";
  id: string;
  completedAt: any | null;
  complexity: number;
  created_at: any;
  isAutomatable: boolean | null;
  isInternal: boolean | null;
  isComplete: boolean;
  isStarred: boolean;
  isUpvoted: boolean | null;
  role: MemberRole | null;
  score: number;
  simplicity: number;
  stars: number;
  tags: forYouPage_forYouPage_recentlyStarred_to_Routine_tags[];
  translations: forYouPage_forYouPage_recentlyStarred_to_Routine_translations[];
  version: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Standard_tags_translations {
  __typename: "TagTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Standard_tags {
  __typename: "Tag";
  id: string;
  created_at: any;
  isStarred: boolean;
  stars: number;
  tag: string;
  translations: forYouPage_forYouPage_recentlyStarred_to_Standard_tags_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_Standard_translations {
  __typename: "StandardTranslation";
  id: string;
  language: string;
  description: string | null;
}

export interface forYouPage_forYouPage_recentlyStarred_to_Standard {
  __typename: "Standard";
  id: string;
  score: number;
  stars: number;
  isUpvoted: boolean | null;
  isStarred: boolean;
  name: string;
  role: MemberRole | null;
  tags: forYouPage_forYouPage_recentlyStarred_to_Standard_tags[];
  translations: forYouPage_forYouPage_recentlyStarred_to_Standard_translations[];
}

export interface forYouPage_forYouPage_recentlyStarred_to_User {
  __typename: "User";
  id: string;
  handle: string | null;
  name: string;
  stars: number;
  isStarred: boolean;
}

export type forYouPage_forYouPage_recentlyStarred_to = forYouPage_forYouPage_recentlyStarred_to_Comment | forYouPage_forYouPage_recentlyStarred_to_Organization | forYouPage_forYouPage_recentlyStarred_to_Project | forYouPage_forYouPage_recentlyStarred_to_Routine | forYouPage_forYouPage_recentlyStarred_to_Standard | forYouPage_forYouPage_recentlyStarred_to_User;

export interface forYouPage_forYouPage_recentlyStarred {
  __typename: "Star";
  id: string;
  to: forYouPage_forYouPage_recentlyStarred_to;
}

export interface forYouPage_forYouPage {
  __typename: "ForYouPageResult";
  activeRuns: forYouPage_forYouPage_activeRuns[];
  completedRuns: forYouPage_forYouPage_completedRuns[];
  recentlyViewed: forYouPage_forYouPage_recentlyViewed[];
  recentlyStarred: forYouPage_forYouPage_recentlyStarred[];
}

export interface forYouPage {
  forYouPage: forYouPage_forYouPage;
}

export interface forYouPageVariables {
  input: ForYouPageInput;
}
