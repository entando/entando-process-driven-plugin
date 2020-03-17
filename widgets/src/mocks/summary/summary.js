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
        id: 'requests',
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
            value: 72.0,
          },
          {
            date: '2017-01-01',
            value: 64.0,
          },
          {
            date: '2016-01-01',
            value: 40.0,
          },
          {
            date: '2015-01-01',
            value: 18.0,
          },
          {
            date: '2014-01-01',
            value: 72.0,
          },
          {
            date: '2013-01-01',
            value: 85.0,
          },
          {
            date: '2012-01-01',
            value: 40.0,
          },
          {
            date: '2011-01-01',
            value: 64.0,
          },
        ],
        card: {
          value: 5.0,
          percentage: 0.16216216216216217,
        },
      },
      {
        id: 'cases',
        values: [
          {
            date: '2020-01-01',
            value: 5.0,
          },
          {
            date: '2019-01-01',
            value: 85.0,
          },
          {
            date: '2018-01-01',
            value: 32.0,
          },
          {
            date: '2017-01-01',
            value: 48.0,
          },
          {
            date: '2016-01-01',
            value: 19.5,
          },
          {
            date: '2015-01-01',
            value: 10.0,
          },
          {
            date: '2014-01-01',
            value: 57.0,
          },
          {
            date: '2013-01-01',
            value: 29.0,
          },
          {
            date: '2012-01-01',
            value: 18.0,
          },
          {
            date: '2011-01-01',
            value: 48.0,
          },
        ],
        card: {
          value: 18.0,
          percentage: 0.6216216216216217,
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
    case 'TimeSeries':
      return MOCK_SUMMARY_CHART;
    default:
      return {};
  }
};

export default getMockSummaryOf;
