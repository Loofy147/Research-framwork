import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';
import type { AuthState, User, Session } from '../types';

/**
 * Interface for the authentication actions.
 */
interface AuthActions {
  /**
   * Signs in a user with email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   */
  signIn: (email: string, password: string) => Promise<void>;
  /**
   * Signs up a new user with email and password.
   * @param email - The user's email.
   * @param password - The user's password.
   */
  signUp: (email: string, password: string) => Promise<void>;
  /**
   * Signs out the current user.
   */
  signOut: () => Promise<void>;
  /**
   * Checks the current session to see if a user is logged in.
   */
  checkSession: () => Promise<void>;
}

/**
 * The initial state of the authentication store.
 */
const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

/**
 * A Zustand store for managing authentication state.
 *
 * @see https://github.com/pmndrs/zustand
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message, loading: false });
      logger.error('Sign in failed', { error });
      throw error;
    }
    set({
      user: data.user as User,
      session: data.session as Session,
      loading: false,
    });
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message, loading: false });
      logger.error('Sign up failed', { error });
      throw error;
    }
    set({
      user: data.user as User,
      session: data.session as Session,
      loading: false,
    });
  },

  signOut: async () => {
    set({ loading: true, error: null });
    await supabase.auth.signOut();
    set({ user: null, session: null, loading: false });
  },

  checkSession: async () => {
    set({ loading: true, error: null });
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      set({ error: error.message, loading: false });
      logger.error('Session check failed', { error });
      return;
    }
    set({
      user: session?.user as User | null,
      session: session as Session | null,
      loading: false,
    });
    logger.info('Auth initialized', { hasSession: !!session });
  },
}));

/**
 * Listen for auth state changes from Supabase and update the store accordingly.
 * This ensures the auth state is always in sync.
 */
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    user: session?.user as User | null,
    session: session as Session | null,
    loading: false,
    error: null,
  });
});

/**
 * Perform an initial check of the user's session when the application loads.
 */
useAuthStore.getState().checkSession();