import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';

const TimeRangeSelector = ({ selectedRange, handleRangeChange }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      
      <Select
        value={selectedRange}
        onChange={handleRangeChange}
        variant="outlined"
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="2">Last 2 days</MenuItem>
        <MenuItem value="7">Last 7 days</MenuItem>
        <MenuItem value="30">Last 30 days</MenuItem>
        <MenuItem value="custom">Custom Range</MenuItem>
      </Select>
    </Box>
  );
};

export default TimeRangeSelector;
