import { Card, CardActions, CardContent, CardHeader, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

const ConnectionItemSkeleton = () => (
  <Grid item xs={3}>
    <Card variant="outlined" square>
      <CardHeader
        avatar={<Skeleton variant="circle" width={40} height={40} />}
        title={<Skeleton variant="text" />}
        subheader={<Skeleton variant="text" width="40%" />}
      />
      <CardContent>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="60%" />
      </CardContent>
      <CardActions>
        <Skeleton variant="rect" width={136} height={31} />
        <Skeleton variant="circle" width={24} height={24} style={{ marginLeft: 'auto' }} />
        <Skeleton variant="circle" width={24} height={24} />
      </CardActions>
    </Card>
  </Grid>
);

export default ConnectionItemSkeleton;
