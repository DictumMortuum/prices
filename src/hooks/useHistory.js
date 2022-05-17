import { useState, useEffect } from 'react';
import { base } from "../api/common";

export const fetchPriceHistory = boardgame_id => {
  return fetch(base + '/rest/v1/boardgames/' + boardgame_id + '/history.json').then(res => res.json())
}

export const useHistory = boardgame_id => {
  const [history, setHistory] = useState([])

  useEffect(() => {
    let isMounted = true;

    fetchPriceHistory(boardgame_id).then(data => {
      if (isMounted) {
        setHistory(data)
      }
    })

    return () => { isMounted = false };
  }, [boardgame_id])

  return history
}
