import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Typography } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import Link from './Link';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';

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
      <IconButton className={classes.color} component={Link} to="/">
        <HomeIcon />
      </IconButton>
      {args.map(d => (
        <Link key={d} className={classes.color} to={"/item/" + d}>
          <Typography variant="h5" >{d}</Typography>
        </Link>
      ))}
    </Breadcrumbs>
  );
}
