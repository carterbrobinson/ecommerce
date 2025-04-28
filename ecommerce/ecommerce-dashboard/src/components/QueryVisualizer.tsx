import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './Modal';

interface QueryStep {
  id: number;
  type: 'table_scan' | 'join' | 'filter' | 'projection' | 'sort' | 'aggregate';
  description: string;
  tableName?: string;
  rowsProcessed?: number;
  timeTaken?: number;
}

interface QueryVisualizerProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
}

const QueryVisualizer: React.FC<QueryVisualizerProps> = ({ query, isOpen, onClose }) => {
  const [steps, setSteps] = useState<QueryStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && query) {
      setIsComplete(false);
      setCurrentStep(0);
      
      // Parse the query to determine steps
      const queryLower = query.toLowerCase();
      const hasJoin = queryLower.includes('join');
      const hasWhere = queryLower.includes('where');
      const hasGroupBy = queryLower.includes('group by');
      const hasOrderBy = queryLower.includes('order by');

      // Create steps based on query content
      const querySteps: QueryStep[] = [];
      
      // Add table scan step
      const fromMatch = queryLower.match(/from\s+(\w+)/);
      const tableName = fromMatch ? fromMatch[1] : 'unknown';
      querySteps.push({
        id: 1,
        type: 'table_scan',
        description: `Scanning ${tableName} table`,
        tableName: tableName,
        rowsProcessed: 1000,
        timeTaken: 0.5
      });

      // Add join step if present
      if (hasJoin) {
        const joinMatch = queryLower.match(/join\s+(\w+)/);
        const joinTable = joinMatch ? joinMatch[1] : 'unknown';
        querySteps.push({
          id: 2,
          type: 'join',
          description: `Joining with ${joinTable} table`,
          tableName: joinTable,
          rowsProcessed: 500,
          timeTaken: 0.3
        });
      }

      // Add filter step if WHERE clause present
      if (hasWhere) {
        querySteps.push({
          id: querySteps.length + 1,
          type: 'filter',
          description: 'Applying WHERE conditions',
          rowsProcessed: 200,
          timeTaken: 0.2
        });
      }

      // Add group by step if present
      if (hasGroupBy) {
        querySteps.push({
          id: querySteps.length + 1,
          type: 'aggregate',
          description: 'Grouping results',
          rowsProcessed: 100,
          timeTaken: 0.2
        });
      }

      // Add sort step if ORDER BY present
      if (hasOrderBy) {
        querySteps.push({
          id: querySteps.length + 1,
          type: 'sort',
          description: 'Sorting results',
          rowsProcessed: 100,
          timeTaken: 0.1
        });
      }

      // Add final projection step
      querySteps.push({
        id: querySteps.length + 1,
        type: 'projection',
        description: 'Selecting final columns',
        rowsProcessed: querySteps[querySteps.length - 1]?.rowsProcessed || 100,
        timeTaken: 0.1
      });

      setSteps(querySteps);

      // Simulate step-by-step execution with longer delays
      const stepDelays = querySteps.map((_, index) => (index + 1) * 2000); // 2 seconds per step
      let currentIndex = 0;

      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < querySteps.length - 1) {
            currentIndex++;
            return prev + 1;
          }
          clearInterval(interval);
          setIsComplete(true);
          return prev;
        });
      }, stepDelays[currentIndex]);

      return () => clearInterval(interval);
    } else {
      setSteps([]);
      setCurrentStep(0);
      setIsComplete(false);
    }
  }, [query, isOpen]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'table_scan':
        return '🔍';
      case 'join':
        return '🔗';
      case 'filter':
        return '⚡';
      case 'projection':
        return '📊';
      case 'sort':
        return '↕️';
      case 'aggregate':
        return '📈';
      default:
        return '⚙️';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Query Execution Visualization">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-black mb-2">Current Query:</h4>
          <pre className="bg-white p-3 rounded text-sm overflow-x-auto font-mono">
            {query}
          </pre>
        </div>
        
        <div className="space-y-4">
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.5,
                  x: 0,
                  backgroundColor: index === currentStep ? '#f3f4f6' : 'transparent'
                }}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-lg border border-gray-200 transition-all duration-300 ${
                  index === currentStep ? 'border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStepIcon(step.type)}</span>
                  <div className="flex-1">
                    <div className="font-medium text-black">{step.description}</div>
                    {step.tableName && (
                      <div className="text-sm text-gray-600">Table: {step.tableName}</div>
                    )}
                    {step.rowsProcessed && (
                      <div className="text-sm text-gray-600">
                        Rows processed: {step.rowsProcessed}
                      </div>
                    )}
                    {step.timeTaken && (
                      <div className="text-sm text-gray-600">
                        Time: {step.timeTaken}s
                      </div>
                    )}
                  </div>
                  {index <= currentStep && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default QueryVisualizer; 