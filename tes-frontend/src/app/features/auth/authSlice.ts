import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean; // Pour gérer l'hydratation côté client
};

// Valeur initiale minimale, sans localStorage
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  hydrated: false, // Indique si le state a été hydraté côté client
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Remplissage manuel du state à l'init si besoin
    restoreSession: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        }
        state.hydrated = true; // <-- TOUJOURS défini à true une fois la tentative faite
      }
    },
    login: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { login, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
