import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery, useGetStateRevenuesQuery } from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";


interface StateRevenue {
  state: string;
  totalRevenue: number;
}
const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = ["#22c55e", "#ef4444"];
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: stateData, isLoading } = useGetStateRevenuesQuery();

  const revenue = useMemo(() => {
      return (
        operationalData &&
        operationalData[0].monthlyData.map(({ month, revenue }) => {
          return {
            name: month.substring(0, 3),
            revenue: revenue,
          };
        })
      );
    }, [operationalData]);
  const operationalExpenses = useMemo(() => {
    return (
      operationalData &&
      operationalData[0].monthlyData.map(
        ({ month, operationalExpenses, nonOperationalExpenses }) => {
          return {
            name: month.substring(0, 3),
            "Operational Expenses": operationalExpenses,
            "Non Operational Expenses": nonOperationalExpenses,
          };
        }
      )
    );
  }, [operationalData]);

  const productExpenseData = useMemo(() => {
    return (
      productData &&
      productData.map(({ _id, price, expense }) => {
        return {
          id: _id,
          price: price,
          expense: expense,
        };
      })
    );
  }, [productData]);

  const lossesAndProfitsData = useMemo(() => {
      if (!operationalData) {
          return { last3: { totalProfit: 0, totalLoss: 0 }, lossChange: 0, profitChange: 0 };
      }
  
      // Get last 6 months of revenue & expenses
      const lastSixMonths = operationalData[0].monthlyData.slice(-6);
  
      // Split into two sets: Last 3 months & Previous 3 months
      const last3Months = lastSixMonths.slice(-3);
      const prev3Months = lastSixMonths.slice(0, 3);
  
      // Calculate total profit & losses
      const calcTotals = (data: { revenue: number; expenses: number }[]) => {
          return data.reduce(
              (totals, { revenue, expenses }) => {
                  if (revenue > expenses) {
                      totals.totalProfit += revenue - expenses;
                  } else {
                      totals.totalLoss += expenses - revenue;
                  }
                  return totals;
              },
              { totalProfit: 0, totalLoss: 0 }
          );
      };
  
      const last3 = calcTotals(last3Months);
      const prev3 = calcTotals(prev3Months);
  
      // Calculate percentage changes
      const lossChange = prev3.totalLoss
          ? ((last3.totalLoss - prev3.totalLoss) / prev3.totalLoss) * 100
          : 0;
      const profitChange = prev3.totalProfit
          ? ((last3.totalProfit - prev3.totalProfit) / prev3.totalProfit) * 100
          : 0;
  
      return { last3, lossChange, profitChange };
  }, [operationalData]);
  
  const totalRevenue = lossesAndProfitsData?.last3.totalProfit + lossesAndProfitsData?.last3.totalLoss;
  const profitPercentage = totalRevenue > 0 ? (lossesAndProfitsData?.last3.totalProfit / totalRevenue) * 100 : 0;
  
  // Gauge chart sections (Red -> Yellow -> Green)
  const gaugeData = [
    { name: "Loss", value: 30 },   // Red Zone (0-30%)
    { name: "Stable", value: 40 }, // Yellow Zone (30-70%)
    { name: "Profit", value: 30 }, // Green Zone (70-100%)
  ];
  
  const gaugeColors = ["#E53935", "#FFC107", "#43A047"]; 
  
  const topRevenueStates = useMemo(() => {
      if (!stateData) return [];
      return [...stateData]
        .sort((a: StateRevenue, b: StateRevenue) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)
        .map(({ state, totalRevenue }) => ({
          name: state,
          revenue: totalRevenue,
        }));
    }, [stateData]);
  return (
    <>
     <DashboardBox gridArea="c">
             <BoxHeader
               title="Revenue Month by Month"
               subtitle="graph representing the revenue month by month"
               sideText=""
             />
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 width={500}
                 height={300}
                 data={revenue}
                 margin={{
                   top: 17,
                   right: 15,
                   left: -5,
                   bottom: 58,
                 }}
               >
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop
                       offset="5%"
                       stopColor={palette.primary[300]}
                       stopOpacity={0.8}
                     />
                     <stop
                       offset="95%"
                       stopColor={palette.primary[300]}
                       stopOpacity={0}
                     />
                   </linearGradient>
                 </defs>
                 <CartesianGrid vertical={false} stroke={palette.grey[800]} />
                 <XAxis
                   dataKey="name"
                   axisLine={false}
                   tickLine={false}
                   stroke={palette.grey[800]}
                   style={{ fontSize: "10px" }}
                 />
                 <YAxis
                   axisLine={false}
                   tickLine={false}
                   style={{ fontSize: "10px" }}
                   stroke={palette.grey[800]}
                   tickFormatter={(value) => `$${Math.round(value / 1000)}K`}
                 />
                 <Tooltip formatter={(value) => [`$${value.toLocaleString()}`]}/>
                 <Bar dataKey="revenue" fill="url(#colorRevenue)" />
               </BarChart>
             </ResponsiveContainer>
           </DashboardBox>
      {/* <DashboardBox gridArea="d">
        <BoxHeader
          title="Operational vs Non-Operational Expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={operationalExpenses}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Non Operational Expenses"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Operational Expenses"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox> */}
     <DashboardBox gridArea="e">
  <BoxHeader title="Profit Speedometer" sideText="" />

  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
    {/* Speedometer Gauge */}
    <Box position="relative" width="230px" height="140px">
      <PieChart width={230} height={140}>
        <Pie
          data={gaugeData}
          startAngle={180}
          endAngle={0}
          innerRadius={45}
          outerRadius={65}
          dataKey="value"
          stroke="none"
        >
          {gaugeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={gaugeColors[index]} />
          ))}
        </Pie>
      </PieChart>

      {/* Needle Indicator */}
      <Box
        sx={{
          width: "3px",
          height: "55px",
          backgroundColor: "black",
          position: "absolute",
          top: "15px", // Ensures correct alignment at the center of the gauge
          left: "48%",
          transformOrigin: "bottom center",
          transform: `rotate(${profitPercentage * 1.8 - 90}deg)`, // Fix rotation logic
          transition: "transform 0.5s ease-in-out",
        }}
      />
    </Box>

    {/* Profit Percentage Text */}
    <Typography
      variant="h5"
      fontWeight="bold"
      color={profitPercentage > 50 ? "green" : "red"}
      ml={2} // Margin to separate text from the meter
    >
      {profitPercentage.toFixed(1)}% Profit
    </Typography>
  </Box>
</DashboardBox>

      <DashboardBox gridArea="f">
      <BoxHeader
        title="Top 5 Revenue-Generating States"
        subtitle="A horizontal bar chart showing the highest revenue states"
        sideText=""
      />
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          layout="vertical" // Horizontal bars
          data={topRevenueStates}
          margin={{ top: 20, right: 20, left: 5, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9} /> {/* Strong blue */}
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={false} stroke={palette.grey[700]} />
          <XAxis type="number"  tickLine={false} style={{ fontSize: "10px" }} tick={{ fill: palette.grey[900], fontSize: "12px" }} tickFormatter={(value) => `$${value.toLocaleString()}`}/>
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}  tick={{ fill: palette.grey[900], fontSize: "12px" }} // Darker and bigger font
        width={100}  />
          <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}/>
          <Bar dataKey="revenue" fill="#B388EB" barSize={20} radius={[5, 5, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </DashboardBox>
    </>
  );
};

export default Row2;
