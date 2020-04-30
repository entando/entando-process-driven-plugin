import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  controls: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '30px',
    padding: '10px 10px',
    '& > div + div ': {
      marginLeft: '20px',
    },
  },
  button: {
    border: '0px',
    backgroundColor: 'inherit',
    display: 'flex',
    alignItems: 'center',
    fill: '#888888',
    '&:hover': {
      fill: '#555555',
    },
    '& > * + *': {
      marginLeft: '5px',
    },
  },
};

const SchemaContainerControls = ({ classes, name, onClickEdit, onClickRemove }) => {
  const handleClickEdit = () => onClickEdit(name);
  const handleClickRemove = () => onClickRemove(name);

  return (
    <div className={classes.controls}>
      <button
        type="button"
        onClick={handleClickEdit}
        className={classes.button}
        title="Edit UI Schema"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" width="14" height="14">
          <path d="M75 180v60c0 8.284 6.716 15 15 15h60c3.978 0 7.793-1.581 10.606-4.394l164.999-165c5.858-5.858 5.858-15.355 0-21.213l-60-60a14.9972 14.9972 0 00-21.211.001l-165 165A14.9938 14.9938 0 0075 180zm30 6.213l150-150L293.787 75l-150 150H105v-38.787z" />
          <path d="M315 150.001c-8.284 0-15 6.716-15 15V300H30V30h135c8.284 0 15-6.716 15-15s-6.716-15-15-15H15C6.716 0 0 6.716 0 15v300c0 8.284 6.716 15 15 15h300c8.284 0 15-6.716 15-15V165.001c0-8.285-6.716-15-15-15z" />
        </svg>
        <span>Edit</span>
      </button>
      <button
        type="button"
        onClick={handleClickRemove}
        className={classes.button}
        title="Remove UI Schema"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459" width="16" height="16">
          <path d="M229.5 0C102.751 0 0 102.751 0 229.5S102.751 459 229.5 459 459 356.249 459 229.5 356.249 0 229.5 0zm77.605 271.629c9.797 9.797 9.797 25.68 0 35.477-4.898 4.898-11.318 7.347-17.738 7.347s-12.84-2.449-17.738-7.347L229.5 264.977l-42.128 42.129c-4.898 4.898-11.318 7.347-17.738 7.347s-12.84-2.449-17.738-7.347c-9.797-9.796-9.797-25.68 0-35.477l42.129-42.129-42.129-42.129c-9.797-9.797-9.797-25.68 0-35.477s25.68-9.797 35.477 0l42.128 42.129 42.128-42.129c9.797-9.797 25.68-9.797 35.477 0 9.797 9.796 9.797 25.68 0 35.477l-42.13 42.129 42.129 42.129z" />
        </svg>
        <span>Remove</span>
      </button>
    </div>
  );
};

SchemaContainerControls.propTypes = {
  classes: PropTypes.shape({
    controls: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
};

export default withStyles(styles)(SchemaContainerControls);
