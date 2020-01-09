export const DOMAINS = {
  PDA: process.env.REACT_APP_DOMAIN,
  APP_BUILDER: process.env.REACT_APP_APP_BUILDER_DOMAIN,
};

export const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN;

export const IS_MOCKED_API = process.env.REACT_APP_MOCKED_API === 'true';

export const MOCK_API_DELAY = 800;

export const LOCAL = process.env.REACT_APP_LOCAL === 'true';

export const WIDGET_CODES = {
  taskList: 'taskListWidget',
};

export const SERVICE = {};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};
