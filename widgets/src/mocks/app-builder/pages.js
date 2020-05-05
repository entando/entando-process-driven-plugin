const taskListConfigs = {
  payload: {
    code: 'entando_widgets_task_list',
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
    code: 'entando_widgets_task_details',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings:
        '{"header":"taskDetails.overview.detailsTitle","hasGeneralInformation":true,"destinationPageCode":"pda_task_details"}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const completionFormConfigs = {
  payload: {
    code: 'entando_widgets_completion_form',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings:
        '{"uiSchema":"{"_sliderInteger":{"ui:widget":"range","ui:options":{}},"_multipleSelector":{"ui:widget":"select","ui:options":{}},"_bigText":{"ui:widget":"textarea","ui:options":{"rows":3}},"__unbound_field_field_62054":{"ui:widget":"range","ui:options":{}},"_processList":{"ui:widget":"select","ui:options":{}},"_radioWithDefault":{"ui:widget":"radio","ui:options":{}},"_radioWithoutDefault":{"ui:widget":"radio","ui:options":{}},"_customObject":{"myDateTime":{"ui:options":{"size":6}},"myBoolean":{"ui:widget":"radio","ui:options":{}},"myString":{"ui:widget":"uri"}}}","uiSchemas":"[{"formSchemaId":"http://entando.org/schemas/MortgageApplicationForm.json","uiSchema":{"myMortgageAmount":{"ui:options":{"size":6}}}},{"formSchemaId":"http://entando.org/schemas/pda-all-fields-form.json","uiSchema":{"allFielder":{"ui:options":{"size":12}}}}]","defaultColumnSize":"6"}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const taskCommentsConfigs = {
  payload: {
    code: 'entando_widgets_comments',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const summaryCardConfigs = {
  payload: {
    code: 'entando_widgets_summary_card',
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
    code: 'entando_widgets_process_form',
    config: {
      containerId: 'evaluation_1.0.0-SNAPSHOT',
      knowledgeSource: 'kieStaging',
      process: 'evaluation@evaluation_1.0.0-SNAPSHOT',
      settings:
        '{"uiSchema":"{"_sliderInteger":{"ui:widget":"range","ui:options":{}},"_multipleSelector":{"ui:widget":"select","ui:options":{}},"_bigText":{"ui:widget":"textarea","ui:options":{"rows":3}},"__unbound_field_field_62054":{"ui:widget":"range","ui:options":{}},"_processList":{"ui:widget":"select","ui:options":{}},"_radioWithDefault":{"ui:widget":"radio","ui:options":{}},"_radioWithoutDefault":{"ui:widget":"radio","ui:options":{}},"_customObject":{"myDateTime":{"ui:options":{"size":6}},"myBoolean":{"ui:widget":"radio","ui:options":{}},"myString":{"ui:widget":"uri"}}}","uiSchemas":"[{"formSchemaId":"http://entando.org/schemas/MortgageApplicationForm.json","uiSchema":{"myMortgageAmount":{"ui:options":{"size":6}}}},{"formSchemaId":"http://entando.org/schemas/pda-all-fields-form.json","uiSchema":{"allFielder":{"ui:options":{"size":12}}}}]"}',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const overtimeGraphConfigs = {
  payload: {
    code: 'entando_widgets_overtime_graph',
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

const attachments = {
  payload: {
    code: 'entando_widgets_widgets_attachments',
    config: {
      knowledgeSource: 'kieStaging',
      process: 'Mortgage_Process.MortgageApprovalProcess@mortgage-process_1.0.1-SNAPSHOT',
    },
  },
  metaData: { status: 'draft' },
  errors: [],
};

const processDefinition = {
  payload: {
    code: 'entando_widgets_process_definition',
    config: {
      knowledgeSource: 'kieStaging',
      settings: '{"uiSchema":"{}"}',
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
  ATTACHMENTS: attachments,
  PROCESS_DEFINITION: processDefinition,
};
