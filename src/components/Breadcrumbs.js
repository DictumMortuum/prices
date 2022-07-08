import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: "#d8dee9",
    flexGrow: 1
  },
  color: {
    color: "#d8dee9",
    textDecoration: "none",
  }
}));

export default () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const args = pathname.split("/").slice(2).filter(d => d !== "item").filter(d => d !== "");

  return (
    <Breadcrumbs className={classes.root} separator="/" aria-label="breadcrumb">
      <Link className={classes.color} to={"/"}>
        <Typography variant="h5">Prices</Typography>
      </Link>
      {args.map(d => (
        <Link key={d} className={classes.color} to={"/item/" + d}>
          <Typography variant="h5" >{d}</Typography>
        </Link>
      ))}
    </Breadcrumbs>
  );
}
