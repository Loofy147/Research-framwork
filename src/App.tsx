import { memo } from 'react';

const App = memo(() => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Start prompting (or editing) to see magic happen :)</p>
    </div>
  );
});

App.displayName = 'App';

export default App;
