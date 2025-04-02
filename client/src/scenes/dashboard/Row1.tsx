// import BoxHeader from "@/components/BoxHeader";
// import DashboardBox from "@/components/DashboardBox";
// import { useGetKpisQuery } from "@/state/api";
// import { useTheme } from "@mui/material";
// import { useMemo } from "react";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   AreaChart,
//   BarChart,
//   Bar,
//   LineChart,
//   XAxis,
//   YAxis,
//   Legend,
//   Line,
//   Tooltip,
//   Area,
// } from "recharts";

// const Row1 = () => {
//   const { palette } = useTheme();
//   const { data } = useGetKpisQuery();

//   const revenue = useMemo(() => {
//     return (
//       data &&
//       data[0].monthlyData.map(({ month, revenue }) => {
//         return {
//           name: month.substring(0, 3),
//           revenue: revenue,
//         };
//       })
//     );
//   }, [data]);

//   const revenueExpenses = useMemo(() => {
//     return (
//       data &&
//       data[0].monthlyData.map(({ month, revenue, expenses }) => {
//         return {
//           name: month.substring(0, 3),
//           revenue: revenue,
//           expenses: expenses,
//         };
//       })
//     );
//   }, [data]);

//   const revenueProfit = useMemo(() => {
//     return (
//       data &&
//       data[0].monthlyData.map(({ month, revenue, expenses }) => {
//         return {
//           name: month.substring(0, 3),
//           revenue: revenue,
//           profit: (revenue - expenses).toFixed(2),
//         };
//       })
//     );
//   }, [data]);

//   return (
//     <>
//       <DashboardBox gridArea="a">
//         <BoxHeader
//           title="Revenue and Expenses"
//           subtitle="top line represents revenue, bottom line represents expenses"
        
//         />
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             width={500}
//             height={400}
//             data={revenueExpenses}
//             margin={{
//               top: 15,
//               right: 25,
//               left: -10,
//               bottom: 60,
//             }}
//           >
//             <defs>
//               <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor={palette.primary[300]}
//                   stopOpacity={0.5}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor={palette.primary[300]}
//                   stopOpacity={0}
//                 />
//               </linearGradient>
//               <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor={palette.primary[300]}
//                   stopOpacity={0.5}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor={palette.primary[300]}
//                   stopOpacity={0}
//                 />
//               </linearGradient>
//             </defs>
//             <XAxis
//               dataKey="name"
//               tickLine={false}
//               style={{ fontSize: "15px" }}
//             />
//             <YAxis
//               tickLine={false}
//               axisLine={{ strokeWidth: "0" }}
//               style={{ fontSize: "15px" }}
//               domain={[8000, 23000]}
//             />
//             <Tooltip />
//             <Area
//               type="monotone"
//               dataKey="revenue"
//               dot={true}
//               stroke={palette.primary.main}
//               fillOpacity={1}
//               fill="url(#colorRevenue)"
//             />
//             <Area
//               type="monotone"
//               dataKey="expenses"
//               dot={true}
//               stroke={palette.primary.main}
//               fillOpacity={1}
//               fill="url(#colorExpenses)"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </DashboardBox>
//       <DashboardBox gridArea="b">
//         <BoxHeader
//           title="Profit and Revenue"
//           subtitle="top line represents revenue, bottom line represents expenses"
        
//         />
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart
//             width={500}
//             height={400}
//             data={revenueProfit}
//             margin={{
//               top: 20,
//               right: 0,
//               left: -10,
//               bottom: 55,
//             }}
//           >
//             <CartesianGrid vertical={false} stroke={palette.grey[800]} />
//             <XAxis
//               dataKey="name"
//               tickLine={false}
//               style={{ fontSize: "15px" }}
//             />
//             <YAxis
//               yAxisId="left"
//               tickLine={false}
//               axisLine={false}
//               style={{ fontSize: "15px" }}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               tickLine={false}
//               axisLine={false}
//               style={{ fontSize: "15px" }}
//             />
//             <Tooltip />
//             <Legend
//               height={20}
//               wrapperStyle={{
//                 margin: "0 0 10px 0",
//               }}
//             />
//             <Line
//               yAxisId="left"
//               type="monotone"
//               dataKey="profit"
//               stroke={palette.tertiary[500]}
//             />
//             <Line
//               yAxisId="right"
//               type="monotone"
//               dataKey="revenue"
//               stroke={palette.primary.main}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </DashboardBox>
//       <DashboardBox gridArea="c">
//         <BoxHeader
//           title="Revenue Month by Month"
//           subtitle="graph representing the revenue month by month"
          
