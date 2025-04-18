import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./index.css";

const tabs = [
  { id: "top-products", label: "Top Products" },
  { id: "abandoned-products", label: "Abandoned Carts" },
  { id: "avg-time-to-purchase", label: "Avg Time to Purchase" },
  { id: "top-rated-products", label: "Top Rated" },
  { id: "repeat-customers", label: "Repeat Customers" },
  { id: "avg-order-value-by-month", label: "AOV by Month" },
  { id: "conversion-rate", label: "Conversion Rate" },
  { id: "orders-with-most-items", label: "Biggest Orders" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8001/${activeTab}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <nav className="bg-white shadow rounded mb-6 flex flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      <div className="bg-white p-6 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">{tabs.find(t => t.id === activeTab)?.label}</h2>
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="text-left px-4 py-2 border-b bg-gray-50"
                    >
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
        ) : (
          <p className="text-gray-500">No data available.</p>
        )}
      </div>
    </div>
  );
}