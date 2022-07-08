import React, { useEffect, Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import StockDropdown from '../components/StockDropdown';
import StoreDropdown from '../components/StoreDropdown';
import Breadcrumbs from '../components/Breadcrumbs';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import EmptyImg from './cartoff.svg';
import Paper from '@material-ui/core/Paper';
import SearchInput from '../components/SearchInput';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import packagejs from '../../package.json';
import Pagination from '@material-ui/lab/Pagination';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { ShoppingCart, Favorite, Pageview, Compare } from '@material-ui/icons';
import { useLogin } from '../hooks/useLogin';
import { useQueryParam, NumberParam } from 'use-query-params';

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
}));

const paginate = (array, pageSize, pageNumber, paging) => {
  return paging === true ? array.slice((pageNumber-1) * pageSize, pageNumber * pageSize) : array;
}

const pages = (col, pageSize) => Math.ceil(col.length/pageSize)

const MainPaper = props => (
  <Paper variant="outlined" square {...props} />
)

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

const CartButton = props => {
  const { cart_results } = props;

  return (
    <IconButton>
      <Badge badgeContent={cart_results.length} color="secondary" max={99999} style={{ color: "white" }} component={Link} to="/cart">
        <ShoppingCart />
      </Badge>
    </IconButton>
  )
}

const FavoriteButton = () => {
  return (
    <IconButton style={{ color: "white" }} component={Link} to="/wishlist">
      <Favorite />
    </IconButton>
  )
}

const SearchButton = () => {
  return (
    <IconButton style={{ color: "white" }} component={Link} to="/search">
      <Pageview />
    </IconButton>
  )
}

const CompareButton = () => {
  return (
    <IconButton style={{ color: "white" }} component={Link} to="/compare">
      <Compare />
    </IconButton>
  )
}

const Bar = props => {
  const { matches, breadcrumbs, isAuthenticated, cart_results, loginWithRedirect, logout, user } = props;

  return (
    <Toolbar>
      { breadcrumbs && <Breadcrumbs />}
      { matches && <Fragment>
        <SearchInput />
        <SearchButton />
        <FavoriteButton />
        { false && <CompareButton />}
        <CartButton cart_results={cart_results} />
        { isAuthenticated ? <LogoutButton logout={logout} user={user} /> : <LoginButton loginWithRedirect={loginWithRedirect} />}
      </Fragment>}
    </Toolbar>
  )
}

const Nothing = props => (
  <Grid container alignContent="center" alignItems="center" direction="column">
    <Grid item xs={12}>
      {props.spinner ? <CircularProgress /> : <Typography variant="body1" color="inherit"><img style={{ height: 300 }} alt="" src={EmptyImg} /></Typography>}
    </Grid>
  </Grid>
)

const Controls = props => {
  const { current_stores, additional_controls } = props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StoreDropdown stores={current_stores} />
      </Grid>
      <Grid item xs={12}>
        <StockDropdown />
      </Grid>
      { additional_controls !== null && additional_controls }
    </Grid>
  );
}

const Main = props => {
  const { child_data, page_size, paging, page, pre_component, store_filtered, component, page_data, spinner } = props;
  const [, setPage] = useQueryParam('page', NumberParam)

  return (
    <Grid container spacing={2}>
      {child_data.length > page_size && paging && <Grid item xs={12}>
        <Pagination variant="outlined" shape="rounded" count={pages(child_data, page_size)} page={page} onChange={(event, value) => setPage(value, 'pushIn')} />
      </Grid>}
      {pre_component !== undefined && pre_component}
      {store_filtered.length > 0 ? component(page_data) : <Nothing spinner={spinner} />}
      {child_data.length > page_size && paging && <Grid item xs={12}>
        <Pagination variant="outlined" shape="rounded" count={pages(child_data, page_size)} page={page} onChange={(event, value) => setPage(value, 'pushIn')} />
      </Grid>}
    </Grid>
  );
}

export default props => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.up('md'));
  const { stores, cart_results, spinner, date } = useSelector(state => state.pricesReducer)
  const { store_filtered, stock_filtered, child_data, component, pre_component, additional_controls, paging=true } = props;
  const store_ids = [...new Set(stock_filtered.map(d => d.store_id))]
  const current_stores = stores.filter(d => store_ids.includes(d.id));
  const page_size = props.page_size || 12;
  const [page] = useQueryParam('page', NumberParam)
  const page_data = paginate(child_data, page_size, page, paging);
  const { loginWithRedirect, logout, isAuthenticated, user } = useLogin();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <Grid container className={classes.root} alignContent="center" alignItems="center">
      <AppBar position="static" className={classes.appbar}>
        <Bar user={user} breadcrumbs={true} matches={matches} isAuthenticated={isAuthenticated} cart_results={cart_results} loginWithRedirect={loginWithRedirect} logout={logout} />
      </AppBar>

      <Container maxWidth="xl">
        <Grid container spacing={4} component={MainPaper} className={classes.content}>
          <Grid item md={2} xs={12} component="div">
            <Controls current_stores={current_stores} additional_controls={additional_controls} />
          </Grid>

          <Grid item md={10} xs={12} component="div">
            <Main
              child_data={child_data}
              page_size={page_size}
              paging={paging}
              page={page}
              pre_component={pre_component}
              store_filtered={store_filtered}
              spinner={spinner}
              page_data={page_data}
              component={component}
            />
          </Grid>
        </Grid>
      </Container>

      {!matches && <AppBar position="fixed" className={classes.bottomBar}>
        <Bar user={user} breadcrumbs={false} matches={!matches} isAuthenticated={isAuthenticated} cart_results={cart_results} loginWithRedirect={loginWithRedirect} logout={logout} />
      </AppBar>}

      <Grid item xs={12}>
        <Toolbar>
          <Typography variant="body1" color="inherit">
            © 2022 Dimitris Raviolos - {packagejs.version} - Last update: {new Date(date).toLocaleDateString('el-GR')}
          </Typography>
        </Toolbar>
      </Grid>
    </Grid>
  )
}
