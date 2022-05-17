import { useState, useEffect } from 'react';
import { bgg_xmlapi, forceError, logError, transformBggData } from "../api/common";
import XMLParser from 'react-xml-parser';
import pRetry from 'p-retry';

const req = list_id => fetch(`${bgg_xmlapi}/geeklist/${list_id}`)
  .then(forceError)
  .then(res => res.text())
  .then(data => {
    const xml = new XMLParser().parseFromString(data);
    return transformBggData(xml)
  })

const fetchGeeklist = (list_id, retries) => pRetry(async () => req(list_id), { onFailedAttempt: logError, retries })

export const useGeeklist = geeklist_id => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchGeeklist(geeklist_id, 2).then(rs => {
      setItems(rs)
    })
  }, [geeklist_id])

  return items
}
