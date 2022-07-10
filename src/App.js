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
import {
  BooleanParam,
  NumberParam,
  StringParam,
  NumericArrayParam,
  withDefault,
  useQueryParam
} from 'use-query-params';

export default () => {
  const dispatch = useDispatch();
  const [qstore] = useQueryParam("store", withDefault(NumericArrayParam, [-1]));
  const [bgg_id] = useQueryParam("bgg_id", withDefault(NumericArrayParam, []));
  const [qstock] = useQueryParam("stock", withDefault(NumberParam, 0));
  const [qname] = useQueryParam("bgg_username", StringParam);
  const [qview] = useQueryParam("stores_view", withDefault(BooleanParam, false));

  useEffect(() => {
    dispatch(fetchAllPrices())
    dispatch(fetchStores())
    dispatch(fetchDate())
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_STORE",
      store: qstore,
    })
  }, [qstore]);

  useEffect(() => {
    dispatch({
      type: "SET_STOCK",
      stock: qstock,
    })
  }, [qstock]);

  useEffect(() => {
    dispatch({
      type: "SET_WISHLIST_USERNAME",
      payload: qname,
    })
  }, [qname]);

  useEffect(() => {
    dispatch({
      type: "SET_CART",
      payload: bgg_id,
    })
  }, [bgg_id]);

  useEffect(() => {
    dispatch({
      type: "SET_WISHLIST_VIEW",
      payload: qview,
    })
  }, [qview]);

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
