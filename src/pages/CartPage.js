import React from 'react';
import { Grid } from '@material-ui/core';
import GenericPage from './GenericPage';
import { useDispatch, useSelector } from "react-redux";
import { useStep } from '../hooks/useStep';
import { pricesToGroups } from './LandingPage';
import { Spinner } from '../components/Spinner';
import { pricesToStores, StoresView, WishesView, ViewSwitch } from './WishlistPage';
import { BooleanParam, withDefault, useQueryParam } from 'use-query-params';

export default () => {
  const cart_results = useSelector(state => state.pricesReducer.cart_results);
  const wishlist_stores_view = useSelector(state => state.pricesReducer.wishlist_stores_view);
  const spinner = useSelector(state => state.pricesReducer.spinner);
  const { stock_filtered, store_filtered } = useStep(col => col.filter(d => cart_results.includes(d.boardgame_id)));
  const [, setQview] = useQueryParam("stores_view", withDefault(BooleanParam, false));
  const dispatch = useDispatch();
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
      page_name="/cart"
      additional_controls={
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
      }
      component={data => spinner ? <Spinner /> : wishlist_stores_view ? StoresView(cart_results.map(d => ({id: d})))(data) : WishesView(data)}
    />
  )
}
