import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { StringParam, useQueryParam } from 'use-query-params';

const filterStores = col => {
  const [last] = col.slice(-1);

  if (last === -1) {
    return [-1]
  } else {
    return [...new Set(col.filter(d => d !== -1))]
  }
}

export default props => {
  const { stores } = props;
  const { store } = useSelector(state => state.pricesReducer)
  const dispatch = useDispatch();
  const [, setQstore] = useQueryParam("store", StringParam);

  return (
    <FormControl variant="outlined" fullWidth>
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
        {stores.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
