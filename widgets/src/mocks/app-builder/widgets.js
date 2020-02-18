import MOCKED_WIDGET_CONFIGS from 'mocks/app-builder/pages';

export default {
  TASK_LIST: {
    pageCode: 'task_list',
    frameId: '1',
    widgetCode: 'pda_task_list',
    configs: MOCKED_WIDGET_CONFIGS.TASK_LIST,
  },
  TASK_DETAILS: {
    taskId: '290',
    pageCode: 'phase_1_widgets',
    frameId: '4',
    widgetCode: 'phase_1_widgets_task_details',
    configs: MOCKED_WIDGET_CONFIGS.TASK_DETAILS,
  },
  COMPLETION_FORM: {
    taskId: '32',
    pageCode: 'phase_1_widgets',
    frameId: '2',
    widgetCode: 'phase_1_widgets_completion_form',
    configs: MOCKED_WIDGET_CONFIGS.COMPLETION_FORM,
  },
  TASK_COMMENTS: {
    taskId: '32',
    pageCode: 'phase_1_widgets',
    frameId: '5',
    widgetCode: 'phase_1_widgets_comments',
    configs: MOCKED_WIDGET_CONFIGS.TASK_COMMENTS,
  },
  SUMMARY_CARD: {
    pageCode: 'phase_1_widgets',
    frameId: '1',
    widgetCode: 'summary_card',
    configs: MOCKED_WIDGET_CONFIGS.SUMMARY_CARD,
  },
  PROCESS_FORM: {
    pageCode: 'phase_1_widgets',
    frameId: '3',
    widgetCode: 'process_form',
    configs: MOCKED_WIDGET_CONFIGS.PROCESS_FORM,
  },
};
