import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PlainLink = ({ to, children, component, ...other }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  params.delete("page");
  const toWithParams = `${to}?${params.toString()}`

  return (
    <Link {...other} to={toWithParams}>
      {children}
    </Link>
  )
}

export const ForwardLink = React.forwardRef((props, ref) => PlainLink({...props, ref}));

export default ForwardLink;
