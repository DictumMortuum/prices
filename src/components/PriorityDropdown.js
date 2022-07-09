import React from 'react';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

export const PriorityDropdown = props => {
  const { onChange, wishlist_priority } = props;

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="priority-select-label">Priority</InputLabel>
      <Select
        labelId="priority-select-label"
        id="priority-select"
        value={wishlist_priority}
        onChange={onChange}
      >
        <MenuItem key={-1} value={-1}>All priorities</MenuItem>
        {[1,2,3,4,5].map(d => (
          <MenuItem key={d} value={d}>Priority {d}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
