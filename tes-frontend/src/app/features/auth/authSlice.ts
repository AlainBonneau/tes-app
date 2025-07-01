import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean; // Pour savoir si on a tenté l'hydratation
};

// Plus besoin de token dans le state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Quand on récupère le user depuis /users/me
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.hydrated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.hydrated = true;
    },
    // Pour marquer que l’hydratation a été tentée même si on n’a pas de user
    setHydrated: (state) => {
      state.hydrated = true;
    },
  },
});

export const { setUser, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;
