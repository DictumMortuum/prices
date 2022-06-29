import { createAsyncThunk } from '@reduxjs/toolkit'
import * as fflate from 'fflate';
import { base } from "./common";

export const fetchAllPrices = createAsyncThunk('prices', async () => {
  const pull = localStorage.getItem('pull');
  let origText = localStorage.getItem('prices');

  if (pull === 'true' || pull === null || origText == null) {
    const buffer = await fetch(base + '/rest/v1/prices.json.gz').then(res => res.arrayBuffer());
    const compressed = new Uint8Array(buffer);
    const decompressed = fflate.decompressSync(compressed);
    origText = fflate.strFromU8(decompressed);

    localStorage.setItem('prices', origText);
    localStorage.setItem('pull', 'false');
  }

  return JSON.parse(origText || []);
});
