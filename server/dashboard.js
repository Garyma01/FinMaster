import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3000/data')
      .then(res => setChartData(res.data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>User Ages</h2>
      <BarChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="age" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default Dashboard;