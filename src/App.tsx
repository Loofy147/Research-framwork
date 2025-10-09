import { memo } from 'react';

/**
 * @name App
 * @description The main application component.
 * This component serves as a placeholder, directing users to the core
 * functionality of the AI Agent Meta-Orchestrator Framework.
 * @returns {JSX.Element} The rendered App component.
 */
const App = memo(() => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI Agent Meta-Orchestrator Framework
        </h1>
        <p className="text-lg text-gray-600">
          The core logic for the framework is located in the{' '}
          <code className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
            src/orchestrator
          </code>{' '}
          directory.
        </p>
        <p className="mt-4 text-md text-gray-500">
          Refer to the{' '}
          <a
            href="README.md"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            README.md
          </a>{' '}
          for more information on the architecture and usage.
        </p>
      </div>
    </div>
  );
});

App.displayName = 'App';

export default App;