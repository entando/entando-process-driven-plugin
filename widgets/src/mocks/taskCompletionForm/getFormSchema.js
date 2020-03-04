export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://entando.org/schemas/pda-form.json',
  type: 'object',
  properties: {
    '47078d21-7da5-4d3f-8355-0fcd78b09f39': {
      title: 'PerformanceEvaluation-taskform.frm',
      type: 'object',
      required: ['performance'],
      properties: {
        reason: {
          type: 'string',
          title: 'Reason',
          description: 'Please provide reasons',
        },
        performance: {
          type: 'integer',
          title: 'Performance',
          description: 'Please evaluate performance',
        },
      },
    },
  },
};
