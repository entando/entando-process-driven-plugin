export default {
  DEFAULT: {
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
            rows: 2,
            rowsMax: 6,
          },
        },
      },
      amortization: {
        'ui:options': {
          size: 4,
          min: 1980,
          max: 2030,
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
  },
  MORTGAGE_APPLICATION_FORM: {
    'ui:options': {
      hideDivider: true,
    },
    personalInformation: {
      'ui:options': {
        size: 12,
      },
      firstName: {
        'ui:options': {
          size: 6,
        },
      },
      lastName: {
        'ui:options': {
          size: 6,
        },
      },
      streetName: {
        'ui:options': {
          size: 6,
        },
      },
      city: {
        'ui:options': {
          size: 6,
        },
      },
      state: {
        'ui:options': {
          size: 6,
          innerSize: 6,
        },
      },
      country: {
        'ui:options': {
          size: 6,
          innerSize: 6,
        },
      },
      ssn: {
        'ui:options': {
          size: 6,
        },
      },
      dob: {
        'ui:options': {
          size: 6,
          innerSize: 6,
        },
      },
    },
    propertyInformation: {
      'ui:options': {
        size: 12,
      },
      typeOfHome: {
        'ui:widget': 'radio',
        'ui:options': {
          size: 6,
        },
      },
      rooms: {
        'ui:options': {
          hideHeader: true,
          size: 6,
          direction: 'column',
        },
        bedrooms: {
          'ui:options': {
            size: 7,
          },
        },
        bathrooms: {
          'ui:options': {
            size: 7,
          },
        },
      },
      streetName: {
        'ui:options': {
          size: 6,
        },
      },
      city: {
        'ui:options': {
          size: 6,
        },
      },
      state: {
        'ui:options': {
          size: 6,
          innerSize: 6,
        },
      },
      country: {
        'ui:options': {
          size: 6,
          innerSize: 6,
        },
      },
      ssn: {
        'ui:options': {
          size: 6,
        },
      },
      dob: {
        'ui:options': {
          size: 6,
        },
      },
    },
  },
};
