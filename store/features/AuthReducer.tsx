import type { User } from "@/types";
import { createReducer, createAction } from "@reduxjs/toolkit";

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const USER_STORAGE_KEY = 'user_profile';
const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

// Helper to save user to localStorage
const saveUserToStorage = (user: User | null, accessToken: string | null, refreshToken: string | null) => {
  if (typeof window === 'undefined') return;

  if (accessToken)
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  else
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);

  if (refreshToken)
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  else
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  
  if (user)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  else
    localStorage.removeItem(USER_STORAGE_KEY);
};

// Helper to load user from localStorage
const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as User;
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  return null;
};

const getInitialContext = (): AuthState => {
  // Check if localStorage is available (client-side only)
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,
    };
  }

  // Load user from localStorage on initialization
  const user = loadUserFromStorage();
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);

  return {
    user: user,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    error: null,
    isLoading: false,
    isAuthenticated: !!user, // Set based on whether user exists in localStorage
  };
};

const initialState: AuthState = getInitialContext();

// Action creators
export const clearAuth = createAction('auth/clearAuth');
export const setUser = createAction<User | null>('auth/setUser');
export const setError = createAction<string>('auth/setError');
export const setLoading = createAction<boolean>('auth/setLoading');
export const setAccessToken = createAction<string>('auth/setAccessToken');
export const setRefreshToken = createAction<string>('auth/setRefreshToken');
export const setAuthData = createAction<{ user: User; accessToken: string; refreshToken: string }>('auth/setAuthData');

// TODO: Implement initializeAuth, fetchProfileFromFirebase, and logoutThunk if needed
// const initializeAuth = createAsyncThunk(...)

const authReducer = createReducer(initialState, (builder) => {
  builder
    // TODO: Uncomment when initializeAuth, fetchProfileFromFirebase, and logoutThunk are implemented
    // Initialize auth
    // .addCase(initializeAuth.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // })
    // .addCase(initializeAuth.fulfilled, (state, action) => {
    //   state.user = action.payload.user;
    //   state.isAuthenticated = action.payload.isAuthenticated;
    //   state.isLoading = false;
    //   state.error = null;
    //   saveUserToStorage(action.payload.user, state.accessToken, state.refreshToken);
    // })
    // .addCase(initializeAuth.rejected, (state, action) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.isLoading = false;
    //   state.error = action.payload || 'Failed to initialize auth';
    //   saveUserToStorage(null, null, null);
    // })
    // Fetch user from Firestore
    // .addCase(fetchProfileFromFirebase.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // })
    // .addCase(fetchProfileFromFirebase.fulfilled, (state, action) => {
    //   state.user = action.payload;
    //   state.isAuthenticated = !!action.payload;
    //   state.isLoading = false;
    //   state.error = null;
    //   saveUserToStorage(action.payload, state.accessToken, state.refreshToken);
    // })
    // .addCase(fetchProfileFromFirebase.rejected, (state, action) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.isLoading = false;
    //   state.error = action.payload || 'Failed to fetch user';
    //   saveUserToStorage(null, null, null);
    // })
    // Logout thunk
    // .addCase(logoutThunk.pending, (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // })
    // .addCase(logoutThunk.fulfilled, (state) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.isLoading = false;
    //   state.error = null;
    // })
    // .addCase(logoutThunk.rejected, (state) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.isLoading = false;
    //   state.error = null;
    // })
    // Set user action
    .addCase(setUser, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      saveUserToStorage(action.payload, state.accessToken, state.refreshToken);
    })
    // Clear auth action
    .addCase(clearAuth, (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      saveUserToStorage(null, null, null);
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setLoading, (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase(setAccessToken, (state, action) => {
      state.accessToken = action.payload;
      saveUserToStorage(state.user, action.payload, state.refreshToken);
    })
    .addCase(setRefreshToken, (state, action) => {
      state.refreshToken = action.payload;
      saveUserToStorage(state.user, state.accessToken, action.payload);
    })
    .addCase(setAuthData, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      saveUserToStorage(action.payload.user, action.payload.accessToken, action.payload.refreshToken);
    });
});

export default authReducer;