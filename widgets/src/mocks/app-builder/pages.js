const taskListConfigs = {
  payload: {
    code: 'pda_task_list',
    config: {
      groups:
        '[{"label":"Administrators","key":"Administrators","checked":true},{"label":"broker","key":"broker","checked":true},{"label":"admin","key":"admin","checked":false},{"label":"rest-all","key":"rest-all","checked":true},{"label":"kiemgmt","key":"kiemgmt","checked":false},{"label":"kie-server","key":"kie-server","checked":true},{"label":"appraiser","key":"appraiser","checked":false},{"label":"manager","key":"manager","checked":true},{"label":"supplier","key":"supplier","checked":true},{"label":"IT","key":"IT","checked":true},{"label":"PM","key":"PM","checked":true},{"label":"approver","key":"approver","checked":true}]',
      options:
        '[{"key":"newPageOnClick","label":"Open new page on table row click","checked":false},{"key":"showClaim","label":"Show Claim Button","checked":true},{"key":"showComplete","label":"Show Complete Button","checked":true}]',
      columns:
        '[{"name":"id","position":0,"isVisible":true},{"name":"name","position":1,"isVisible":true},{"name":"createdBy","position":2,"isVisible":true},{"name":"createdAt","position":3,"isVisible":true},{"name":"dueTo","position":4,"isVisible":true},{"name":"status","position":5,"isVisible":true},{"name":"description","position":6,"isVisible":true},{"name":"owner","position":7,"isVisible":true},{"name":"inputData","position":8,"isVisible":true},{"name":"outputData","position":9,"isVisible":true},{"name":"priority","position":10,"isVisible":true},{"name":"subject","position":11,"isVisible":true},{"name":"type","position":12,"isVisible":true},{"name":"form","position":13,"isVisible":true},{"name":"activatedAt","position":14,"isVisible":true},{"name":"skipable","position":15,"isVisible":true},{"name":"workItemId","position":16,"isVisible":true},{"name":"processId","position":17,"isVisible":true},{"name":"processDefinitionId","position":18,"isVisible":true},{"name":"parentId","position":19,"isVisible":true},{"name":"slaCompliance","position":20,"isVisible":true},{"name":"slaDueTo","position":21,"isVisible":true},{"name":"potentialOwners","position":22,"isVisible":true},{"name":"excludedOwners","position":23,"isVisible":true},{"name":"businessAdmins","position":24,"isVisible":true}]',
      knowledgeSource: 'kieStaging',
      process: 'Mortgage_Process.MortgageApprovalProcess@mortgage-process_1.0.1-SNAPSHOT',
    },
  },
  errors: {},
};

const taskDetailsConfigs = {
  payload: {
    code: 'phase_1_widgets_task_details',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings: {
        hasGeneralInformation: true,
        header: 'taskDetails.overview.title',
      },
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const completionFormConfigs = {
  payload: {
    code: 'phase_1_widgets_completion_form',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings:
        '{"uiSchema":"{\\n  \\"47078d21-7da5-4d3f-8355-0fcd78b09f39\\": {\\n    \\"reason\\": {\\n      \\"ui:widget\\": \\"textarea\\"\\n    },\\n    \\"performance\\": {\\n      \\"ui:widget\\": \\"updown\\"\\n    }\\n  }\\n}"}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const taskCommentsConfigs = {
  payload: {
    code: 'phase_1_widgets_comments',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieDev',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const summaryCardConfigs = {
  payload: {
    code: 'summary_card',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings: '{"type": "requests"}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const processFormConfigs = {
  payload: {
    code: 'phase_1_widgets',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings:
        '{"uiSchema":"{\\n  \\"d1e6dd47-b24c-4f93-ba25-337832926124\\": {\\n    \\"employee\\": {\\n      \\"ui:autofocus\\": true\\n    },\\n    \\"reason\\": {\\n      \\"ui:widget\\": \\"textarea\\"\\n    },\\n    \\"list\\": {},\\n    \\"checkbox\\": {}  }\\n}"}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const overtimeGraphConfigs = {
  payload: {
    code: 'phase_1_mgt_dashboard',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings:
        '{"dataType1": "requests", "dataType2": "cases", "dailyFreqPeriods": 30, "monthlyFreqPeriods": 12, "annualFreqPeriods": 10}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

export default {
  TASK_LIST: taskListConfigs,
  TASK_DETAILS: taskDetailsConfigs,
  COMPLETION_FORM: completionFormConfigs,
  TASK_COMMENTS: taskCommentsConfigs,
  SUMMARY_CARD: summaryCardConfigs,
  PROCESS_FORM: processFormConfigs,
  OVERTIME_GRAPH: overtimeGraphConfigs,
};
