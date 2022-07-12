import { useSelector } from "react-redux";

export const storeFilter = store => d => {
  if (store.includes(-1)) {
    return true;
  } else {
    return store.includes(d.store_id);
  }
}
export const stockFilter = stock => d => d.stock === stock || stock === -1

export const useStep = f => {
  const { store, stock, prices, price_range, enable_price_filter } = useSelector(state => state.pricesReducer)
  const [min, max] = price_range;
  const page_filtered = f !== undefined ? f(prices) : prices
  const range_filtered = enable_price_filter? page_filtered.filter(d => d.price < max && d.price > min) : page_filtered;
  const stock_filtered = range_filtered.filter(stockFilter(stock))
  const store_filtered = stock_filtered.filter(storeFilter(store))

  return {
    page_filtered,
    stock_filtered,
    store_filtered,
  }
}
