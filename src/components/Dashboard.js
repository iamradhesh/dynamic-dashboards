import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Typography,
  IconButton,
  Drawer,
  TextField,
  Button,
  Box,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { addWidget, removeWidget, setCategories } from '../store/dashboardSlice';
import TimeRangeSelector from './TimeRangeSelector'; // Import the new component

// Register the required components
ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const categories = useSelector((state) => state.dashboard.categories);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newWidget, setNewWidget] = useState({ name: '', text: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('2'); // State for time range

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => dispatch(setCategories(data.categories)))
      .catch((error) => console.error('Error fetching data:', error));
  }, [dispatch]);

  const handleAddWidget = () => {
    if (selectedCategory && newWidget.name && newWidget.text) {
      const widget = { id: Date.now(), ...newWidget };
      dispatch(addWidget({ categoryName: selectedCategory, widget }));
      setNewWidget({ name: '', text: '' });
      setSidebarOpen(false);
    }
  };

  const handleRemoveWidget = (categoryName, widgetId) => {
    dispatch(removeWidget({ categoryName, widgetId }));
  };

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  const renderChart = (widget) => {
    switch (widget.type) {
      case 'pie':
        return <Pie data={widget.data} />;
      case 'doughnut':
        return <Doughnut data={widget.data} />;
      case 'bar':
        return <Bar data={widget.data} />;
      case 'line':
        return <Line data={widget.data} />;
      case 'horizontalBar':
        return <Bar data={widget.data} options={{ indexAxis: 'y' }} />;
      default:
        return <Typography variant="body2">Unsupported chart type</Typography>;
    }
  };

  // Filter widgets based on the search query
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      widgets: category.widgets.filter((widget) =>
        widget.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.widgets.length > 0 || searchQuery === ''); // Show all categories if no search query

  return (
    <Box sx={{ padding: 2 }}>
      {/* Breadcrumbs */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="#">
            Home
          </Link>
          <Typography color="textPrimary">Dashboard V2</Typography>
        </Breadcrumbs>

        {/* Search Bar */}
        <TextField
          label="Search anything..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '500px' }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ mr: 1 }}>
          CNAPP Dashboard
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: '5px',
            mt: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', height: '20px' }}>
            {/* Time Range Selector */}
            <TimeRangeSelector
              selectedRange={selectedRange}
              handleRangeChange={handleRangeChange}
            />
          </Box>

          {/* Add Widget Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setSidebarOpen(true)}
            sx={{ whiteSpace: 'nowrap', height: 50, mb: 3 }} // Ensures the button does not wrap text
          >
            Add Widget
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {category.name}
              </Typography>
              {category.widgets.map((widget) => (
                <Paper
                  key={widget.id}
                  elevation={1}
                  sx={{ padding: 2, marginBottom: 2, position: 'relative' }}
                >
                  <Typography variant="subtitle1">{widget.name}</Typography>
                  {widget.type ? (
                    renderChart(widget)
                  ) : (
                    <Typography variant="body2">{widget.text}</Typography>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveWidget(category.name, widget.id)}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sidebar Drawer for Adding Widget */}
      <Drawer anchor="right" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Box sx={{ width: 300, padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Widget
          </Typography>
          <TextField
            label="Widget Name"
            fullWidth
            value={newWidget.name}
            onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Widget Text"
            fullWidth
            value={newWidget.text}
            onChange={(e) => setNewWidget({ ...newWidget, text: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Select Category"
            fullWidth
            select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            SelectProps={{
              native: true,
            }}
            sx={{ marginBottom: 2 }}
          >
            <option value=""></option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </TextField>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={handleAddWidget}
          >
            Add Widget
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Dashboard;
