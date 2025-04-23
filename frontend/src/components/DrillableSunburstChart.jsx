import React, { useEffect, useRef, useState } from 'react';
import Sunburst from 'sunburst-chart';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const DrillableSunburstChart = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drillStack, setDrillStack] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [totalSpending, setTotalSpending] = useState(0);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchHierarchicalData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setData(null);
          setLoading(false);
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${API_BASE}/api/expenses/hierarchical-spending`, config);

        // Process data to calculate values for parent nodes
        const processData = (node) => {
          if (node.children && node.children.length > 0) {
            node.value = node.children.reduce((sum, child) => {
              return sum + (child.value || 0);
            }, 0);
          }
          return node;
        };

        const processedData = processData(response.data);
        setData(processedData);

        // Calculate total spending
        if (processedData && processedData.value) {
          setTotalSpending(processedData.value);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch hierarchical spending data', error);
        setData(null);
        setLoading(false);
      }
    };
    fetchHierarchicalData();
  }, []);

  useEffect(() => {
    if (data && containerRef.current) {
      // Clear previous chart
      containerRef.current.innerHTML = '';

      const width = Math.min(window.innerWidth - 40, 600);
      const height = width;

      // Ensure container has dimensions
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.height = `${height}px`;

      try {
        const currentData = drillStack.length > 0 ? drillStack[drillStack.length - 1] : data;

        const chart = Sunburst()
          .data(currentData)
          .width(width)
          .height(height)
          .color((d) => {
            // Use a color scale based on the node's depth
            const colors = [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E'
            ];

            // Each level gets a different color
            const depth = d.depth || 0;
            return colors[depth % colors.length];
          })
          .label(d => d.data && d.data.name ? d.data.name : '')
          .labelOrientation('radial') // Try different label orientations
          .size('value')
          .tooltipTitle(d => d.data && d.data.name ? d.data.name : '')
          .tooltipContent((d, node) => {
            if (!node || !node.data) return '';

            const name = node.data.name || 'Unknown';
            const value = node.value || 0;
            const percentage = node.parent && node.parent.value
              ? ((value / node.parent.value) * 100).toFixed(1)
              : '100';

            // Build the category path
            let path = '';
            let current = node;
            while (current && current.parent && current.parent.data) {
              path = current.parent.data.name + (path ? ' > ' + path : '');
              current = current.parent;
            }

            return `<strong>${name}</strong><br>
          ${path ? `<span style="font-size: 0.85em; color: #ccc;">Path: ${path} > ${name}</span><br>` : ''}
          $${value.toFixed(2)}<br>
          ${percentage}% of parent`;
          })
          .onClick((node) => {
            if (node && node.children && node.children.length > 0) {
              setDrillStack(prev => [...prev, node]);
              setSelectedNode(node);
            }
          });

        chart(containerRef.current);
      } catch (error) {
        console.error('Error rendering sunburst chart:', error);
      }
    }
  }, [data, drillStack]);

  const handleBackClick = () => {
    if (drillStack.length > 0) {
      setDrillStack(prev => prev.slice(0, -1));
      setSelectedNode(drillStack.length > 1 ? drillStack[drillStack.length - 2] : null);
    }
  };

  const handleResetClick = () => {
    setDrillStack([]);
    setSelectedNode(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!data) return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 w-full">
      <h2 className="text-2xl text-amber-400 font-bold mb-4">Spending Distribution</h2>
      <p className="text-gray-300">No data available</p>
    </div>
  );

  // Calculate current view details with safety checks
  const currentViewName = selectedNode && selectedNode.data ? selectedNode.data.name : 'All Categories';
  const currentTotal = selectedNode ? (selectedNode.value || 0) : (data ? (data.value || 0) : 0);
  const parentTotal = drillStack.length > 1
    ? (drillStack[drillStack.length - 2].value || 0)
    : (data ? (data.value || 0) : 0);
  const percentOfParent = parentTotal > 0
    ? ((currentTotal / parentTotal) * 100).toFixed(1)
    : '100';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 w-full">
      <h2 className="text-2xl text-amber-400 font-bold mb-4">Spending Distribution</h2>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {drillStack.length > 0 && (
            <button
              onClick={handleBackClick}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
            >
              <FaArrowLeft />
            </button>
          )}
          <div>
            <span className="text-gray-300">Current View: </span>
            <span className="text-white font-medium">{currentViewName}</span>
          </div>
        </div>

        {drillStack.length > 0 && (
          <button
            onClick={handleResetClick}
            className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded text-sm"
          >
            Reset to Top Level
          </button>
        )}
      </div>

      <div className="bg-gray-900 p-3 rounded-md mb-4 flex flex-wrap gap-4">
        <div className="text-white">
          <div className="text-sm text-gray-400">Total Amount</div>
          <div className="font-bold">${(currentTotal || 0).toFixed(2)}</div>
        </div>

        {drillStack.length > 0 && (
          <div className="text-white">
            <div className="text-sm text-gray-400">% of Parent Category</div>
            <div className="font-bold">{percentOfParent}%</div>
          </div>
        )}

        <div className="text-white">
          <div className="text-sm text-gray-400">Category Path</div>
          <div className="font-bold">
            {drillStack.map((node, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-1 text-gray-500">›</span>}
                {node.data && node.data.name ? node.data.name : ''}
              </span>
            ))}
            {drillStack.length === 0 && 'All Categories'}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="w-full max-w-xl"
          style={{ minHeight: '500px' }}
        ></div>
      </div>

      <div className="mt-4 text-center text-gray-400 text-sm">
        Click on a segment to drill down into subcategories
      </div>
    </div>
  );
};

export default DrillableSunburstChart;