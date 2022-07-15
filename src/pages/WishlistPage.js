import React from 'react';
import { Grid } from '@material-ui/core';
import CompareCard from '../components/CompareCard';
import BoardgameCard from '../components/BoardgameCard';
import GenericPage from './GenericPage';
import { useSelector } from "react-redux";
import { useWishlist } from '../hooks/useWishlist';
import { useStep } from '../hooks/useStep';
import { useStore } from '../hooks/useStore';
import { pricesToGroups } from './LandingPage';
import Typography from '@material-ui/core/Typography';
import { Spinner } from '../components/Spinner';

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
  const wishlist_stores_view = useSelector(state => state.pricesReducer.wishlist_stores_view);
  const wishlist_priority = useSelector(state => state.pricesReducer.wishlist_priority);
  const spinner = useSelector(state => state.pricesReducer.spinner);
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
      component={data => spinner ? <Spinner /> : wishlist_stores_view ? StoresView(wishlist)(data) : WishesView(data)}
    />
  )
}
