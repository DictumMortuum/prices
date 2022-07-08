import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PlainLink = ({ to, children, component, ...other }) => {
  const currentParams = useLocation().search;
  const toWithParams = `${to}${currentParams}`

  return (
    <Link {...other} to={toWithParams}>
      {children}
    </Link>
  )
}

export const ForwardLink = React.forwardRef((props, ref) => PlainLink({...props, ref}));

export default ForwardLink;
