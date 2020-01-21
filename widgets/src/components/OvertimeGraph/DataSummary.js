import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box } from '@material-ui/core';

const UpArrow = () => (
  <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.93776 4.06163C8.01757 3.90201 7.98854 3.70611 7.87246 3.56825L5.55067 0.782106C5.37654 0.571694 5.01376 0.571694 4.83962 0.782106L2.51784 3.56825C2.40175 3.70611 2.37998 3.90201 2.45254 4.06163C2.53235 4.22851 2.69197 4.33009 2.87336 4.33009H4.26643V8.97366H1.94465C1.87935 8.97366 1.80679 9.00268 1.76326 9.05347L0.602364 10.4465C0.544319 10.5191 0.537064 10.6134 0.573341 10.7005C0.609619 10.7803 0.696686 10.8311 0.783753 10.8311H5.89168C6.02228 10.8311 6.12386 10.7295 6.12386 10.5989V4.33009H7.51693C7.69832 4.33009 7.85794 4.22851 7.93776 4.06163Z"
      fill="#1AB394"
    />
  </svg>
);

const DownArrow = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.791932 0.942586C0.704865 0.942586 0.617798 1.00063 0.58152 1.08044C0.545242 1.16025 0.552498 1.26183 0.610542 1.32713L1.77144 2.7202C1.82222 2.77099 1.88752 2.80001 1.95282 2.80001H4.27461V7.44359H2.88154C2.70015 7.44359 2.54053 7.55242 2.46072 7.71204C2.38816 7.87892 2.40993 8.07482 2.52602 8.21268L4.8478 10.9988C5.02194 11.2092 5.38471 11.2092 5.55885 10.9988L7.88063 8.21268C7.99672 8.07482 8.02575 7.87892 7.94593 7.71204C7.86612 7.55242 7.7065 7.44359 7.52511 7.44359H6.13204V1.18202C6.13204 1.05142 6.03046 0.942586 5.89986 0.942586H0.791932Z"
      fill="#ED5565"
    />
  </svg>
);

const PercentBar = ({ value, barColor }) => (
  <div
    style={{ height: '6px', borderRadius: '4px', backgroundColor: '#F5F5F5', overflow: 'hidden' }}
  >
    <div style={{ height: '100%', width: `${value}%`, backgroundColor: barColor }} />
  </div>
);

PercentBar.propTypes = {
  value: PropTypes.number.isRequired,
  barColor: PropTypes.string.isRequired,
};

const UP_COLOR = '#1AB394';
const DOWN_COLOR = '#ED5565';

const DataSummary = ({ value, label, percent, trend }) => (
  <Grid container>
    <Grid item xs={12}>
      <Typography variant="h6">{value}</Typography>
    </Grid>
    <Grid item xs={8}>
      <Typography variant="caption">{label}</Typography>
    </Grid>
    <Grid item xs={2} style={{ textAlign: 'right' }}>
      <Typography variant="subtitle1">{percent}%</Typography>
    </Grid>
    <Grid item xs={2} style={{ textAlign: 'right' }}>
      {trend === 'up' ? <UpArrow color={UP_COLOR} /> : <DownArrow color={DOWN_COLOR} />}
    </Grid>
    <Grid item xs={12}>
      <Box my={1}>
        <PercentBar value={50} barColor={trend === 'up' ? UP_COLOR : DOWN_COLOR} />
      </Box>
    </Grid>
  </Grid>
);

DataSummary.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  trend: PropTypes.oneOf(['up', 'down']).isRequired,
};

export default DataSummary;
