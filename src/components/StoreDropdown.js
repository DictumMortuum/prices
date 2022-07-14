import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import { NumericArrayParam, useQueryParam } from 'use-query-params';

const filterStores = col => {
  const [last] = col.slice(-1);

  if (last === -1) {
    return [-1]
  } else {
    return [...new Set(col.filter(d => d !== -1))]
  }
}

export default props => {
  const { store_ids } = props;
  const store = useSelector(state => state.pricesReducer.store);
  const stores = useSelector(state => state.pricesReducer.stores);
  const current_stores = stores.filter(d => store_ids.includes(d.id));
  const stores_without_stock = stores.filter(d => !store_ids.includes(d.id));
  const dispatch = useDispatch();
  const [, setQstore] = useQueryParam("store", NumericArrayParam);

  return (
    <FormControl variant="outlined" fullWidth style={{ maxWidth: 280 }}>
      <InputLabel htmlFor="store-select-label">Store</InputLabel>
      <Select
        labelId="store-select-label"
        id="store-select"
        value={store}
        multiple
        onChange={(event) => {
          const filtered = filterStores(event.target.value);

          dispatch({
            type: "SET_STORE",
            store: filtered
          })

          setQstore(filtered);
        }}
      >
        <MenuItem key={-1} value={-1}>All stores</MenuItem>
        <ListSubheader style={{ background: "white" }}>With Stock</ListSubheader>
        {current_stores.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
        <ListSubheader style={{ background: "white" }}>Rest</ListSubheader>
        {stores_without_stock.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
