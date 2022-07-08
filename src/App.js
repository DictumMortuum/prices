import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import BoardgamePage from './pages/BoardgamePage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import GeeklistPage from './pages/GeeklistPage';
import WishlistPage from './pages/WishlistPage';
import ComparePage from './pages/ComparePage';
import { fetchAllPrices } from './api/prices';
import { fetchStores } from './api/stores';
import { fetchDate } from './api/date';
import { StringParam, useQueryParam } from 'use-query-params';

export default () => {
  const dispatch = useDispatch();
  const [qstore] = useQueryParam("store", StringParam);
  const [qstock] = useQueryParam("stock", StringParam);

  useEffect(() => {
    dispatch(fetchAllPrices())
    dispatch(fetchStores())
    dispatch(fetchDate())
  }, []);

  useEffect(() => {
    if (qstore === undefined) {
      return
    }

    const arr = qstore.split(",").map(d => parseInt(d))

    if (arr.length > 0) {
      dispatch({
        type: "SET_STORE",
        store: arr,
      })
    }
  }, [qstore]);

  useEffect(() => {
    if (qstock === undefined) {
      return
    }

    dispatch({
      type: "SET_STOCK",
      stock: parseInt(qstock),
    })
  }, [qstock]);

  return (
    <Switch >
      <Route path={`/`} exact>
        <LandingPage />
      </Route>
      <Route path={`/cart`} exact>
        <CartPage />
      </Route>
      <Route path={`/search`} exact>
        <SearchPage />
      </Route>
      <Route path={`/wishlist`} exact>
        <WishlistPage />
      </Route>
      <Route path={`/wishlist/:username`}>
        <WishlistPage />
      </Route>
      <Route path={`/geeklist/:geeklist_id`}>
        <GeeklistPage />
      </Route>
      <Route path={`/item/:boardgame_id`}>
        <BoardgamePage />
      </Route>
      <Route path={`/compare`}>
        <ComparePage />
      </Route>
    </Switch>
  )
}
