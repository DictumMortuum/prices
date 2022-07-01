import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { HashRouter, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reducer as pricesReducer } from './reducers/prices';
import App from './App';
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Auth0Provider } from "@auth0/auth0-react";

const rootReducer = combineReducers({
  pricesReducer,
})

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = createStore(rootReducer, composedEnhancer)

store.dispatch({
  type: "INIT"
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#5e81ac",
    },
    secondary: {
      main: "#bf616a",
    },
    text: {
      primary: "#2e3440",
    }
  },
  overrides: {
    MuiInputLabel: {
      root: {
        backgroundColor: '#ffffff',
        paddingLeft: '4px',
        paddingRight: '4px'
      }
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <HashRouter>
      <Provider store={store}>
        <Route path="/">
          <Auth0Provider domain="dev-11hy0hqn.us.auth0.com" clientId="gEd77V5i5uBswawxfycFKL1eEv8BlhdE" redirectUri={window.location.origin}>
            <App />
          </Auth0Provider>
        </Route>
      </Provider>
    </HashRouter>
  </ThemeProvider>
, document.getElementById('root'));
