import { memo } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Button, Card } from './components/ui';
import { Shield, Zap, Lock, Database } from 'lucide-react';

/**
 * The main application component.
 * It displays a loading indicator while authentication is being processed,
 * and then renders the main landing page, showcasing the application's features.
 * @returns {JSX.Element} The rendered App component.
 */
const App = memo(() => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Enterprise Application
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Production-ready architecture with comprehensive security, performance optimization, and enterprise-grade features
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card hover>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Secure by Default
                  </h3>
                  <p className="text-gray-600 text-sm">
                    CSP headers, error boundaries, authentication, and robust error handling
                  </p>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg flex-shrink-0">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Optimized Performance
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Code splitting, compression, and build optimization for fast loads
                  </p>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg flex-shrink-0">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Enterprise Data Layer
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Supabase integration with retry logic and comprehensive API service
                  </p>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Production Ready
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Testing infrastructure, logging, SEO, and accessibility built in
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-gray-600 mb-6">
                This enterprise-ready foundation includes everything you need
              </p>
              <Button size="lg">
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
});

App.displayName = 'App';

export default App;
