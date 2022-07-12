import React from 'react';
import Slider from '@material-ui/core/Slider';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';

const marks = [
  {
    value: 0,
    label: '€0',
  },
  {
    value: 100,
    label: '€100',
  },
  {
    value: 200,
    label: '€200',
  },
  {
    value: 300,
    label: '€300',
  },
  {
    value: 400,
    label: '€400',
  },
  {
    value: 500,
    label: '€500',
  },
];

export const PriceSlider = props => {
  const { onChange, value, disabled } = props;
  const [min, max] = [0, 500];

  return (
    <Slider
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      aria-labelledby="range-slider"
      getAriaValueText={v => `€${v}`}
      marks={marks}
      valueLabelDisplay="auto"
      disabled={!disabled}
    />
  );
}

export const PriceSwitch = props => {
  const { enable_price_filter, onChange } = props;

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={enable_price_filter}
              onChange={onChange}
            />
          }
          label="Price Filter"
        />
      </FormGroup>
    </FormControl>
  )
}
