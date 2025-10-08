export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

export type Environment = 'development' | 'staging' | 'production';

export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: Environment;
  version: string;
}
