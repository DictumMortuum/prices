import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';

export const BestPriceSwitch = props => {
  const dispatch = useDispatch();
  const enable_best_price = useSelector(state => state.pricesReducer.enable_best_price);

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={enable_best_price}
              onChange={(event) => {
                dispatch({
                  type: "SET_BEST_PRICE",
                  payload: event.target.checked,
                });
              }}
            />
          }
          label="Best Price"
        />
      </FormGroup>
    </FormControl>
  )
}
