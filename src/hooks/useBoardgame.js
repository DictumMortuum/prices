import { useState, useEffect } from 'react';
import { base } from "../api/common";

const fetchBoardgame = boardgame_id => {
  return fetch(base + '/rest/v1/boardgames/' + boardgame_id + '/boardgame.json').then(res => res.json())
}

const tpl = {
  boardgame_id: "",
  boardgame_name: "",
  images: [],
}

export const useBoardgame = boardgame_id => {
  const [boardgame, setBoardgame] = useState(tpl)

  useEffect(() => {
    let isMounted = true;

    fetchBoardgame(boardgame_id).then(data => {
      if (isMounted) {
        setBoardgame(data)
      }
    })

    return () => { isMounted = false };
  }, [boardgame_id])

  return boardgame
}
