import { taskListConfigs } from 'mocks/app-builder/pages';

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

export const PAGES_CONFIG = {
  taskList: {
    frameId: '1',
    pageCode: 'task_list',
    widgetCode: 'pda_task_list',
    configs: taskListConfigs,
  },
};

// Inject ur access_token if you are trying to reach the APP-BUILDER API locally
export const TOKENS = {
  APP_BUILDER: '7129635d98f076c7b89c7e6c2b615aad',
};
