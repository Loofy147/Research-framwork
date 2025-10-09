import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/logger';

/**
 * @interface Props
 * @description Props for the ErrorBoundary component.
 * @property {ReactNode} children - The child components to render.
 */
interface Props {
  children: ReactNode;
}

/**
 * @interface State
 * @description State for the ErrorBoundary component.
 * @property {boolean} hasError - Whether an error has been caught.
 * @property {Error | null} error - The caught error.
 */
interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * @class ErrorBoundary
 * @description A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
export class ErrorBoundary extends Component<Props, State> {
  /**
   * Creates an instance of ErrorBoundary.
   * @param {Props} props - The props for the component.
   */
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * A static lifecycle method that is invoked after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter and should return a value to update state.
   * @param {Error} error - The error that was thrown.
   * @returns {State} An object to update the state.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * A lifecycle method that is invoked after an error has been thrown by a descendant component.
   * It receives two parameters: the error that was thrown, and an object with a `componentStack` key
   * containing information about which component threw the error.
   * @param {Error} error - The error that was thrown.
   * @param {ErrorInfo} errorInfo - An object with a `componentStack` property.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught error', { error: error.message, componentStack: errorInfo.componentStack });
  }

  /**
   * Renders the component. If an error has been caught, it displays a fallback UI.
   * Otherwise, it renders the child components.
   * @returns {ReactNode} The rendered component.
   */
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We apologize for the inconvenience.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
