export default {
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
        innerSize: 8,
      },
    },
    country: {
      'ui:options': {
        size: 6,
        innerSize: 8,
      },
    },
    ssn: {
      'ui:options': {
        size: 6,
        innerSize: 6,
      },
    },
    dob: {
      // 'ui:disabled': true,
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
        group: true,
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
};
