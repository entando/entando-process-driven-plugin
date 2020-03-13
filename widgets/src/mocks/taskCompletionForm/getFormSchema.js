export default {
  MORTGAGE_APPLICATION_FORM: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://entando.org/schemas/MortgageApplicationForm.json',
    title: 'Mortgage Application Form',
    type: 'object',
    properties: {
      personalInformation: {
        title: 'Personal Information',
        description: 'Please fill in your personal information',
        type: 'object',
        required: ['firstName', 'lastName', 'streetName', 'city', 'state', 'country', 'ssn'],
        properties: {
          firstName: {
            type: 'string',
            title: 'First name',
          },
          lastName: {
            type: 'string',
            title: 'Last name',
          },
          streetName: {
            type: 'string',
            title: 'Street name',
          },
          city: {
            type: 'string',
            title: 'City',
          },
          state: {
            type: 'string',
            title: 'State',
            enum: ['FIRST_STATE', 'SECOND_STATE', 'THIRD_STATE'],
            enumNames: ['1st state', '2nd state', '3rd state'],
          },
          country: {
            type: 'string',
            title: 'Country',
            enum: ['LT', 'IT', 'US'],
            enumNames: ['Lithuania', 'Italy', 'United States of America'],
          },
          ssn: {
            type: 'string',
            title: 'Social security number',
          },
          dob: {
            type: 'string',
            title: 'Date of Birth',
            format: 'date',
          },
        },
      },
      propertyInformation: {
        title: 'Property Information',
        type: 'object',
        required: ['typeOfHome', 'streetName', 'city', 'state', 'country'],
        properties: {
          typeOfHome: {
            type: 'string',
            title: 'Type of Home',
            oneOf: [
              {
                const: 'SINGLE_FAMILY_HOME',
                title: 'Single Family Home',
              },
              {
                const: 'MULTIPLE_FAMILY_DWELLING',
                title: 'Multiple Family Dwelling',
              },
              {
                const: 'APARTMENT_OR_CONDO',
                title: 'Apartment or Condo',
              },
            ],
          },
          rooms: {
            title: 'Rooms',
            type: 'object',
            required: [],
            properties: {
              bedrooms: {
                type: 'string',
                title: 'Bedrooms',
                enum: ['1', '2', '3', '4', '5'],
                enumNames: ['1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5+ bedrooms'],
              },
              bathrooms: {
                type: 'string',
                title: 'Bathrooms',
                enum: [1, 2, 3],
                enumNames: ['1 bathroom', '2 bathrooms', '3 bathrooms'],
              },
            },
          },
          streetName: {
            type: 'string',
            title: 'Street name',
          },
          city: {
            type: 'string',
            title: 'City',
          },
          state: {
            type: 'string',
            title: 'State',
            enum: ['FIRST_STATE', 'SECOND_STATE', 'THIRD_STATE'],
            enumNames: ['1st state', '2nd state', '3rd state'],
          },
          country: {
            type: 'string',
            title: 'Country',
            enum: ['LT', 'IT', 'US'],
            enumNames: ['Lithuania', 'Italy', 'United States of America'],
          },
        },
      },
    },
  },
  ALL_FIELDS: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://entando.org/schemas/pda-all-fields-form.json',
    title: 'All supported fields',
    type: 'object',
    required: [],
    properties: {
      attachments: {
        title: 'Attachments',
        description: 'Examples of attachment widgets (string fields with data-url format)',
        type: 'object',
        required: [],
        properties: {
          processDocument: {
            type: 'string',
            title: 'Upload a document for the ProcessDocument process variable',
            description: 'This is an example of single file upload',
            format: 'data-url',
          },
          processDocumentList: {
            type: 'array',
            title: 'Upload a list of documents to the ProcessDocumentList process variable',
            description: 'This is an example of multiple file upload',
            items: {
              type: 'string',
              format: 'data-url',
            },
          },
        },
      },
      strings: {
        title: 'String fields',
        description: 'Examples of string widgets',
        type: 'object',
        required: [],
        properties: {
          regularTextField: {
            type: 'string',
            title: 'Regular text field',
            description: 'This is an example of string text field (max length 100)',
            maxLength: 100,
          },
          textAreaField: {
            type: 'string',
            title: 'String field as Textarea widget',
            description: 'This is an example of string as Textarea widget',
          },
          passwordField: {
            type: 'string',
            title: 'String field as Password widget',
            description: 'This is an example of string as Password widget',
          },
        },
      },
      numbers: {
        title: 'Number fields',
        description: 'Examples of number widgets',
        type: 'object',
        required: [],
        properties: {
          doubleField: {
            type: 'number',
            title: 'Double field',
            description: 'This is an example of number field (double)',
          },
          integerField: {
            type: 'integer',
            title: 'Integer field',
            description: 'This is an example of Integer field',
          },
          rangeField: {
            type: 'integer',
            title: 'Range field',
            description: 'This is an example of integer field as Range widget',
          },
          limitedRangeField: {
            type: 'integer',
            title: 'Range field with min/max values',
            description: 'This is an example of integer field as Range widget with min/max values',
            minimum: 1,
            maximum: 50,
          },
          updownField: {
            type: 'integer',
            title: 'UpDown field',
            description: 'This is an example of integer field as UpDown widget',
          },
        },
      },
      booleans: {
        title: 'Boolean fields',
        description: 'Examples of boolean widgets',
        type: 'object',
        required: [],
        properties: {
          regularBoolean: {
            type: 'boolean',
            title: 'Boolean (as default checkbox widget)',
            description: 'This is an example of boolean field as Checkbox widget',
          },
          radioBoolean: {
            type: 'boolean',
            title: 'Boolean field as Radio widget',
            description: 'This is an example of boolean field as Radio widget',
          },
          namedRadioBoolean: {
            type: 'boolean',
            title: 'Boolean field as relabeled Radio widget',
            description: 'This is an example of boolean field as Radio widget with provided labels',
            enumNames: ['Pass', 'Fail'],
          },
          selectBoolean: {
            type: 'boolean',
            title: 'Boolean field as Select widget',
            description: 'This is an example of boolean field as Select widget',
          },
        },
      },
      datetimes: {
        title: 'Date-related fields',
        description: 'Examples of date and date-time widgets',
        type: 'object',
        required: [],
        properties: {
          datetime: {
            type: 'string',
            title: 'Date time field as DateTime widget',
            description: 'This is an example of datetime field as DateTime widget',
            format: 'date-time',
          },
        },
      },
      multichoice: {
        title: 'Multi-choice fields',
        description: 'Examples of multi-choice widgets',
        type: 'object',
        required: [],
        properties: {
          checkbox: {
            type: 'array',
            title: 'A multiple-choice list as Checkboxes widget',
            items: {
              type: 'string',
              enum: ['Single', 'Double', 'Triple'],
            },
            uniqueItems: true,
          },
        },
      },
      __unbound_field_field_9814: {
        type: 'string',
        title: 'My Radio Group',
        oneOf: [
          {
            const: 'myValue',
            title: 'myText',
          },
          {
            const: 'anotherValue',
            title: 'anotherText',
          },
          {
            const: 'what?',
            title: 'yup!',
          },
        ],
      },
      __unbound_field_field_9324: {
        type: 'number',
        title: 'Slider',
        minimum: 0.0,
        maximum: 200.0,
        multipleOf: 5.0,
      },
      __unbound_field_field_2802: {
        type: 'number',
        title: 'Slider 0to1',
        minimum: 0.0,
        maximum: 1.0,
        multipleOf: 0.1,
      },
      __unbound_field_field_6196: {
        type: 'string',
        title: 'This is a big text',
        description: 'Write here!',
      },
      __unbound_field_field_4073: {
        type: 'array',
        title: 'My Multiple Selector',
        items: {
          type: 'string',
          oneOf: [
            {
              const: 'first',
              title: 'first',
            },
            {
              const: 'second',
              title: 'second',
            },
            {
              const: 'third',
              title: 'third',
            },
            {
              const: 'last',
              title: 'last',
            },
          ],
        },
        uniqueItems: true,
      },
      __unbound_field_field_653: {
        type: 'string',
        title: 'Combo without default',
        oneOf: [
          {
            const: 'oneValue',
            title: 'one',
          },
          {
            const: 'twoValue',
            title: 'two',
          },
          {
            const: 'threeValue',
            title: 'three',
          },
        ],
      },
      __unbound_field_field_68448: {
        type: 'string',
        title: 'Combo',
        default: 'myValue',
        oneOf: [
          {
            const: 'myValue',
            title: 'myText',
          },
          {
            const: 'anotherValue',
            title: 'anotherText',
          },
          {
            const: 'what?',
            title: 'yup!',
          },
        ],
      },
      processList: {
        type: 'array',
        title: 'ProcessList',
        items: {
          type: 'string',
        },
      },
      __unbound_field_field_030592: {
        type: 'string',
        title: 'My Radio Group with default value',
        default: 'thirdValue',
        oneOf: [
          {
            const: 'firstValue',
            title: 'first',
          },
          {
            const: 'secondValue',
            title: 'second',
          },
          {
            const: 'thirdValue',
            title: 'third',
          },
        ],
      },
    },
  },
  DEFAULT: {
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
  },
  POSTE_REGISTRATION_FORM: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://entando.org/schemas/poste-registration-form.json',
    title: 'Registration Data',
    type: 'object',
    properties: {
      organisationDetails: {
        title: 'Organisation Details',
        description: 'Please fill in your personal information',
        type: 'object',
        required: [
          'organisationName',
          'organisationLegalStructure',
          'companyRegistrationNumber',
          'vatNumber',
          'address',
          'postalCode',
          'city',
          'stateCounty',
          'country',
        ],
        properties: {
          organisationName: {
            title: 'Organisation Name',
            type: 'string',
          },
          organisationLegalStructure: {
            title: 'Organisation Legal Structure',
            type: 'string',
          },
          companyRegistrationNumber: {
            title: 'Company Registration Number',
            type: 'string',
          },
          vatNumber: {
            title: 'VAT Number',
            type: 'string',
          },
          mainOrganisationPhoneNumber: {
            title: 'Main Organisation Phone Number',
            type: 'string',
          },
          address: {
            title: 'Address',
            type: 'string',
          },
          postalCode: {
            title: 'Postal Code',
            type: 'string',
          },
          city: {
            title: 'City',
            type: 'string',
          },
          stateCounty: {
            type: 'array',
            title: 'State / County',
            items: {
              type: 'string',
              oneOf: [
                {
                  const: 'FIRST_STATE',
                  title: '1st state',
                },
                {
                  const: 'SECOND_STATE',
                  title: '2nd state',
                },
                {
                  const: 'THIRD_STATE',
                  title: '3rd state',
                },
              ],
            },
            uniqueItems: true,
          },
          country: {
            type: 'array',
            title: 'Country',
            items: {
              type: 'string',
              oneOf: [
                {
                  const: 'LT',
                  title: 'Lithuania',
                },
                {
                  const: 'IT',
                  title: 'Italy',
                },
                {
                  const: 'US',
                  title: 'United States of America',
                },
                {
                  const: 'OTHER',
                  title: 'Other',
                },
              ],
            },
            uniqueItems: true,
          },

          webSite: {
            title: 'Web site',
            type: 'string',
          },
          externalCode: {
            title: 'External Code',
            type: 'string',
          },
        },
      },
      userDetails: {
        title: 'User Details',
        type: 'object',
        required: [
          'lastName',
          'firstName',
          'email',
          'phoneNumber',
          'username',
          'userVerificationQuestion',
          'preferredUiLanguage',
          'timezone',
        ],
        properties: {
          title: {
            type: 'string',
            title: 'Title',
            oneOf: [
              {
                const: 'MR',
                title: 'Mr.',
              },
              {
                const: 'MS',
                title: 'Ms.',
              },
            ],
          },
          lastName: {
            type: 'string',
            title: 'Last Name',
          },
          firstName: {
            type: 'string',
            title: 'First Name',
          },
          email: {
            type: 'string',
            description:
              "IMPORTANT: This email address will be used for access to the site and for all communications. Please ensure you enter the address correctly. Please use ';' (semicolon) to separate multiple addresses.",
            title: 'Email Address',
          },
          phoneNumber: {
            type: 'string',
            title: 'Phone Number',
          },
          mobileNumber: {
            title: 'Mobile Number',
            type: 'string',
            description:
              '(please enter "+" "country code" and "your mobile phone number" with no spaces)',
          },
          faxNumber: {
            type: 'string',
            title: 'Fax Number',
          },
          roleWithinOrganisation: {
            type: 'array',
            title: 'Role within Organisation',
            items: {
              type: 'string',
              oneOf: [
                {
                  const: 'OTHER',
                  title: 'Other',
                },
                {
                  const: 'OWNER',
                  title: 'Owner',
                },
                {
                  const: 'CEO',
                  title: 'CEO',
                },
              ],
            },
            uniqueItems: true,
          },
          username: {
            type: 'string',
            title: 'Username',
            description: '(please do not forget your username)',
          },
          userVerificationQuestion: {
            type: 'string',
            title: 'User Verification Question',
            description:
              "Please specify a question that will help verify your identity should the need arise (e.g. Your mother's maiden name?)",
          },
          userVerificationQuestionAnswer: {
            type: 'string',
            title: 'Answer to Your User Verification Question',
            description:
              '(The helpdesk may request this information in order to verify your identity).',
          },
          preferredContactMethod: {
            type: 'array',
            title: 'Preferred Contact Method',
            items: {
              type: 'string',
              oneOf: [
                {
                  const: 'TEL',
                  title: 'Telephone',
                },
                {
                  const: 'FAX',
                  title: 'Fax',
                },
                {
                  const: 'EMAIL',
                  title: 'Email',
                },
              ],
            },
            uniqueItems: true,
          },
          preferredUiLanguage: {
            type: 'array',
            title: 'Preferred language for use in system interface',
            items: {
              type: 'string',
              oneOf: [
                {
                  const: 'IT',
                  title: 'Italiano',
                },
                {
                  const: 'EN-GB',
                  title: 'ENGLISH',
                },
              ],
            },
            uniqueItems: true,
          },
          timezone: {
            type: 'array',
            title: 'Time Zone',
            items: {
              type: 'string',
              oneOf: [
                {
                  const: 'UTC',
                  title: 'UTC',
                },
                {
                  const: 'UTC+1',
                  title: 'UTC +1',
                },
              ],
            },
            uniqueItems: true,
          },
        },
      },
    },
  },
};
