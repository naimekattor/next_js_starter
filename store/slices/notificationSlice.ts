import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

interface NotificationState {
  toasts: ToastMessage[];
}

const initialState: NotificationState = {
  toasts: [],
};

/**
 * Toast Notification State Slice
 * 
 * WHO SHOULD USE IT: Any page or component wanting to trigger alerts/toasts dynamically.
 * WHEN TO MODIFY: Adding support for custom icons, click-actions, or stacking behaviors in alerts.
 */
export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = notificationSlice.actions;

export const selectToasts = (state: { notifications: NotificationState }) => state.notifications.toasts;

export default notificationSlice.reducer;
