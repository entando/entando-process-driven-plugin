export const MOCK_SUMMARY_TYPES = {
  payload: ['requests', 'impressions'],
  errors: [],
};

export const MOCK_SUMMARY_CARD = {
  payload: {
    value: 2123,
    percentage: 0.9243,
  },
  errors: [],
};

export const MOCK_SUMMARY_CHART = {
  payload: {
    series: [
      {
        dataType: 'requests',
        values: [
          {
            date: '2020-01-01',
            value: 18.0,
          },
          {
            date: '2019-01-01',
            value: 111.0,
          },
          {
            date: '2018-01-01',
            value: 0.0,
          },
          {
            date: '2017-01-01',
            value: 0.0,
          },
          {
            date: '2016-01-01',
            value: 0.0,
          },
        ],
        card: {
          value: 18.0,
          percentage: 0.16216216216216217,
        },
      },
      {
        dataType: 'cases',
        values: [
          {
            date: '2020-01-01',
            value: 18.0,
          },
          {
            date: '2019-01-01',
            value: 111.0,
          },
          {
            date: '2018-01-01',
            value: 0.0,
          },
          {
            date: '2017-01-01',
            value: 0.0,
          },
          {
            date: '2016-01-01',
            value: 0.0,
          },
        ],
        card: {
          value: 18.0,
          percentage: 0.16216216216216217,
        },
      },
    ],
  },
  errors: [],
};

export const getMockSummaryOf = type => {
  switch (type) {
    case 'Card':
      return MOCK_SUMMARY_CARD;
    case 'Chart':
      return MOCK_SUMMARY_CHART;
    default:
      return {};
  }
};

export default getMockSummaryOf;
