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

const ViewSwitch = props => {
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

  return rs.filter(d => d.items.length > 0).sort((a, b) => b.items.length - a.items.length);
}

const StoresList = props => {
  const { store_id, items, wishlist } = props;
  const store = useStore(store_id);
  let sum = 0.0;

  items.map(d => {
    sum += d.price;
    return d;
  })

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h4">
          {store.name} -  €{sum.toFixed(2)}
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

const WishesView = data => data.map((tile) => (
  <Grid key={tile.id} item xs={12} md={6} lg={3}>
    <BoardgameCard {...tile} />
  </Grid>
));

const StoresView = wishlist => data => data.map(store => (
  <Grid key={store.store_id} item xs={12}>
    <StoresList {...store} wishlist={wishlist} />
  </Grid>
));

export default () => {
  const wishlist = useWishlist();
  const dispatch = useDispatch();
  const { wishlist_priority, wishlist_stores_view, spinner } = useSelector(state => state.pricesReducer);
  const priority_filtered = wishlist.filter(d => parseInt(d.status.wishlistpriority) === wishlist_priority || wishlist_priority === -1);
  const { stock_filtered, store_filtered } = useStep(col => col.filter(d => priority_filtered.map(d => d.id).includes(d.boardgame_id)));
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
                })
              }}
            />
          </Grid>
        </React.Fragment>
      }
      component={data => spinner ? <Spinner /> : wishlist_stores_view ? StoresView(wishlist)(data) : WishesView(data)}
    />
  )
}
