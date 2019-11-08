import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Widgets as WidgetsIcon } from '@material-ui/icons';

const styles = {
  paper: {
    padding: 20,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 15,
  },
  subtitle: {
    padding: '20px 0 20px 0',
  },
  formControl: {
    minWidth: 200,
  },
};

class TaskListConfig extends React.Component {
  state = {
    knowledgeSource: '',
    process: '',
  };

  componentDidMount = () => {};

  onChange = key => event => {
    this.setState({ [key]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { knowledgeSource, process } = this.state;

    return (
      <>
        <Typography variant="h5" className={classes.title}>
          <WidgetsIcon /> Task List Configuration
        </Typography>
        <Paper className={classes.paper}>
          <Typography>Data Source</Typography>
          <FormGroup>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="knowledge-source">Knowledge Source</InputLabel>
              <Select
                value={knowledgeSource}
                inputProps={{ id: 'knowledge-source' }}
                onChange={this.onChange('knowledgeSource')}
              >
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="test1">Test 1</MenuItem>
                <MenuItem value="test2">Test 2</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel htmlFor="process">Process</InputLabel>
              <Select
                value={process}
                inputProps={{ id: 'process' }}
                onChange={this.onChange('process')}
              >
                <MenuItem value="remote">Remote</MenuItem>
                <MenuItem value="test1">Test 1</MenuItem>
                <MenuItem value="test2">Test 2</MenuItem>
              </Select>
            </FormControl>
          </FormGroup>

          <Typography className={classes.subtitle}>Options</Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox value="checkedC" />}
              label="Open new page on table row click"
            />
            <FormControlLabel control={<Checkbox value="checkedC" />} label="Show Claim Button" />
            <FormControlLabel
              control={<Checkbox value="checkedC" />}
              label="Show Complete Button"
            />
          </FormGroup>

          <Typography className={classes.subtitle}>Bpm Groups</Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox value="checkedC" />} label="Admin" />
            <FormControlLabel control={<Checkbox value="checkedC" />} label="Manager" />
            <FormControlLabel control={<Checkbox value="checkedC" />} label="Appraiser" />
            <FormControlLabel control={<Checkbox value="checkedC" />} label="Broker" />
          </FormGroup>

          <Typography className={classes.subtitle}>
            Override fields found for PAM process
          </Typography>
        </Paper>
      </>
    );
  }
}

TaskListConfig.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string,
    formControl: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
  }),
};

TaskListConfig.defaultProps = {
  classes: {},
};

export default withStyles(styles)(TaskListConfig);
