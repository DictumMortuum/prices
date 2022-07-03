import React from 'react';
import { Grid } from '@material-ui/core';
import BoardgameCard from '../components/BoardgameCard';
import GenericPage from './GenericPage';
import { useStep } from '../hooks/useStep';

export const pricesToGroups = data => {
  const rs = [];

  data.map(d => {
    if (rs[d.boardgame_id] === undefined) {
      rs[d.boardgame_id] = {
        ...d,
        items: []
      }

      if (rs[d.boardgame_id].rank === undefined) {
        rs[d.boardgame_id].rank = 999999;
      }
    }

    rs[d.boardgame_id].items.push(d)
    return d
  })

  return rs.filter(d => d.items.length > 0).sort((a, b) => a.rank - b.rank)
}

export default () => {
  const { store_filtered, stock_filtered } = useStep();
  const grouped = pricesToGroups(store_filtered);

  return (
    <GenericPage
      child_data={grouped}
      stock_filtered={stock_filtered}
      store_filtered={store_filtered}
      paging={true}
      page_name="/"
      component={data => data.map((tile) => (
        <Grid key={tile.id} item xs={12} md={6} lg={3}>
          <BoardgameCard {...tile} />
        </Grid>
      ))}
    />
  )
}
