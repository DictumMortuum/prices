import React from 'react';
import Slider from '@material-ui/core/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { useDispatch, useSelector } from 'react-redux';

export const PriceSlider = props => {
  const dispatch = useDispatch();
  const enable_price_filter = useSelector(state => state.pricesReducer.enable_price_filter);
  const price_range = useSelector(state => state.pricesReducer.price_range);
  const [min, max] = [0, 500];

  return (
    <Slider
      min={min}
      max={max}
      value={price_range}
      onChange={(event, newValue) => {
        dispatch({
          type: "SET_PRICE_RANGE",
          payload: newValue,
        });
      }}
      aria-labelledby="range-slider"
      valueLabelDisplay="auto"
      disabled={!enable_price_filter}
    />
  );
}

export const PriceSwitch = props => {
  const dispatch = useDispatch();
  const enable_price_filter = useSelector(state => state.pricesReducer.enable_price_filter);

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={enable_price_filter}
              onChange={(event) => {
                dispatch({
                  type: "SET_PRICE_FILTER",
                  payload: event.target.checked,
                });
              }}
            />
          }
        />
      </FormGroup>
    </FormControl>
  )
}
