import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: []
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addWidget: (state, action) => {
      const { categoryName, widget } = action.payload;
      const category = state.categories.find(cat => cat.name === categoryName);
      if (category) {
        category.widgets.push(widget);
      }
    },
    removeWidget: (state, action) => {
      const { categoryName, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.name === categoryName);
      if (category) {
        category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
      }
    }
  }
});

export const { setCategories, addWidget, removeWidget } = dashboardSlice.actions;
export default dashboardSlice.reducer;
