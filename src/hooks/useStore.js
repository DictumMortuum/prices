import { useSelector } from "react-redux";

export const useStore = store_id  => {
  const { stores } = useSelector(state => state.pricesReducer);
  const [ rs ] = stores.filter(d => d.id === store_id);
  return rs;
}
