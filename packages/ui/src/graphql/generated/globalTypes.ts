/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum AccountStatus {
  DELETED = "DELETED",
  HARD_LOCKED = "HARD_LOCKED",
  SOFT_LOCKED = "SOFT_LOCKED",
  UNLOCKED = "UNLOCKED",
}

export enum NodeType {
  COMBINE = "COMBINE",
  DECISION = "DECISION",
  END = "END",
  LOOP = "LOOP",
  REDIRECT = "REDIRECT",
  ROUTINE_LIST = "ROUTINE_LIST",
  START = "START",
}

export enum OrganizationSortBy {
  AlphabeticalAsc = "AlphabeticalAsc",
  AlphabeticalDesc = "AlphabeticalDesc",
  CommentsAsc = "CommentsAsc",
  CommentsDesc = "CommentsDesc",
  DateCreatedAsc = "DateCreatedAsc",
  DateCreatedDesc = "DateCreatedDesc",
  DateUpdatedAsc = "DateUpdatedAsc",
  DateUpdatedDesc = "DateUpdatedDesc",
  StarsAsc = "StarsAsc",
  StarsDesc = "StarsDesc",
  VotesAsc = "VotesAsc",
  VotesDesc = "VotesDesc",
}

export enum ProjectSortBy {
  AlphabeticalAsc = "AlphabeticalAsc",
  AlphabeticalDesc = "AlphabeticalDesc",
  CommentsAsc = "CommentsAsc",
  CommentsDesc = "CommentsDesc",
  DateCreatedAsc = "DateCreatedAsc",
  DateCreatedDesc = "DateCreatedDesc",
  DateUpdatedAsc = "DateUpdatedAsc",
  DateUpdatedDesc = "DateUpdatedDesc",
  ForksAsc = "ForksAsc",
  ForksDesc = "ForksDesc",
  StarsAsc = "StarsAsc",
  StarsDesc = "StarsDesc",
  VotesAsc = "VotesAsc",
  VotesDesc = "VotesDesc",
}

export enum ResourceFor {
  Actor = "Actor",
  Organization = "Organization",
  Project = "Project",
  RoutineContextual = "RoutineContextual",
  RoutineDonation = "RoutineDonation",
  RoutineExternal = "RoutineExternal",
}

export enum ResourceSortBy {
  AlphabeticalAsc = "AlphabeticalAsc",
  AlphabeticalDesc = "AlphabeticalDesc",
  CommentsAsc = "CommentsAsc",
  CommentsDesc = "CommentsDesc",
  DateCreatedAsc = "DateCreatedAsc",
  DateCreatedDesc = "DateCreatedDesc",
  DateUpdatedAsc = "DateUpdatedAsc",
  DateUpdatedDesc = "DateUpdatedDesc",
  StarsAsc = "StarsAsc",
  StarsDesc = "StarsDesc",
}

export enum RoutineSortBy {
  AlphabeticalAsc = "AlphabeticalAsc",
  AlphabeticalDesc = "AlphabeticalDesc",
  CommentsAsc = "CommentsAsc",
  CommentsDesc = "CommentsDesc",
  DateCreatedAsc = "DateCreatedAsc",
  DateCreatedDesc = "DateCreatedDesc",
  DateUpdatedAsc = "DateUpdatedAsc",
  DateUpdatedDesc = "DateUpdatedDesc",
  ForksAsc = "ForksAsc",
  ForksDesc = "ForksDesc",
  StarsAsc = "StarsAsc",
  StarsDesc = "StarsDesc",
  VotesAsc = "VotesAsc",
  VotesDesc = "VotesDesc",
}

export enum StandardSortBy {
  AlphabeticalAsc = "AlphabeticalAsc",
  AlphabeticalDesc = "AlphabeticalDesc",
  CommentsAsc = "CommentsAsc",
  CommentsDesc = "CommentsDesc",
  DateCreatedAsc = "DateCreatedAsc",
  DateCreatedDesc = "DateCreatedDesc",
  DateUpdatedAsc = "DateUpdatedAsc",
  DateUpdatedDesc = "DateUpdatedDesc",
  StarsAsc = "StarsAsc",
  StarsDesc = "StarsDesc",
  VotesAsc = "VotesAsc",
  VotesDesc = "VotesDesc",
}

export enum StandardType {
  ARRAY = "ARRAY",
  BOOLEAN = "BOOLEAN",
  FILE = "FILE",
  NUMBER = "NUMBER",
  OBJECT = "OBJECT",
  STRING = "STRING",
  URL = "URL",
}

export enum TagSortBy {
  AlphabeticalAsc = "AlphabeticalAsc",
  AlphabeticalDesc = "AlphabeticalDesc",
  DateCreatedAsc = "DateCreatedAsc",
  DateCreatedDesc = "DateCreatedDesc",
  DateUpdatedAsc = "DateUpdatedAsc",
  DateUpdatedDesc = "DateUpdatedDesc",
  StarsAsc = "StarsAsc",
  StarsDesc = "StarsDesc",
}

export interface CommentInput {
  id?: string | null;
  text?: string | null;
  objectType?: string | null;
  objectId?: string | null;
}

export interface DeleteManyInput {
  ids: string[];
}

export interface DeleteOneInput {
  id: string;
}

export interface EmailInput {
  id?: string | null;
  emailAddress: string;
  receivesAccountUpdates?: boolean | null;
  receivesBusinessUpdates?: boolean | null;
  userId?: string | null;
}

export interface EmailLogInInput {
  email?: string | null;
  password?: string | null;
  verificationCode?: string | null;
}

