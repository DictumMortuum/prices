export const reducer = (state = {}, action) => {
  switch (action.type) {
    case "INIT":
      return {
        store: [-1],
        stock: 0,
        order: 0,
        cart_results: [],
        search_term: "",
        search_results: [],
        search_enabled: false,
        wishlist_term: "",
        wishlist_priority: -1,
        wishlist_stores_view: false,
        enable_price_filter: false,
        enable_best_price: false,
        wishlist: [],
        prices: [],
        price_range: [0, 200],
        history: [],
        stores: [],
        spinner: true,
        date: new Date(),
        user: {
          isAuthenticated: false,
          details: {},
          saved: true,
        },
      }
    case "prices/fulfilled": {
      return {
        ...state,
        spinner: false,
        prices: action.payload,
      }
    }
    case "date/fulfilled": {
      return {
        ...state,
        date: new Date(action.payload.date),
      }
    }
    case "stores/fulfilled":
      return {
        ...state,
        stores: action.payload
      }
    case "SET_STOCK": {
      return {
        ...state,
        stock: action.stock,
      }
    }
    case "SET_STORE": {
      return {
        ...state,
        store: action.store,
      }
    }
    case "ADD_TO_CART":
      return {
        ...state,
        cart_results: [...state.cart_results.filter(d => d !== action.cart), action.cart],
      }
    case "SET_CART":
      return {
        ...state,
        cart_results: action.payload,
      }
    case "SET_PRICE_RANGE":
      return {
        ...state,
        price_range: action.payload,
      }
    case "SET_PRICE_FILTER":
      return {
        ...state,
        enable_price_filter: action.payload
      }
    case "SET_BEST_PRICE":
      return {
        ...state,
        enable_best_price: action.payload
      }
    case "SET_SEARCH_TERM":
      return {
        ...state,
        search_term: action.payload,
        search_enabled: false,
      }
    case "EXECUTE_SEARCH":
      return {
        ...state,
        search_enabled: true,
      }
    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload
      }
    case "SET_WISHLIST_USERNAME":
      return {
        ...state,
        wishlist_term: action.payload
      }
    case "SET_WISHLIST_VIEW":
      return {
        ...state,
        wishlist_stores_view: action.payload
      }
    case "SET_PRIORITY":
      return {
        ...state,
        wishlist_priority: action.payload
      }
    case "TOGGLE_SPINNER":
      return {
        ...state,
        spinner: !state.spinner
      }
    case "SET_USER":
      return {
        ...state,
        user: {
          ...action.payload,
          saved: true,
        }
      }
    default:
      return state;
  }
};
