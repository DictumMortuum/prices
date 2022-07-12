import React from 'react';
import { Grid } from '@material-ui/core';
import CompareCard from '../components/CompareCard';
import BoardgameCard from '../components/BoardgameCard';
import GenericPage from './GenericPage';
import { useDispatch, useSelector } from "react-redux";
import BggInput from '../components/BggInput';
import { useWishlist } from '../hooks/useWishlist';
import { useStep } from '../hooks/useStep';
import { useStore } from '../hooks/useStore';
import FormControl from '@material-ui/core/FormControl';
import { pricesToGroups } from './LandingPage';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { PriorityDropdown } from '../components/PriorityDropdown';
import { Spinner } from '../components/Spinner';
import { BooleanParam, withDefault, useQueryParam } from 'use-query-params';

export const ViewSwitch = props => {
  const { wishlist_stores_view, onChange } = props;

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={wishlist_stores_view}
              onChange={onChange}
            />
          }
          label="Stores view"
        />
      </FormGroup>
    </FormControl>
  )
}

const sumPrices = col => col.reduce((prev, curr) => {
  return prev + curr.price;
}, 0.0).toFixed(2);

export const pricesToStores = data => {
  const rs = [];

  data.map(d => {
    if (rs[d.store_id] === undefined) {
      rs[d.store_id] = {
        store_id: d.store_id,
        items: []
      };
    }

    rs[d.store_id].items.push(d);
    return d;
  })

  return rs.filter(d => d.items.length > 0).sort((a, b) => {
    const diff = b.items.length - a.items.length

    if(diff !== 0) {
      return diff
    } else {
      return sumPrices(b.items) - sumPrices(a.items);
    }
  });
}

const StoresList = props => {
  const { store_id, items, wishlist } = props;
  const store = useStore(store_id);
  const sum = sumPrices(items);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h4">
          {store.name} -  €{sum}
        </Typography>
      </Grid>
      {items.sort((a, b) => a.boardgame_id - b.boardgame_id).map(d => (
        <Grid key={d.id} item xs={6} md={3} lg={1}>
          <CompareCard {...d} wishlist={wishlist} />
        </Grid>
      ))}
    </Grid>
  )
}

export const WishesView = data => data.map((tile) => (
  <Grid key={tile.id} item xs={12} md={6} lg={3}>
    <BoardgameCard {...tile} />
  </Grid>
));

export const StoresView = wishlist => data => data.map(store => (
  <Grid key={store.store_id} item xs={12}>
    <StoresList {...store} wishlist={wishlist} />
  </Grid>
));

export default () => {
  const wishlist = useWishlist();
  const dispatch = useDispatch();
  const wishlist_priority = useSelector(state => state.pricesReducer.wishlist_priority);
  const wishlist_stores_view = useSelector(state => state.pricesReducer.wishlist_stores_view);
  const spinner = useSelector(state => state.pricesReducer.spinner);
  const priority_filtered = wishlist.filter(d => parseInt(d.status.wishlistpriority) === wishlist_priority || wishlist_priority === -1);
  const { stock_filtered, store_filtered } = useStep(col => col.filter(d => priority_filtered.map(d => d.id).includes(d.boardgame_id)));
  const [, setQview] = useQueryParam("stores_view", withDefault(BooleanParam, false));
  let grouped;

  if (wishlist_stores_view) {
    grouped = pricesToStores(store_filtered);
  } else {
    grouped = pricesToGroups(store_filtered);
  }

  return (
    <GenericPage
      child_data={grouped}
      stock_filtered={stock_filtered}
      store_filtered={store_filtered}
      page_name="/wishlist"
      additional_controls={
        <React.Fragment>
          <Grid item xs={12}>
            <BggInput />
          </Grid>
          <Grid item xs={12}>
            <PriorityDropdown
              wishlist_priority={wishlist_priority}
              onChange={(event) => {
                dispatch({
                  type: "SET_PRIORITY",
                  payload: event.target.value
                })
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ViewSwitch
              wishlist_stores_view={wishlist_stores_view}
              onChange={(event) => {
                dispatch({
                  type: "SET_WISHLIST_VIEW",
                  payload: event.target.checked,
                });

                setQview(event.target.checked);
              }}
            />
          </Grid>
        </React.Fragment>
      }
      component={data => spinner ? <Spinner /> : wishlist_stores_view ? StoresView(wishlist)(data) : WishesView(data)}
    />
  )
}
