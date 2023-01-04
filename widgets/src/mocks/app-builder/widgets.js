import MOCKED_WIDGET_CONFIGS from './pages';

const PAGE_CODE = 'dev_env_page';
const TASK_ID = '30@mortgage-process_1.0.0-SNAPSHOT';

export default {
  TASK_LIST: {
    pageCode: PAGE_CODE,
    frameId: '0',
    widgetCode: 'entando_widgets_task_list',
    configs: MOCKED_WIDGET_CONFIGS.TASK_LIST,
  },
  TASK_DETAILS: {
    pageCode: PAGE_CODE,
    taskId: TASK_ID,
    frameId: '1',
    widgetCode: 'entando_widgets_task_details',
    configs: MOCKED_WIDGET_CONFIGS.TASK_DETAILS,
  },
  COMPLETION_FORM: {
    pageCode: PAGE_CODE,
    taskId: TASK_ID,
    frameId: '2',
    widgetCode: 'entando_widgets_completion_form',
    configs: MOCKED_WIDGET_CONFIGS.COMPLETION_FORM,
  },
  TASK_COMMENTS: {
    pageCode: PAGE_CODE,
    taskId: TASK_ID,
    frameId: '3',
    widgetCode: 'entando_widgets_comments',
    configs: MOCKED_WIDGET_CONFIGS.TASK_COMMENTS,
  },
  SUMMARY_CARD: {
    pageCode: PAGE_CODE,
    frameId: '4',
    widgetCode: 'entando_widgets_summary_card',
    configs: MOCKED_WIDGET_CONFIGS.SUMMARY_CARD,
  },
  PROCESS_FORM: {
    pageCode: PAGE_CODE,
    frameId: '5',
    widgetCode: 'entando_widgets_process_form',
    configs: MOCKED_WIDGET_CONFIGS.PROCESS_FORM,
  },
  OVERTIME_GRAPH: {
    pageCode: PAGE_CODE,
    frameId: '6',
    widgetCode: 'entando_widgets_overtime_graph',
    configs: MOCKED_WIDGET_CONFIGS.OVERTIME_GRAPH,
  },
  ATTACHMENTS: {
    pageCode: PAGE_CODE,
    taskId: TASK_ID,
    frameId: '7',
    widgetCode: 'entando_widgets_widgets_attachments',
    configs: MOCKED_WIDGET_CONFIGS.ATTACHMENTS,
  },
  PROCESS_DEFINITION: {
    pageCode: PAGE_CODE,
    taskId: TASK_ID,
    frameId: '8',
    widgetCode: 'entando_widgets_process_definition',
    configs: MOCKED_WIDGET_CONFIGS.PROCESS_DEFINITION,
  },
  PROCESS_LIST: {
    pageCode: PAGE_CODE,
    frameId: '9',
    widgetCode: 'entando_widgets_process_list',
    configs: MOCKED_WIDGET_CONFIGS.PROCESS_LIST,
  },
};
