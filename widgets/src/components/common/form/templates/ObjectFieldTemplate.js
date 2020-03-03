import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles({
  gridContainer: {
    padding: '0px',
  },
  divider: {
    marginBottom: '5px',
  },
  description: {
    fontSize: '12px',
    marginBottom: '20px',
  },
});

const generateColumnedOFT = columnSize => {
  const ObjectFieldTemplate = props => {
    const classes = useStyles();

    const { title, description, properties, uiSchema } = props;

    const objectFieldOptions = (uiSchema && uiSchema['ui:options']) || {};

    return (
      <div>
        {!objectFieldOptions.hideHeader && (
          <>
            {title}
            {!objectFieldOptions.hideDivider && <Divider className={classes.divider} />}
            {description && <div className={classes.description}>{description}</div>}
          </>
        )}
        <Grid
          container
          spacing={3}
          direction={objectFieldOptions.direction || 'row'}
          className={classes.gridContainer}
        >
          {properties.map(element => {
            const options =
              (element.content.props &&
                element.content.props.uiSchema &&
                element.content.props.uiSchema['ui:options']) ||
              {};

            const gridItemSize = options.size || columnSize || 12;

            return (
              <Grid item xs={gridItemSize} key={element.content.key}>
                {element.content}
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
    uiSchema: PropTypes.shape(),
  };

  ObjectFieldTemplate.defaultProps = {
    description: '',
    uiSchema: {},
  };

  return ObjectFieldTemplate;
};

export default generateColumnedOFT;
