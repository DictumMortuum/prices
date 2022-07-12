import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import { fetchWishList } from '../hooks/useWishlist';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { StringParam, useQueryParam } from 'use-query-params';

const onChange = dispatch => event => dispatch({
  type: "SET_WISHLIST_USERNAME",
  payload: event.target.value,
})

const Component = props => {
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const isMounted = useRef(true);
  const wishlist_term = useSelector(state => state.pricesReducer.wishlist_term);
  const [, setQname] = useQueryParam("bgg_username", StringParam);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const sendRequest = useCallback(async term => {
    // don't send again while we are sending
    if (isSending) return
    // update state
    setIsSending(true)

    dispatch({
      type: "TOGGLE_SPINNER"
    })

    // send the actual request
    let rs;
    try {
      rs = await fetchWishList(term, 2)
    } catch(e) {
      rs = [];
    }

    dispatch({
      type: "SET_WISHLIST",
      payload: rs
    })

    setQname(term);

    dispatch({
      type: "TOGGLE_SPINNER"
    })

    // once the request is sent, update state again
    if (isMounted.current) // only update if we are still mounted
      setIsSending(false)
  }, [dispatch]) // update the callback if the state changes

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor="bgg-input">Bgg username</InputLabel>
      <OutlinedInput
        style={{ paddingRight: 0 }}
        id="bgg-input"
        value={wishlist_term}
        onChange={onChange(dispatch)}
        onKeyPress={e => {
          if(e.key === 'Enter') {
            e.preventDefault();
            sendRequest(wishlist_term);
          }
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton disabled={isSending} onClick={e => { e.preventDefault(); sendRequest(wishlist_term) }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default Component;
