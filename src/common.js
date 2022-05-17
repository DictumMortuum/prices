import { useLocation } from 'react-router-dom';

export const useParams = () => {
  const { search, ...rest } = useLocation();
  const params = new URLSearchParams(search)
  const page = parseInt(params.get("page")) || 1
  const stock = params.get("stock") || 0

  return {
    ...rest,
    page,
    stock,
    has_stock: params.has("stock"),
  }
}

export const changePage = (path, history) => (event, value) => {
  if (value === 1) {
    history.push(path)
  } else {
    history.push(path + "?page=" + value)
  }
}

export const paginate = (array, pageSize, pageNumber, paging) => {
  return paging === true ? array.slice((pageNumber-1) * pageSize, pageNumber * pageSize) : array;
}

export const pages = (col, pageSize) => Math.ceil(col.length/pageSize)
