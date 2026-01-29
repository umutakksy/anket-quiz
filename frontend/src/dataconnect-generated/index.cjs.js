const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createQuizSurveyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateQuizSurvey', inputVars);
}
createQuizSurveyRef.operationName = 'CreateQuizSurvey';
exports.createQuizSurveyRef = createQuizSurveyRef;

exports.createQuizSurvey = function createQuizSurvey(dcOrVars, vars) {
  return executeMutation(createQuizSurveyRef(dcOrVars, vars));
};

const listPublicQuizSurveysRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicQuizSurveys');
}
listPublicQuizSurveysRef.operationName = 'ListPublicQuizSurveys';
exports.listPublicQuizSurveysRef = listPublicQuizSurveysRef;

exports.listPublicQuizSurveys = function listPublicQuizSurveys(dc) {
  return executeQuery(listPublicQuizSurveysRef(dc));
};

const takeQuizSurveyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'TakeQuizSurvey', inputVars);
}
takeQuizSurveyRef.operationName = 'TakeQuizSurvey';
exports.takeQuizSurveyRef = takeQuizSurveyRef;

exports.takeQuizSurvey = function takeQuizSurvey(dcOrVars, vars) {
  return executeMutation(takeQuizSurveyRef(dcOrVars, vars));
};

const getMyAttemptsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyAttempts', inputVars);
}
getMyAttemptsRef.operationName = 'GetMyAttempts';
exports.getMyAttemptsRef = getMyAttemptsRef;

exports.getMyAttempts = function getMyAttempts(dcOrVars, vars) {
  return executeQuery(getMyAttemptsRef(dcOrVars, vars));
};
