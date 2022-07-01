import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import { fetchWishList } from '../hooks/useWishlist';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const onChange = dispatch => event => dispatch({
  type: "SET_WISHLIST_USERNAME",
  payload: event.target.value,
})

const Component = props => {
  const dispatch = useDispatch();
  const labelRef = useRef()
  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0
  const [isSending, setIsSending] = useState(false)
  const isMounted = useRef(true)
  const { wishlist_term } = useSelector(state => state.pricesReducer)

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

    dispatch({
      type: "TOGGLE_SPINNER"
    })

    // once the request is sent, update state again
    if (isMounted.current) // only update if we are still mounted
      setIsSending(false)
  }, [dispatch]) // update the callback if the state changes

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel ref={labelRef} htmlFor="bgg-input">Boardgamegeek username</InputLabel>
      <OutlinedInput
        id="bgg-input"
        fullWidth
        labelWidth={labelWidth}
        onChange={onChange(dispatch)}
        onKeyPress={e => {
          if(e.key === 'Enter') {
            e.preventDefault();
            sendRequest(wishlist_term);
          }
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton type="submit" disabled={isSending} onClick={e => { e.preventDefault(); sendRequest(wishlist_term) }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default Component;
