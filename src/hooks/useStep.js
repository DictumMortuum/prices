import { useSelector } from "react-redux";

export const storeFilter = store => d => {
  if (store.includes(-1)) {
    return true;
  } else {
    return store.includes(d.store_id);
  }
}

export const stockFilter = stock => d => d.stock === stock || stock === -1

export const bestPriceFilter = col => {
  const hm = {};

  col.map(d => {
    const { boardgame_id } = d;

    if (hm[boardgame_id] === undefined) {
      hm[boardgame_id] = d;
    } else {
      if (d.price < hm[boardgame_id].price) {
        hm[boardgame_id] = d;
      }
    }

    return d;
  });

  return Object.values(hm);
}

export const useStep = f => {
  const store = useSelector(state => state.pricesReducer.store);
  const stock = useSelector(state => state.pricesReducer.stock);
  const prices = useSelector(state => state.pricesReducer.prices);
  const price_range = useSelector(state => state.pricesReducer.price_range);
  const enable_price_filter = useSelector(state => state.pricesReducer.enable_price_filter);
  const enable_best_price = useSelector(state => state.pricesReducer.enable_best_price);
  const [min, max] = price_range;
  const page_filtered = f !== undefined ? f(prices) : prices
  const range_filtered = enable_price_filter ? page_filtered.filter(d => d.price < max && d.price > min) : page_filtered;
  const stock_filtered = range_filtered.filter(stockFilter(stock));
  const best_filtered = enable_best_price ? bestPriceFilter(stock_filtered) : stock_filtered;
  const store_filtered = best_filtered.filter(storeFilter(store));

  return {
    page_filtered,
    stock_filtered,
    store_filtered,
  }
}
