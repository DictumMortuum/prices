import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';
import { BooleanParam, withDefault, useQueryParam } from 'use-query-params';

export const BestPriceSwitch = props => {
  const dispatch = useDispatch();
  const enable_best_price = useSelector(state => state.pricesReducer.enable_best_price);
  const [, setQbest] = useQueryParam("best_prices", withDefault(BooleanParam, false));

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

                setQbest(event.target.checked);
              }}
            />
          }
        />
      </FormGroup>
    </FormControl>
  )
}
