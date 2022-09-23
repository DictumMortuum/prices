import React, { useState, useEffect } from "react";

const Request = props => {
  const { request, children, initialState } = props;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rs, setRs] = useState(initialState || {});

  useEffect(() => {
    fetch(request)
      .then(res => res.json())
      .then(
        rs => {
          setIsLoaded(true);
          setRs(rs);
        },
        err => {
          setIsLoaded(true);
          setError(err);
        }
      )
  }, [request]);

  return (
    <React.Fragment>
      {React.cloneElement(children, {
        data: rs,
        error,
        isLoaded,
      })}
    </React.Fragment>
  )
}

export default Request;
