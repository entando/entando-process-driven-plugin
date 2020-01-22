import React from 'react';
import PropTypes from 'prop-types';
import { ComposedChart, XAxis, YAxis, Bar, ResponsiveContainer, Area, Legend } from 'recharts';

const BarAreaChart = ({ data, legends }) => (
  <ResponsiveContainer>
    <ComposedChart data={data}>
      <XAxis dataKey="x" tickLine={false} />
      <YAxis width={40} yAxisId="left" tickLine={false} />
      <YAxis yAxisId="right" orientation="right" tickLine={false} />
      <Bar yAxisId="left" dataKey="bar" barSize={20} fill="#1AB394" opacity={0.4} />
      <Area yAxisId="right" dataKey="area" stroke="#464F88" fill="#464F88" fillOpacity={0.2} />
      <Legend
        iconType="square"
        verticalAlign="top"
        layout="vertical"
        formatter={value => <span style={{ verticalAlign: 'middle' }}>{legends[value]}</span>}
      />
    </ComposedChart>
  </ResponsiveContainer>
);

BarAreaChart.propTypes = {
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

export default BarAreaChart;
