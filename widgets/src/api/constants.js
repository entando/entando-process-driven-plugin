export const DOMAINS = {
  PDA: process.env.REACT_APP_DOMAIN || '',
  APP_BUILDER: process.env.REACT_APP_APP_BUILDER_DOMAIN || '',
};

export const IS_MOCKED_API = process.env.REACT_APP_MOCKED_API === 'true';

export const MOCK_API_DELAY = 800;

export const LOCAL = process.env.REACT_APP_LOCAL === 'true';

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// Inject ur access_token if you are trying to reach the APP-BUILDER API locally
export const TOKENS = {
  APP_BUILDER: '0694821a5bdc2229aac820e8a773669a',
};
