import React from 'react';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector } from 'react-redux';
import EmptyImg from './cartoff.svg';
import Typography from '@material-ui/core/Typography';

export const Spinner = () => (
  <Grid container alignContent="center" alignItems="center" direction="column">
    <Grid item xs={12}>
      <CircularProgress />
    </Grid>
  </Grid>
)

export const Nothing = props => {
  const spinner = useSelector(state => state.pricesReducer.spinner);

  return (
    <Grid container alignContent="center" alignItems="center" direction="column">
      <Grid item xs={12}>
        {spinner ? <CircularProgress /> : <Typography variant="body1" color="inherit"><img style={{ height: 300 }} alt="" src={EmptyImg} /></Typography>}
      </Grid>
    </Grid>
  )
}
