import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from './store';

/**
 * Custom Redux hooks with built-in TypeScript safety
 * 
 * WHO SHOULD USE IT: Any Client Component dispatching actions or selecting state.
 * WHEN TO MODIFY: Not necessary unless implementing complex middleware hook integrations.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<AppStore>();
