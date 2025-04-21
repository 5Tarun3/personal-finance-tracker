import React, { useEffect, useState } from 'react';
import { ResponsiveSunburst } from '@nivo/sunburst';
import axios from 'axios';

const DrillableSunburstChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHierarchicalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/expenses/hierarchical-spending', config);
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch hierarchical spending data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchicalData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div style={{ height: 500 }}>
      <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="value"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'category10' }}
        childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
        animate={true}
        motionConfig="gentle"
        isInteractive={true}
        tooltip={({ id, value, color }) => (
          <div
            style={{
              padding: 12,
              color,
              background: '#222222',
            }}
          >
            <strong>{id}</strong>: ${value.toFixed(2)}
          </div>
        )}
      />
    </div>
  );
};

export default DrillableSunburstChart;
