import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { FaPlay, FaHistory, FaExclamationTriangle, FaRedo, FaEye } from 'react-icons/fa';
import QueryVisualizer from './QueryVisualizer';

const QueryExecutor: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [showVisualization, setShowVisualization] = useState<boolean>(false);

  const exampleQueries = [
    {
      name: 'Get All Users',
      query: 'SELECT * FROM users;'
    },
    {
      name: 'Get Products by Category',
      query: 'SELECT * FROM products WHERE category = ?;'
    },
    {
      name: 'Get User Orders',
      query: `SELECT o.order_id, o.order_date, o.status, o.total, 
              GROUP_CONCAT(p.name) as products
              FROM orders o
              JOIN order_items oi ON o.order_id = oi.order_id
              JOIN products p ON oi.product_id = p.product_id
              WHERE o.user_id = ?
              GROUP BY o.order_id;`
    }
  ];

  const executeQuery = async (showViz: boolean = false) => {
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const response = await axios.post('http://localhost:5000/api/query', { query });
      setResults(response.data);
      setQueryHistory(prev => [query, ...prev].slice(0, 5));
      if (showViz) {
        setShowVisualization(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReRun = () => {
    setShowVisualization(true);
  };

  const handleShowVisualization = () => {
    setShowVisualization(true);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-black">Query Executor</h2>
      
      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-black mb-2">Example Queries</h3>
          <div className="space-y-2">
            {exampleQueries.map((example) => (
              <div key={example.name} className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setQuery(example.query);
                    executeQuery(true);
                  }}
                  className="flex-1 text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
                >
                  <div className="font-medium text-black">{example.name}</div>
                  <SyntaxHighlighter 
                    language="sql" 
                    style={tomorrow} 
                    className="text-xs mt-1 rounded bg-gray-50"
                    customStyle={{ 
                      margin: 0, 
                      padding: '0.5rem',
                      color: '#000000',
                      backgroundColor: '#f3f4f6'
                    }}
                  >
                    {example.query}
                  </SyntaxHighlighter>
                </button>
                <button
                  onClick={() => {
                    setQuery(example.query);
                    handleShowVisualization();
                  }}
                  className="p-2 text-blue-500 hover:text-blue-600"
                  title="Show Visualization"
                >
                  <FaEye size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 flex-1 flex flex-col">
          <div className="mb-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-32 p-3 border border-gray-200 rounded-lg font-mono text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your SQL query here..."
            />
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => executeQuery(true)}
              disabled={loading || !query.trim()}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200"
            >
              <FaPlay size={12} />
              <span>{loading ? 'Executing...' : 'Execute Query'}</span>
            </button>
            {results.length > 0 && (
              <button
                onClick={handleReRun}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors duration-200"
              >
                <FaRedo size={12} />
                <span>Show Visualization</span>
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center space-x-2">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex-1 overflow-auto">
              <div className="text-sm font-medium text-black mb-2">Results ({results.length} rows)</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value, i) => (
                          <td
                            key={i}
                            className="px-4 py-3 whitespace-nowrap text-sm text-black"
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {queryHistory.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-black mb-2">Recent Queries</div>
              <div className="space-y-2">
                {queryHistory.map((q, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setQuery(q);
                        executeQuery(true);
                      }}
                      className="flex-1 text-left p-2 hover:bg-gray-50 rounded-lg text-xs font-mono text-black"
                    >
                      {q}
                    </button>
                    <button
                      onClick={() => {
                        setQuery(q);
                        handleShowVisualization();
                      }}
                      className="p-2 text-blue-500 hover:text-blue-600"
                      title="Show Visualization"
                    >
                      <FaEye size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <QueryVisualizer
        query={query}
        isOpen={showVisualization}
        onClose={() => setShowVisualization(false)}
      />
    </div>
  );
};

export default QueryExecutor; 