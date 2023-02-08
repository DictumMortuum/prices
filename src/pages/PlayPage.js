import React, { Fragment, useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector } from "react-redux";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import packagejs from '../../package.json';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useLogin } from '../hooks/useLogin';
import { useIdRaw } from '../hooks/useId';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#d8dee9',
    fontFamily: "sans",
  },
  appbar: {
    marginBottom: theme.spacing(4),
  },
  bottomBar: {
    top: 'auto',
    bottom: 0,
  },
  content: {
    minHeight: '90vh',
    padding: 10
  },
  margin: {
    color: "white"
  },
  pagination: {
    padding: theme.spacing(1),
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: "auto",
  },
}));

const url = "https://vfnf0m.deta.dev"

const MainPaper = props => (
  <Paper variant="outlined" square {...props} />
);

const LoginButton = props => {
  const { loginWithRedirect } = props;
  return <Button onClick={() => loginWithRedirect()} color="inherit">Login</Button>;
};

const LogoutButton = props => {
  const { user, logout } = props;
  const { picture, name } = user;

  return (
    <IconButton onClick={() => logout({ returnTo: window.location.origin })} >
      <Avatar alt={name} src={picture} />
    </IconButton>
  );
};

const Bar = props => {
  const { matches, isAuthenticated, loginWithRedirect, logout, user } = props;

  return (
    <Toolbar>
      { matches && <Fragment>
        { isAuthenticated ? <LogoutButton logout={logout} user={user} /> : <LoginButton loginWithRedirect={loginWithRedirect} />}
      </Fragment>}
    </Toolbar>
  )
}

const PlayBoardgame = props => {
  const { id, play, user } = props;
  const classes = useStyles();
  const [grade, setGrade] = useState(1);

  const handleChange = (event) => {
    setGrade(event.target.value);
    fetch(`${url}/play-votes/${id}-${play}-${user.email}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grade: event.target.value,
      })
    });
  };

  useEffect(() => {
    fetch(`${url}/play-votes/${id}-${play}-${user.email}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(rs => rs.json()).then(rs => {
      if (rs.grade !== undefined) {
        setGrade(rs.grade);
      } else {
        setGrade(1);
      }
    });
  }, []);

  return (
    <Grid container justifyContent="center" component={Paper} style={{ textAlign: "center" }}>
      <Grid item xs={12}>
        <Avatar variant="rounded" src={`https://raw.githubusercontent.com/DictumMortuum/json-api/master/rest/v1/boardgames/${id}/image.avif`} className={classes.large} />
      </Grid>
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <Select value={grade} onChange={handleChange}>
            <MenuItem value={2}>YES</MenuItem>
            <MenuItem value={0}>NO</MenuItem>
            <MenuItem value={1}>MEH</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

const Content = props => {
  const { id, user } = props;
  const [play, setPlay] = useState(null);

  useEffect(() => {
    fetch(`${url}/plays/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(rs => rs.json()).then(rs => {
      setPlay(rs);
    });
  }, []);

  if (user === undefined || play === null) {
    return <></>
  }

  return (
    <Grid container justifyContent="center" spacing={2}>
      {play.boardgames.map(d => (
        <Grid key={d} item xs={12} md={6} lg={3}>
          <PlayBoardgame id={d} play={id} user={user} />
        </Grid>
      ))}
    </Grid>
  )
}

const Results = props => {
  const { id } = props;
  const [play, setPlay] = useState(null);
  const [votes, setVotes] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    fetch(`${url}/plays/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(rs => rs.json()).then(rs => {
      setPlay(rs);
    });
  }, []);

  useEffect(() => {
    fetch(`${url}/play-votes`, {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(rs => rs.json()).then(rs => {
      setVotes(rs);
    });
  }, []);

  if (play === null || votes.length === 0) {
    return <></>
  }

  const m = [];

  votes.map(d => {
    const [boardgame_id, play, email] = d.key.split("-");

    if(m[boardgame_id] === undefined) {
      m[boardgame_id] = {
        boardgame_id,
        grade: 0,
        src: `https://raw.githubusercontent.com/DictumMortuum/json-api/master/rest/v1/boardgames/${boardgame_id}/image.avif`,
        emails: [],
      };
    }

    if(id === play) {
      m[boardgame_id].grade += d.grade;
      m[boardgame_id].emails.push(email);
    }

    return d;
  });

  const rs = [];

  play.boardgames.map(d => {
    rs.push(m[d]);
    return d;
  })

  console.log(rs.sort((a, b) => b.grade - a.grade))

  return (
    <Grid container justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      {rs.map((d, i) => (
        <Grid key={d.boardgame_id} item xs={12}>
          <Avatar variant="rounded" src={d.src} className={classes.large} />
          <h3>#{i + 1}</h3>
          <p>Voted by {d.emails.join(", ")}</p>
        </Grid>
      ))}
    </Grid>
  )
}

export default props => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.up('md'));
  const date = useSelector(state => state.pricesReducer.date);
  const { loginWithRedirect, logout, isAuthenticated, user } = useLogin();
  const id = useIdRaw();
  const { results } = props;

  return (
    <Grid container className={classes.root} alignContent="center" alignItems="center">
      <AppBar position="static" className={classes.appbar}>
        <Bar user={user} breadcrumbs={true} matches={matches} isAuthenticated={isAuthenticated} loginWithRedirect={loginWithRedirect} logout={logout} />
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={4} component={MainPaper} className={classes.content}>
          <Grid item md={12} xs={12} component="div">
            { results ? <Results id={id} /> : <Content id={id} user={user} />}
          </Grid>
        </Grid>
      </Container>

      {!matches && <AppBar position="fixed" className={classes.bottomBar}>
        <Bar user={user} breadcrumbs={false} matches={!matches} isAuthenticated={isAuthenticated} loginWithRedirect={loginWithRedirect} logout={logout} />
      </AppBar>}

      <Grid item xs={12}>
        <Toolbar>
          <Typography variant="body1" color="inherit">
            © 2023 Dimitris Raviolos - {packagejs.version} - Last update: {new Date(date).toLocaleDateString('el-GR')}
          </Typography>
        </Toolbar>
      </Grid>
    </Grid>
  )
}
