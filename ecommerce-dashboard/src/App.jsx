import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

// Constants
const API_BASE_URL = "http://localhost:8001";
const TABS = [
  { id: "top-products", label: "Top Products" },
  { id: "abandoned-products", label: "Abandoned Carts" },
  { id: "avg-time-to-purchase", label: "Avg Time to Purchase" },
  { id: "top-rated-products", label: "Top Rated" },
  { id: "repeat-customers", label: "Repeat Customers" },
  { id: "avg-order-value-by-month", label: "AOV by Month" },
  { id: "conversion-rate", label: "Conversion Rate" },
  { id: "orders-with-most-items", label: "Biggest Orders" },
];

// Components
const TabNavigation = ({ activeTab, onTabChange }) => (
  <nav className="bg-white shadow rounded mb-6 flex flex-wrap">
    {TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`p-3 text-sm font-medium transition border-b-2 ${
          activeTab === tab.id
            ? "border-blue-500 text-blue-500"
            : "border-transparent hover:text-blue-400"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </nav>
);

const DataTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="text-left px-4 py-2 border-b bg-gray-50">
                {key.replace("_", " ").toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="even:bg-gray-100">
              {Object.values(row).map((value, j) => (
                <td key={j} className="px-4 py-2 border-b">
                  {value !== null ? value.toString() : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/${activeTab}`);
        setData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || 
          "Failed to fetch data. Please make sure the backend server is running."
        );
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">E-commerce Analytics Dashboard</h1>
      </header>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">
          {TABS.find((t) => t.id === activeTab)?.label}
        </h2>
        
        {error && <ErrorMessage message={error} />}
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <DataTable data={data} />
        )}
      </div>
    </div>
  );
}
