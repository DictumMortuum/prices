import { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { bgg_xmlapi2, forceError, logError, transformBggData } from "../api/common";
import XMLParser from 'react-xml-parser';
import pRetry from 'p-retry';
import { StringParam, useQueryParam } from 'use-query-params';

const req = name => fetch(`${bgg_xmlapi2}/collection?username=${encodeURIComponent(name)}&wishlist=1`)
  .then(forceError)
  .then(res => res.text())
  .then(data => {
    const xml = new XMLParser().parseFromString(data);
    return transformBggData(xml)
  })

export const fetchWishList = (name, retries) => pRetry(async () => req(name), { onFailedAttempt: logError, retries })

export const useWishlist = () => {
  const { wishlist } = useSelector(state => state.pricesReducer)
  const [username] = useQueryParam("bgg_username", StringParam);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (username !== undefined) {
      dispatch({
        type: "SET_WISHLIST_USERNAME",
        payload: username,
      })

      let rs;
      try {
        rs = await fetchWishList(username, 2)
      } catch(e) {
        rs = [];
      }

      dispatch({
        type: "SET_WISHLIST",
        payload: rs
      })

    }
  }, [username])

  return wishlist
}