//         />
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart
//             width={500}
//             height={300}
//             data={revenue}
//             margin={{
//               top: 17,
//               right: 15,
//               left: -5,
//               bottom: 58,
//             }}
//           >
//             <defs>
//               <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor={palette.primary[300]}
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor={palette.primary[300]}
//                   stopOpacity={0}
//                 />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} stroke={palette.grey[800]} />
//             <XAxis
//               dataKey="name"
//               axisLine={false}
//               tickLine={false}
//               style={{ fontSize: "15px" }}
//             />
//             <YAxis
//               axisLine={false}
//               tickLine={false}
//               style={{ fontSize: "15px" }}
//             />
//             <Tooltip />
//             <Bar dataKey="revenue" fill="url(#colorRevenue)" />
//           </BarChart>
//         </ResponsiveContainer>
//       </DashboardBox>
//     </>
//   );
// };

// export default Row1;
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import { useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
} from "recharts";

const Row1 = () => {
  const { palette } = useTheme();
  const { data, isLoading, error } = useGetKpisQuery();

  // 🔍 Debugging logs (Remove after fixing)
  console.log("API Data:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  // ✅ Ensure data exists before mapping
  const revenue = useMemo(() => {
    if (!data || !data[0]?.monthlyData) return []; // Default empty array
    return data[0].monthlyData.map(({ month, revenue }) => ({
      name: month?.substring(0, 3) || "N/A", // Safe substring check
      revenue: revenue || 0, // Default value
    }));
  }, [data]);

  const revenueExpenses = useMemo(() => {
    if (!data || !data[0]?.monthlyData) return [];
    return data[0].monthlyData.map(({ month, revenue, expenses }) => ({
      name: month?.substring(0, 3) || "N/A",
      revenue: revenue || 0,
      expenses: expenses || 0,
    }));
  }, [data]);

  const revenueProfit = useMemo(() => {
    if (!data || !data[0]?.monthlyData) return [];
    return data[0].monthlyData.map(({ month, revenue, expenses }) => ({
      name: month?.substring(0, 3) || "N/A",
      revenue: revenue || 0,
      profit: ((revenue || 0) - (expenses || 0)).toFixed(2),
    }));
  }, [data]);

  if (isLoading) return <p>Loading data...</p>;
  if (error) return <p>Error loading data.</p>;

  return (
    <>
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Revenue and Expenses"
          subtitle="Top line represents revenue, bottom line represents expenses"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={revenueExpenses}
            margin={{ top: 15, right: 25, left: -10, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.5} />
                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.5} />
                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: "15px" }} />
            <YAxis tickLine={false} axisLine={{ strokeWidth: "0" }} style={{ fontSize: "15px" }} domain={[8000, 23000]} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" dot stroke={palette.primary.main} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="expenses" dot stroke={palette.primary.main} fill="url(#colorExpenses)" />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="b">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="Top line represents revenue, bottom line represents expenses"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={400} data={revenueProfit} margin={{ top: 20, right: 0, left: -10, bottom: 55 }}>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: "15px" }} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} style={{ fontSize: "15px" }} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} style={{ fontSize: "15px" }} />
            <Tooltip />
            <Legend height={20} wrapperStyle={{ margin: "0 0 10px 0" }} />
            <Line yAxisId="left" type="monotone" dataKey="profit" stroke={palette.tertiary[500]} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke={palette.primary.main} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="c">
        <BoxHeader title="Revenue Month by Month" subtitle="Graph representing the revenue month by month" />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={revenue} margin={{ top: 17, right: 15, left: -5, bottom: 58 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={palette.primary[300]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={palette.primary[300]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: "15px" }} />
            <YAxis axisLine={false} tickLine={false} style={{ fontSize: "15px" }} />
            <Tooltip />
            <Bar dataKey="revenue" fill="url(#colorRevenue)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row1;

