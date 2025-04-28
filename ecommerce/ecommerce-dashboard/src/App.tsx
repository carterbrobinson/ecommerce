import React from 'react';
import Split from 'react-split';
import DatabaseSchema from './components/DatabaseSchema';
import QueryExecutor from './components/QueryExecutor';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">E-commerce Database Dashboard</h1>
            <div className="text-sm text-gray-500">
              Interactive Database Visualization & Query Tool
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Split
          sizes={[50, 50]}
          minSize={300}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm"
        >
          <div className="p-4 overflow-auto">
            <DatabaseSchema />
          </div>
          <div className="p-4 overflow-auto">
            <QueryExecutor />
          </div>
        </Split>
      </main>
    </div>
  );
};

export default App; 