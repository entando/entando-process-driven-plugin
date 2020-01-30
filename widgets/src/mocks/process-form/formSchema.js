export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://entando.org/schemas/pda-form.json',
  type: 'object',
  properties: {
    'd1e6dd47-b24c-4f93-ba25-337832926124': {
      title: 'evaluation-taskform.frm',
      type: 'object',
      required: ['employee', 'reason', 'list'],
      properties: {
        employee: {
          type: 'string',
          title: 'Employee',
          description: 'Employee',
          maxLength: 100,
        },
        reason: {
          type: 'string',
          title: 'Reason',
          description: 'Reason',
        },
        list: {
          type: 'string',
          title: 'List',
        },
        checkBox: {
          type: 'boolean',
          title: 'Agree',
        },
      },
    },
  },
};
