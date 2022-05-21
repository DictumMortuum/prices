import React from 'react';
import { Grid } from '@material-ui/core';
import PriceCard from '../components/PriceCard';
import GenericPage from './GenericPage';
import { useSelector } from "react-redux";
import { useStep } from '../hooks/useStep';

export default () => {
  const { cart_results } = useSelector(state => state.pricesReducer);
  const { store_filtered, stock_filtered } = useStep(() => cart_results);

  return (
    <GenericPage
      child_data={store_filtered}
      stock_filtered={stock_filtered}
      store_filtered={store_filtered}
      page_name="/compare"
      component={data => data.map((tile) => (
        <Grid key={tile.id} item xs={12} md={6} lg={4}>
          <PriceCard boardgame={tile} />
        </Grid>
      ))}
    />
  )
}
