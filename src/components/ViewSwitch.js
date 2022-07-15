import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import { BooleanParam, withDefault, useQueryParam } from 'use-query-params';
import { useDispatch, useSelector } from 'react-redux';

export const ViewSwitch = () => {
  const dispatch = useDispatch();
  const wishlist_stores_view = useSelector(state => state.pricesReducer.wishlist_stores_view);
  const [, setQview] = useQueryParam("stores_view", withDefault(BooleanParam, false));

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={wishlist_stores_view}
              onChange={(event) => {
                dispatch({
                  type: "SET_WISHLIST_VIEW",
                  payload: event.target.checked,
                });

                setQview(event.target.checked);
              }}
            />
          }
        />
      </FormGroup>
    </FormControl>
  )
}
