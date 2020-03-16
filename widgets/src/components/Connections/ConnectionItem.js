import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Grid,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  online: {
    backgroundColor: 'green',
  },
  offline: {
    backgroundColor: 'red',
  },
};

const ConnectionItem = ({ classes, connection, onEdit, onDelete, onTest }) => (
  <Grid item xs={3}>
    <Card variant="outlined" square>
      <CardHeader
        avatar={<Avatar className={classes[connection.online]}>{connection.name.charAt(0)}</Avatar>}
        title={connection.name}
        subheader={connection.engine}
      />
      <CardContent>
        <Typography color="textSecondary" gutterBottom style={{ paddingBottom: 10 }}>
          {`${connection.schema}://${connection.host}:${connection.port}`}
        </Typography>
        <Typography gutterBottom>
          <b>App: </b>
          {connection.app}
        </Typography>
        <Typography gutterBottom>
          <b>Username: </b> {connection.username}
        </Typography>
        <Typography gutterBottom>
          <b>Timeout: </b> {connection.connectionTimeout}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onClick={onTest(connection.name)}>
          Test connection
        </Button>
        <IconButton
          title={i18next.t('common.delete')}
          size="small"
          style={{ marginLeft: 'auto' }}
          onClick={onDelete(connection.name)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <IconButton title={i18next.t('common.edit')} size="small" onClick={onEdit(connection)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  </Grid>
);

ConnectionItem.propTypes = {
  classes: PropTypes.shape({
    online: PropTypes.string,
    offline: PropTypes.string,
  }).isRequired,
  connection: PropTypes.shape({
    name: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.string,
    schema: PropTypes.string,
    app: PropTypes.string,
    username: PropTypes.string,
    connectionTimeout: PropTypes.number,
    engine: PropTypes.string,
    online: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onTest: PropTypes.func.isRequired,
};

export default withStyles(styles)(ConnectionItem);
