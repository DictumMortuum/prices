import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { NumberParam, useQueryParam } from 'use-query-params';

export default () => {
  const stocks = ["In stock", "Preorder", "Out of stock"];
  const { stock } = useSelector(state => state.pricesReducer);
  const dispatch = useDispatch();
  const [, setQstock] = useQueryParam("stock", NumberParam);

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="stock-select-label">Stock</InputLabel>
      <Select
        labelId="stock-select-label"
        id="stock-select"
        value={stock}
        onChange={(event) => {
          dispatch({
            type: "SET_STOCK",
            stock: event.target.value
          })

          setQstock(event.target.value);
        }}
      >
        {stocks.map((d, i) => <MenuItem key={d} value={i}>{d}</MenuItem>)}
        <MenuItem key={-1} value={-1}>Show all</MenuItem>
      </Select>
    </FormControl>
  )
}
