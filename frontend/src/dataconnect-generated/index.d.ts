import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Attempt_Key {
  id: UUIDString;
  __typename?: 'Attempt_Key';
}

export interface CreateQuizSurveyData {
  quizSurvey_insert: QuizSurvey_Key;
}

export interface CreateQuizSurveyVariables {
  title: string;
  type: string;
  isPublic: boolean;
  creatorId: UUIDString;
  createdAt: TimestampString;
}

export interface GetMyAttemptsData {
  attempts: ({
    id: UUIDString;
    quizSurvey?: {
      title: string;
    };
      completedAt: TimestampString;
      isPassed?: boolean | null;
      score?: number | null;
  } & Attempt_Key)[];
}

export interface GetMyAttemptsVariables {
  userId: UUIDString;
}

export interface ListPublicQuizSurveysData {
  quizSurveys: ({
    id: UUIDString;
    title: string;
    description?: string | null;
  } & QuizSurvey_Key)[];
}

export interface Option_Key {
  id: UUIDString;
  __typename?: 'Option_Key';
}

export interface Question_Key {
  id: UUIDString;
  __typename?: 'Question_Key';
}

export interface QuizSurvey_Key {
  id: UUIDString;
  __typename?: 'QuizSurvey_Key';
}

export interface Response_Key {
  id: UUIDString;
  __typename?: 'Response_Key';
}

export interface TakeQuizSurveyData {
  attempt_insert: Attempt_Key;
}

export interface TakeQuizSurveyVariables {
  quizSurveyId: UUIDString;
  userId: UUIDString;
  startedAt: TimestampString;
  completedAt: TimestampString;
  isPassed: boolean;
  score: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateQuizSurveyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateQuizSurveyVariables): MutationRef<CreateQuizSurveyData, CreateQuizSurveyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateQuizSurveyVariables): MutationRef<CreateQuizSurveyData, CreateQuizSurveyVariables>;
  operationName: string;
}
export const createQuizSurveyRef: CreateQuizSurveyRef;

export function createQuizSurvey(vars: CreateQuizSurveyVariables): MutationPromise<CreateQuizSurveyData, CreateQuizSurveyVariables>;
export function createQuizSurvey(dc: DataConnect, vars: CreateQuizSurveyVariables): MutationPromise<CreateQuizSurveyData, CreateQuizSurveyVariables>;

interface ListPublicQuizSurveysRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicQuizSurveysData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicQuizSurveysData, undefined>;
  operationName: string;
}
export const listPublicQuizSurveysRef: ListPublicQuizSurveysRef;

export function listPublicQuizSurveys(): QueryPromise<ListPublicQuizSurveysData, undefined>;
export function listPublicQuizSurveys(dc: DataConnect): QueryPromise<ListPublicQuizSurveysData, undefined>;

interface TakeQuizSurveyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: TakeQuizSurveyVariables): MutationRef<TakeQuizSurveyData, TakeQuizSurveyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: TakeQuizSurveyVariables): MutationRef<TakeQuizSurveyData, TakeQuizSurveyVariables>;
  operationName: string;
}
export const takeQuizSurveyRef: TakeQuizSurveyRef;

export function takeQuizSurvey(vars: TakeQuizSurveyVariables): MutationPromise<TakeQuizSurveyData, TakeQuizSurveyVariables>;
export function takeQuizSurvey(dc: DataConnect, vars: TakeQuizSurveyVariables): MutationPromise<TakeQuizSurveyData, TakeQuizSurveyVariables>;

interface GetMyAttemptsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyAttemptsVariables): QueryRef<GetMyAttemptsData, GetMyAttemptsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyAttemptsVariables): QueryRef<GetMyAttemptsData, GetMyAttemptsVariables>;
  operationName: string;
}
export const getMyAttemptsRef: GetMyAttemptsRef;

export function getMyAttempts(vars: GetMyAttemptsVariables): QueryPromise<GetMyAttemptsData, GetMyAttemptsVariables>;
export function getMyAttempts(dc: DataConnect, vars: GetMyAttemptsVariables): QueryPromise<GetMyAttemptsData, GetMyAttemptsVariables>;