export interface EmailRequestPasswordChangeInput {
  email: string;
}

export interface EmailResetPasswordInput {
  id: string;
  code: string;
  newPassword: string;
}

export interface EmailSignUpInput {
  username: string;
  pronouns?: string | null;
  email: string;
  theme: string;
  marketingEmails: boolean;
  password: string;
}

export interface FeedbackInput {
  text: string;
  userId?: string | null;
}

export interface FindByIdInput {
  id: string;
}

export interface NodeCombineFromInput {
  id?: string | null;
  combineId?: string | null;
  fromId?: string | null;
}

export interface NodeCombineInput {
  id?: string | null;
  from: NodeCombineFromInput[];
  to?: NodeInput | null;
}

export interface NodeDecisionInput {
  id?: string | null;
  decisions: NodeDecisionItemInput[];
}

export interface NodeDecisionItemCaseInput {
  id?: string | null;
  condition?: string | null;
}

export interface NodeDecisionItemInput {
  id?: string | null;
  title?: string | null;
  when?: (NodeDecisionItemCaseInput | null)[] | null;
}

export interface NodeEndInput {
  id?: string | null;
}

export interface NodeInput {
  id?: string | null;
  routineId?: string | null;
  title?: string | null;
  description?: string | null;
  type?: NodeType | null;
  combineData?: NodeCombineInput | null;
  decisionData?: NodeDecisionInput | null;
  endData?: NodeEndInput | null;
  loopData?: NodeLoopInput | null;
  routineListData?: NodeRoutineListInput | null;
  redirectData?: NodeRedirectInput | null;
  startData?: NodeStartInput | null;
}

export interface NodeLoopInput {
  id?: string | null;
}

export interface NodeRedirectInput {
  id?: string | null;
}

export interface NodeRoutineListInput {
  id?: string | null;
  isOrdered?: boolean | null;
  routines: NodeRoutineListItemInput[];
}

export interface NodeRoutineListItemInput {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  isOptional?: boolean | null;
  listId?: string | null;
  routineId?: string | null;
}

export interface NodeStartInput {
  id?: string | null;
}

export interface OrganizationInput {
  id?: string | null;
  name: string;
  description?: string | null;
  resources?: ResourceInput[] | null;
}

export interface OrganizationSearchInput {
  userId?: number | null;
  ids?: string[] | null;
  sortBy?: OrganizationSortBy | null;
  searchString?: string | null;
  after?: string | null;
  take?: number | null;
}

export interface ProfileUpdateInput {
  data: UserInput;
  currentPassword: string;
  newPassword?: string | null;
}

export interface ProjectInput {
  id?: string | null;
  name: string;
  description?: string | null;
  organizations?: OrganizationInput[] | null;
  users?: UserInput[] | null;
  resources?: ResourceInput[] | null;
}

export interface ProjectSearchInput {
  userId?: number | null;
  ids?: string[] | null;
  sortBy?: ProjectSortBy | null;
  searchString?: string | null;
  after?: string | null;
  take?: number | null;
}

export interface ReportInput {
  id: string;
  reason?: string | null;
}

export interface ResourceInput {
  id?: string | null;
  name: string;
  description?: string | null;
  link: string;
  displayUrl?: string | null;
  createdFor: ResourceFor;
  forId: string;
}

export interface ResourceSearchInput {
  forId?: number | null;
  forType?: ResourceFor | null;
  ids?: string[] | null;
  sortBy?: ResourceSortBy | null;
  searchString?: string | null;
  after?: string | null;
  take?: number | null;
}

export interface RoutineInput {
  id?: string | null;
  version?: string | null;
  title?: string | null;
  description?: string | null;
  instructions?: string | null;
  isAutomatable?: boolean | null;
  inputs?: RoutineInputItemInput[] | null;
  outputs?: RoutineOutputItemInput[] | null;
}

export interface RoutineInputItemInput {
  id?: string | null;
  routineId: string;
  standardId?: string | null;
}

export interface RoutineOutputItemInput {
  id?: string | null;
  routineId: string;
  standardId?: string | null;
}

export interface RoutineSearchInput {
  userId?: number | null;
  ids?: string[] | null;
  sortBy?: RoutineSortBy | null;
  searchString?: string | null;
  after?: string | null;
  take?: number | null;
}

export interface StandardInput {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  type?: StandardType | null;
  schema?: string | null;
  default?: string | null;
  isFile?: boolean | null;
  tags?: TagInput[] | null;
}

export interface StandardSearchInput {
  userId?: number | null;
  ids?: string[] | null;
  sortBy?: StandardSortBy | null;
  searchString?: string | null;
  after?: string | null;
  take?: number | null;
}

export interface TagInput {
  id?: string | null;
}

export interface TagSearchInput {
  userId?: number | null;
  ids?: string[] | null;
  sortBy?: TagSortBy | null;
  searchString?: string | null;
  after?: string | null;
  take?: number | null;
}

export interface TagVoteInput {
  id: string;
  isUpvote: boolean;
  objectType: string;
  objectId: string;
}

export interface UserDeleteInput {
  id: string;
  password: string;
}

export interface UserInput {
  id?: string | null;
  username?: string | null;
  pronouns?: string | null;
  emails?: EmailInput[] | null;
  theme?: string | null;
  status?: AccountStatus | null;
}

export interface VoteInput {
  id: string;
  isUpvote: boolean;
}

export interface WalletCompleteInput {
  publicAddress: string;
  signedMessage: string;
}

export interface WalletInitInput {
  publicAddress: string;
  nonceDescription?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
