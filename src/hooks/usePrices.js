import { useState, useEffect } from 'react';
import { base } from "../api/common";

const fetchPrices = boardgame_id => {
  return fetch(base + '/rest/v1/boardgames/' + boardgame_id + '/prices.json').then(res => res.json())
}

const fetchPrice = price_id => {
  return fetch(base + '/rest/v1/prices/' + price_id + '.json').then(res => res.json())
}

export const usePrices = boardgame_id => {
  const [prices, setPrices] = useState([])

  useEffect(() => {
    fetchPrices(boardgame_id).then(data => setPrices(data))
  }, [boardgame_id])

  return prices
}

export const usePrice = price_id => {
  const [price, setPrice] = useState([])

  useEffect(() => {
    let isMounted = true;

    fetchPrice(price_id).then(data => {
      if (isMounted) {
        setPrice(data)
      }
    })

    return () => { isMounted = false };
  }, [price_id])

  return price
}
