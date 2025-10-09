import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';
import type { AuthState, User, Session } from '../types';

/**
 * @interface AuthContextType
 * @description The shape of the authentication context, including state and actions.
 * @extends AuthState
 * @property {(email: string, password: string) => Promise<void>} signIn - Function to sign in a user.
 * @property {(email: string, password: string) => Promise<void>} signUp - Function to sign up a new user.
 * @property {() => Promise<void>} signOut - Function to sign out the current user.
 */
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * React context for authentication state and actions.
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * A custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * A provider component that makes the authentication context available to its children.
 * It manages the authentication state, session, and provides functions for auth actions.
 * @param {{ children: ReactNode }} props - The props for the component.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setState({
          user: session?.user as User | null,
          session: session as Session | null,
          loading: false,
          error: null,
        });
        logger.info('Auth initialized', { hasSession: !!session });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({
          user: session?.user as User | null,
          session: session as Session | null,
          loading: false,
          error: null,
        });
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setState({ user: data.user as User, session: data.session as Session, loading: false, error: null });
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setState({ user: data.user as User, session: data.session as Session, loading: false, error: null });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, loading: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
