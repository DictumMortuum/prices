import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { deta } from "../api/common";

const createUser = body => fetch(`${deta}/user`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
}).then(res => res.json())

export const useLogin = () => {
  const dispatch = useDispatch();
  const { saved } = useSelector(state => state.pricesReducer.user);
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && !saved) {
      createUser(user).then(data => dispatch({
        type: "SET_USER",
        payload: {
          isAuthenticated,
          details: data,
        }
      }));
    }
  }, [dispatch, isAuthenticated, saved, user]);

  return {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
  }
}
