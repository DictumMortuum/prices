import React, { useEffect } from 'react';
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
import { paginate, pages, changePage, useParams } from '../common';
import { useHistory } from 'react-router-dom';
import {
  ShoppingCart,
  Favorite,
  Pageview
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#d8dee9',
    fontFamily: "sans",
  },
  appbar: {
    marginBottom: 5
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
    marginLeft: theme.spacing(3),
    color: "white"
  },
  pagination: {
    padding: theme.spacing(1),
  },
}));

const Nothing = props => (
  <Grid container alignContent="center" alignItems="center" direction="column">
    <Grid item xs={12}>
      {props.spinner ? <CircularProgress /> : <Typography variant="body1" color="inherit"><img style={{ height: 300 }} alt="" src={EmptyImg} /></Typography>}
    </Grid>
  </Grid>
)

export default props => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.up('md'));
  const { stores, cart_results, search_results, spinner, date } = useSelector(state => state.pricesReducer)
  const { store_filtered, stock_filtered, child_data, page_name, component, pre_component, paging=true } = props;
  const store_ids = [...new Set(stock_filtered.map(d => d.store_id))]
  const current_stores = stores.filter(d => store_ids.includes(d.id));
  const page_size = props.page_size || 12;
  const history = useHistory();
  const { page } = useParams();
  const page_data = paginate(child_data, page_size, page, paging)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <Grid container className={classes.root} alignContent="center" alignItems="center">
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Breadcrumbs className={classes.title} />
          { matches && <SearchInput className={classes.margin} /> }
          { matches && <Badge className={classes.margin} badgeContent={search_results.length} color="secondary" max={99999}>
            <Link to={"/search"} style={{ color: "white" }}>
              <Pageview />
            </Link>
          </Badge>}
          { matches && <Badge className={classes.margin} color="secondary" max={99999}>
            <Link to={"/wishlist"} style={{ color: "white" }}>
              <Favorite />
            </Link>
          </Badge>}
          { matches && <Badge className={classes.margin} badgeContent={cart_results.length} color="secondary" max={99999}>
            <Link to={"/cart"} style={{ color: "white" }}>
              <ShoppingCart />
            </Link>
          </Badge>}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid item xs={12} className={classes.content}>
          <Grid container spacing={2} alignContent="center" alignItems="center">
            <Grid item xs={6}>
              <StoreDropdown stores={current_stores} />
            </Grid>
            <Grid item xs={6}>
              <StockDropdown />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {child_data.length > page_size && paging && <Grid item xs={12}>
                  <Paper className={classes.pagination}>
                    <Pagination variant="outlined" shape="rounded" count={pages(child_data, page_size)} page={page} onChange={changePage(page_name, history)} />
                  </Paper>
                </Grid>}
                {pre_component !== undefined && pre_component}
                {store_filtered.length > 0 ? component(page_data) : <Nothing spinner={spinner} />}
                {child_data.length > page_size && paging && <Grid item xs={12}>
                  <Paper className={classes.pagination}>
                    <Pagination variant="outlined" shape="rounded" count={pages(child_data, page_size)} page={page} onChange={changePage(page_name, history)} />
                  </Paper>
                </Grid>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      { !matches && <AppBar position="fixed" className={classes.bottomBar}>
        <Toolbar>
          <SearchInput />
          <Badge className={classes.margin} badgeContent={search_results.length} color="secondary" max={99999}>
            <Link to={"/search"} style={{ color: "white" }}>
              <Pageview />
            </Link>
          </Badge>
          <Badge className={classes.margin} color="secondary" max={99999}>
            <Link to={"/wishlist"} style={{ color: "white" }}>
              <Favorite />
            </Link>
          </Badge>
          <Badge className={classes.margin} badgeContent={cart_results.length} color="secondary" max={99999}>
            <Link to={"/cart"} style={{ color: "white" }}>
              <ShoppingCart />
            </Link>
          </Badge>
        </Toolbar>
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
