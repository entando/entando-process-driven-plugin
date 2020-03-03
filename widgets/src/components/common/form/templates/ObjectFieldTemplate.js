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
  gridItem: {
    marginLeft: ({ uiSchema }) =>
      uiSchema && uiSchema['ui:options'] && uiSchema['ui:options'].group ? '-12px' : 'initial',
    marginRight: ({ uiSchema }) =>
      uiSchema && uiSchema['ui:options'] && uiSchema['ui:options'].group ? '-12px' : 'initial',
  },
});

const generateColumnedOFT = columnSize => {
  const ObjectFieldTemplate = props => {
    const classes = useStyles(props);

    const { title, description, properties, uiSchema } = props;

    const objectFieldOptions = (uiSchema && uiSchema['ui:options']) || {};

    const showHeader = !objectFieldOptions.hideHeader && !objectFieldOptions.group;

    return (
      <div>
        {showHeader && (
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
              <Grid item xs={gridItemSize} className={classes.gridItem} key={element.content.key}>
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
    title: PropTypes.string,
    description: PropTypes.string,
    properties: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    uiSchema: PropTypes.shape(),
  };

  ObjectFieldTemplate.defaultProps = {
    description: '',
    title: '',
    uiSchema: {},
  };

  return ObjectFieldTemplate;
};

export default generateColumnedOFT;
