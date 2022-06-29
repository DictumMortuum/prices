import { createAsyncThunk } from '@reduxjs/toolkit'
import { base } from "./common";

export const fetchDate = createAsyncThunk('date', async () => {
  const saved = localStorage.getItem('date');
  const date = await fetch(base + '/rest/v1/date.json').then(res => res.json());

  if (saved !== date.date) {
    localStorage.setItem('date', date.date);
    localStorage.setItem('pull', 'true');
  }

  return date;
});
