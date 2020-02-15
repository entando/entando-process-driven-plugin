const formatOptions = (value, format) => {
  const valstr =
    typeof value === 'number' && value > 999 ? value.toLocaleString() : value.toString();
  switch (format) {
    case 'number':
      return valstr;
    case 'days':
      return `${valstr} day${value !== 1 && 's'}`;
    case 'currency':
      return `$ ${valstr}`;
    default:
      return value;
  }
};

export default {
  interpolation: {
    escapeValue: false,
    format: formatOptions,
  },
  ns: ['translation'],
};
