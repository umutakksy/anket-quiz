import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'frontend',
  location: 'us-east4'
};

export const createQuizSurveyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuizSurvey', inputVars);
}
createQuizSurveyRef.operationName = 'CreateQuizSurvey';

export function createQuizSurvey(dcOrVars, vars) {
  return executeMutation(createQuizSurveyRef(dcOrVars, vars));
}

export const listPublicQuizSurveysRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicQuizSurveys');
}
listPublicQuizSurveysRef.operationName = 'ListPublicQuizSurveys';

export function listPublicQuizSurveys(dc) {
  return executeQuery(listPublicQuizSurveysRef(dc));
}

export const takeQuizSurveyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TakeQuizSurvey', inputVars);
}
takeQuizSurveyRef.operationName = 'TakeQuizSurvey';

export function takeQuizSurvey(dcOrVars, vars) {
  return executeMutation(takeQuizSurveyRef(dcOrVars, vars));
}

export const getMyAttemptsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyAttempts', inputVars);
}
getMyAttemptsRef.operationName = 'GetMyAttempts';

export function getMyAttempts(dcOrVars, vars) {
  return executeQuery(getMyAttemptsRef(dcOrVars, vars));
}

