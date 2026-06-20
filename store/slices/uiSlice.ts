import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  sidebarOpen: true,
  theme: 'dark',
};

/**
 * UI State Slice
 * 
 * WHO SHOULD USE IT: Navbars, Sidebars, and Page layout templates.
 * WHEN TO MODIFY: Expanding layout controls (e.g. adding right panels, modal toggles).
 */
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setThemeState: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setThemeState } = uiSlice.actions;

export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UiState }) => state.ui.theme;

export default uiSlice.reducer;
