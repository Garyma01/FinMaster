import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
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

const pieData = [
  { name: "Group A", value: 600 },
  { name: "Group B", value: 400 },
];

const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = ["#22c55e", "#ef4444"];
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();

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
  
  const pieData = [
    { name: "Losses", value: lossesAndProfitsData?.last3.totalLoss },
    { name: "Profits", value: lossesAndProfitsData?.last3.totalProfit },
  ];
  
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
                   style={{ fontSize: "10px" }}
                 />
                 <YAxis
                   axisLine={false}
                   tickLine={false}
                   style={{ fontSize: "10px" }}
                 />
                 <Tooltip />
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
        <BoxHeader title="Losses vs Profits (Last 3 Months)" sideText="" />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart
            width={110}
            height={100}
            margin={{
              top: 0,
              right: -10,
              left: 10,
              bottom: 0,
            }}
          >
            <Pie
              stroke="none"
              data={pieData}
              innerRadius={18}
              outerRadius={38}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box ml="-0.7rem" flexBasis="40%" textAlign="center">
          <Typography variant="h5">
            Losses {lossesAndProfitsData?.lossChange > 0 ? "⬆" : "⬇"}
          </Typography>
          <Typography variant="h3" color={palette.primary[300]}>
            {lossesAndProfitsData?.lossChange.toFixed(1)}%
          </Typography>
          <Typography variant="h6">
            {lossesAndProfitsData?.lossChange > 0 ? "Losses are up" : "Losses are down"} from the previous 3 months.
          </Typography>
          </Box>
          <Box flexBasis="40%">
              <Typography variant="h5">
            Profits {lossesAndProfitsData?.profitChange > 0 ? "⬆" : "⬇"}
          </Typography>
          <Typography variant="h3" color={palette.primary[300]}>
            {lossesAndProfitsData?.profitChange.toFixed(1)}%
          </Typography>
          <Typography variant="h6">
            {lossesAndProfitsData?.profitChange > 0 ? "Profits are up" : "Profits are down"} from the previous 3 months.
          </Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>
      <DashboardBox gridArea="f">
        <BoxHeader title="Product Prices vs Expenses" sideText="" />
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 25,
              bottom: 40,
              left: -10,
            }}
          >
            <CartesianGrid stroke={palette.grey[800]} />
            <XAxis
              type="number"
              dataKey="price"
              name="price"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <YAxis
              type="number"
              dataKey="expense"
              name="expense"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
              tickFormatter={(v) => `$${v}`}
            />
            <ZAxis type="number" range={[20]} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Scatter
              name="Product Expense Ratio"
              data={productExpenseData}
              fill={palette.tertiary[500]}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
