import React from 'react';
import PropTypes from 'prop-types';
import {
  CartesianGrid,
  ComposedChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Area,
  Legend,
} from 'recharts';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  root: {
    fontSize: 11,
  },
  legend: {
    padding: 0,
    listStyle: 'none',
    '& li i': {
      display: 'inline-block',
      width: 10,
      height: 10,
      marginRight: 10,
      verticalAlign: 'middle',
    },
  },
};

const BarAreaChart = ({ data, legends, classes }) => {
  const CustomLegend = ({ payload }) => (
    <ul className={classes.legend}>
      {payload.map(entry => (
        <li key={entry.value}>
          <i style={{ backgroundColor: entry.color }} />
          {legends[entry.value]}
        </li>
      ))}
    </ul>
  );

  CustomLegend.propTypes = {
    payload: PropTypes.arrayOf({
      color: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
  };

  return (
    <ResponsiveContainer className={classes.root}>
      <ComposedChart data={data}>
        <XAxis dataKey="x" tickLine={false} padding={{ left: 10, right: 10 }} />
        <YAxis yAxisId="left" tickLine={false} />
        <YAxis yAxisId="right" orientation="right" tickLine={false} />
        <CartesianGrid vertical={false} />
        <Bar yAxisId="left" dataKey="bar" barSize={20} fill="#1AB394" opacity={0.4} />
        <Area yAxisId="right" dataKey="area" stroke="#464F88" fill="#464F88" fillOpacity={0.2} />
        <Legend
          margin={{ top: -10 }}
          layout="vertical"
          height={1}
          wrapperStyle={{ left: 105, top: 20 }}
          content={CustomLegend}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

BarAreaChart.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
    legend: PropTypes.string,
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      bar: PropTypes.number.isRequired,
      area: PropTypes.number.isRequired,
    })
  ).isRequired,
  legends: PropTypes.shape({
    bar: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles, { name: 'BarAreaChart' })(BarAreaChart);
