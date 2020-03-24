export default {
  'ui:options': {
    hideDivider: true,
  },
  attachments: {
    processDocument: {},
    processDocumentList: {},
  },
  strings: {
    'ui:options': {
      size: 12,
    },
    regularTextField: {
      'ui:options': {},
    },
    textAreaField: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
    passwordField: {
      'ui:widget': 'password',
      'ui:options': {},
    },
    emailField: {
      'ui:widget': 'email',
      'ui:options': {},
    },
    urlField: {
      'ui:options': {},
    },
    hiddenField: {
      'ui:widget': 'hidden',
      'ui:options': {},
    },
  },
  numbers: {
    doubleField: {},
    integerField: {},
    rangeField: {
      'ui:widget': 'range',
      'ui:options': {},
    },
    limitedRangeField: {
      'ui:widget': 'range',
      'ui:options': {},
    },
    updownField: {
      'ui:widget': 'updown',
      'ui:options': {},
    },
  },
  datetimes: {
    date: {},
    datetime: {},
  },
  multichoice: {
    checkbox: {
      'ui:widget': 'checkboxes',
      'ui:options': {},
    },
  },
};
