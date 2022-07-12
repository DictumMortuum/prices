import React from 'react';
import { Grid } from '@material-ui/core';
import GeeklistCard from '../components/GeeklistCard';
import GenericPage from './GenericPage';
import { useSelector } from "react-redux";
import { pricesToGroups } from './LandingPage';
import { useGeeklist } from '../hooks/useGeeklist';
import { useStep } from '../hooks/useStep';
import { useId } from '../hooks/useId';
import { Spinner } from '../components/Spinner';

export default () => {
  const geeklist_id = useId();
  const geeklist = useGeeklist(geeklist_id);
  const spinner = useSelector(state => state.pricesReducer.spinner);
  const { stock_filtered, store_filtered } = useStep(col => col.filter(d => geeklist.includes(d.boardgame_id)));
  const grouped = pricesToGroups(store_filtered);

  return (
    <GenericPage
      child_data={grouped}
      stock_filtered={stock_filtered}
      store_filtered={store_filtered}
      page_size={500}
      page_name={"/geeklist/" + geeklist_id}
      component={data => spinner ? <Spinner /> : data.map((tile, i) => (
        <Grid key={tile.id} item xs={12}>
          <GeeklistCard {...tile} alternate={i%2} />
        </Grid>
      ))}
    />
  )
}
