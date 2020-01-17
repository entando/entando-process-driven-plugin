export const DOMAINS = {
  PDA: process.env.REACT_APP_DOMAIN || '',
  APP_BUILDER: process.env.REACT_APP_APP_BUILDER_DOMAIN || '',
};

export const IS_MOCKED_API = process.env.REACT_APP_MOCKED_API === 'true';
export const MOCKED_COMPONENT = process.env.REACT_APP_MOCKED_COMPONENT;

export const MOCK_API_DELAY = 800;

export const LOCAL = process.env.REACT_APP_LOCAL === 'true';

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const TOKENS = {
  APP_BUILDER: '',
};
