export default {
  Application: {
    'ui:options': {
      size: 12,
    },
    mortgageamount: {
      'ui:disabled': true,
      'ui:options': {
        title: false,
        size: 4,
      },
    },
    downpayment: {
      'ui:options': {
        size: 4,
        muiProps: {
          multiline: true,
          fullWidth: true,
        },
      },
    },
    amortization: {
      'ui:options': {
        size: 4,
        yearsRange: [1980, 2030],
        hideNowButton: true,
        hideClearButton: true,
        variant: 'outlined',
      },
    },
    applicant: {
      name: {
        'ui:options': {
          size: 8,
        },
      },
      annualincome: {
        'ui:options': {
          size: 4,
        },
      },
      'ui:options': {
        size: 7,
      },
    },
    property: {
      'ui:options': {
        size: 5,
      },
    },
  },
};
