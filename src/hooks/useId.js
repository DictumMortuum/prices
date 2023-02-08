import { useLocation } from 'react-router-dom';

export const useId = () => {
  const { pathname } = useLocation();
  const id = parseInt(pathname.split("/")[2]);
  return id
}

export const useIdRaw = () => {
  const { pathname } = useLocation();
  return pathname.split("/")[2];
}
