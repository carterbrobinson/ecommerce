import React, { useState } from 'react';
import { Group } from '@visx/group';
import { Line } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { FaKey, FaLink } from 'react-icons/fa';

interface Table {
  name: string;
  columns: Column[];
  position: { x: number; y: number };
}

interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

const tables: Table[] = [
  {
    name: 'users',
    position: { x: 100, y: 100 },
    columns: [
      { name: 'user_id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'name', type: 'TEXT' },
      { name: 'email', type: 'TEXT' },
      { name: 'signup_source', type: 'TEXT' }
    ]
  },
  {
    name: 'products',
    position: { x: 400, y: 100 },
    columns: [
      { name: 'product_id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'name', type: 'TEXT' },
      { name: 'category', type: 'TEXT' },
      { name: 'price', type: 'REAL' },
      { name: 'created_at', type: 'TEXT' },
      { name: 'active', type: 'BOOLEAN' }
    ]
  },
  {
    name: 'orders',
    position: { x: 100, y: 300 },
    columns: [
      { name: 'order_id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'user_id', type: 'INTEGER', isForeignKey: true },
      { name: 'order_date', type: 'TEXT' },
      { name: 'status', type: 'TEXT' },
      { name: 'total', type: 'REAL' }
    ]
  },
  {
    name: 'order_items',
    position: { x: 400, y: 300 },
    columns: [
      { name: 'item_id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'order_id', type: 'INTEGER', isForeignKey: true },
      { name: 'product_id', type: 'INTEGER', isForeignKey: true },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'unit_price', type: 'REAL' }
    ]
  }
];

const DatabaseSchema: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const width = 800;
  const height = 600;

  const xScale = scaleLinear({
    domain: [0, width],
    range: [0, width],
  });

  const yScale = scaleLinear({
    domain: [0, height],
    range: [0, height],
  });

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Database Schema</h2>
      <div className="flex-1 relative border border-gray-200 rounded-lg overflow-auto bg-white p-4">
        <svg width={width} height={height} className="bg-white">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
            </marker>
          </defs>

          {/* Draw relationships */}
          <Group>
            <Line
              from={{ x: xScale(250), y: yScale(150) }}
              to={{ x: xScale(350), y: yScale(150) }}
              stroke="#4B5563"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
              className="transition-opacity duration-200"
              opacity={hoveredTable ? 0.3 : 1}
            />
            <Line
              from={{ x: xScale(250), y: yScale(350) }}
              to={{ x: xScale(350), y: yScale(350) }}
              stroke="#4B5563"
              strokeWidth={2}
              markerEnd="url(#arrowhead)"
              className="transition-opacity duration-200"
              opacity={hoveredTable ? 0.3 : 1}
            />
          </Group>

          {/* Draw tables */}
          {tables.map((table) => (
            <Group
              key={table.name}
              transform={`translate(${table.position.x}, ${table.position.y})`}
              onClick={() => setSelectedTable(table.name)}
              onMouseEnter={() => setHoveredTable(table.name)}
              onMouseLeave={() => setHoveredTable(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <rect
                width={220}
                height={40 + table.columns.length * 30}
                fill={selectedTable === table.name ? '#E5E7EB' : hoveredTable === table.name ? '#F3F4F6' : '#FFFFFF'}
                stroke={selectedTable === table.name ? '#3B82F6' : '#D1D5DB'}
                strokeWidth={selectedTable === table.name ? 2 : 1}
                rx={6}
                className="shadow-sm hover:shadow-md transition-all duration-200"
              />
              <text
                x={10}
                y={25}
                className="font-semibold"
                fill="#1F2937"
                fontSize={14}
              >
                {table.name}
              </text>
              {table.columns.map((column, index) => (
                <Group key={column.name} transform={`translate(10, ${55 + index * 30})`}>
                  <text
                    x={0}
                    y={15}
                    className="text-sm"
                    fill="#4B5563"
                    fontSize={12}
                  >
                    {column.name}
                  </text>
                  <text
                    x={120}
                    y={15}
                    className="text-xs"
                    fill="#6B7280"
                    fontSize={10}
                  >
                    {column.type}
                  </text>
                  {column.isPrimaryKey && (
                    <FaKey className="absolute right-2 top-1 text-yellow-500" size={12} />
                  )}
                  {column.isForeignKey && (
                    <FaLink className="absolute right-2 top-1 text-blue-500" size={12} />
                  )}
                </Group>
              ))}
            </Group>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default DatabaseSchema;