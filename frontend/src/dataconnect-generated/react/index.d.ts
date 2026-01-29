import { CreateQuizSurveyData, CreateQuizSurveyVariables, ListPublicQuizSurveysData, TakeQuizSurveyData, TakeQuizSurveyVariables, GetMyAttemptsData, GetMyAttemptsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateQuizSurvey(options?: useDataConnectMutationOptions<CreateQuizSurveyData, FirebaseError, CreateQuizSurveyVariables>): UseDataConnectMutationResult<CreateQuizSurveyData, CreateQuizSurveyVariables>;
export function useCreateQuizSurvey(dc: DataConnect, options?: useDataConnectMutationOptions<CreateQuizSurveyData, FirebaseError, CreateQuizSurveyVariables>): UseDataConnectMutationResult<CreateQuizSurveyData, CreateQuizSurveyVariables>;

export function useListPublicQuizSurveys(options?: useDataConnectQueryOptions<ListPublicQuizSurveysData>): UseDataConnectQueryResult<ListPublicQuizSurveysData, undefined>;
export function useListPublicQuizSurveys(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicQuizSurveysData>): UseDataConnectQueryResult<ListPublicQuizSurveysData, undefined>;

export function useTakeQuizSurvey(options?: useDataConnectMutationOptions<TakeQuizSurveyData, FirebaseError, TakeQuizSurveyVariables>): UseDataConnectMutationResult<TakeQuizSurveyData, TakeQuizSurveyVariables>;
export function useTakeQuizSurvey(dc: DataConnect, options?: useDataConnectMutationOptions<TakeQuizSurveyData, FirebaseError, TakeQuizSurveyVariables>): UseDataConnectMutationResult<TakeQuizSurveyData, TakeQuizSurveyVariables>;

export function useGetMyAttempts(vars: GetMyAttemptsVariables, options?: useDataConnectQueryOptions<GetMyAttemptsData>): UseDataConnectQueryResult<GetMyAttemptsData, GetMyAttemptsVariables>;
export function useGetMyAttempts(dc: DataConnect, vars: GetMyAttemptsVariables, options?: useDataConnectQueryOptions<GetMyAttemptsData>): UseDataConnectQueryResult<GetMyAttemptsData, GetMyAttemptsVariables>;
