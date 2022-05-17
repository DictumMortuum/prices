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
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <HashRouter>
      <Provider store={store}>
        <Route path="/">
          <App />
        </Route>
      </Provider>
    </HashRouter>
  </ThemeProvider>
, document.getElementById('root'));
