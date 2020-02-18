import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  gridContainer: {
    padding: '0px',
  },
  gridItem: {
    padding: '0px 5px',
  },
  divider: {
    marginBottom: '5px',
  },
});

const ObjectFieldTemplate = props => {
  const classes = useStyles();

  const { title, description, properties } = props;

  return (
    <div>
      {title}
      <Divider className={classes.divider} />
      {description}
      <Grid container spacing={0} className={classes.gridContainer}>
        {properties.map(element => {
          const options =
            (element.content.props &&
              element.content.props.uiSchema &&
              element.content.props.uiSchema['ui:options']) ||
            {};
          const gridItemSize = options.size || 12;

          return (
            <Grid item xs={gridItemSize} key={element.content.key}>
              <div className={classes.property}>{element.content}</div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

// All available props
// https://react-jsonschema-form.readthedocs.io/en/latest/advanced-customization/#field-template
ObjectFieldTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

ObjectFieldTemplate.defaultProps = {
  description: '',
};

export default ObjectFieldTemplate;
