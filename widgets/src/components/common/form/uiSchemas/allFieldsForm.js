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
      'ui:options': {
        size: 6,
      },
    },
    emailField: {
      'ui:widget': 'email',
      'ui:options': {
        size: 6,
      },
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
    doubleField: {
      'ui:options': {
        size: 6,
        innerSize: 6,
      },
    },
    integerField: {
      'ui:options': {
        size: 6,
        innerSize: 6,
      },
    },
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
  booleans: {
    regularBoolean: {},
    radioBoolean: {
      'ui:widget': 'radio',
      'ui:options': {
        size: 4,
      },
    },
    namedRadioBoolean: {
      'ui:widget': 'radio',
      'ui:options': {
        size: 4,
      },
    },
    selectBoolean: {
      'ui:widget': 'select',
      'ui:options': {
        size: 4,
      },
    },
  },
  datetimes: {
    date: {
      'ui:options': {
        size: 6,
      },
    },
    datetime: {
      'ui:options': {
        size: 6,
      },
    },
  },
  multichoice: {
    checkbox: {
      'ui:widget': 'checkboxes',
      'ui:options': {
        size: 6,
      },
    },
    select: {
      'ui:widget': 'select',
      'ui:options': {
        size: 6,
      },
    },
  },
};
