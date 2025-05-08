import DashboardBox from "@/components/DashboardBox";
import BoxHeader from "@/components/BoxHeader";
import { Box, Typography, useTheme } from "@mui/material";
import { useGetKpisQuery } from "@/state/api";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,

} from "recharts";

const ProfitWaterfallChart = () => {
  const { palette } = useTheme();
  const { data: kpiData } = useGetKpisQuery();

  const waterfallData = useMemo(() => {
    if (!kpiData || !kpiData[0]?.monthlyData) return [];

    return kpiData[0].monthlyData.map((item) => ({
      month: item.month.substring(0, 3), // e.g., Jan, Feb
      revenue: item.revenue,
      expenses: item.expenses,
      profit: item.revenue - item.expenses,

    }));
  }, [kpiData]);

  return (
    <DashboardBox gridArea="i">
      <BoxHeader title="Revenue Month By Month" sideText="" />
      <Box height="100%" p="1rem">
        <ResponsiveContainer width={800} height={300}>
          <BarChart
            data={waterfallData}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid spacing={2} vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="month" angle={-45} // Rotates the labels to avoid overlap
              textAnchor="end"
              height={60} tick={{ fill: palette.text.primary }} />
            <YAxis tick={{ fill: palette.text.primary }} />
            <Tooltip
              formatter={(value: number) => `$${value}`}
              contentStyle={{ backgroundColor: palette.background.paper, border: "none" }}
            />
            <Bar
              dataKey="profit"
              fill={palette.primary[500]}
              radius={[10, 10, 0, 0]}
              barSize={29}
              isAnimationActive={true}
            >
              <LabelList dataKey="profit"  fontSize="0.75rem" position="top" formatter={(val: number) => `$${val.toLocaleString()}`} />
            </Bar>
          </BarChart>
          
        </ResponsiveContainer>
      </Box>
    </DashboardBox>
  );
};

export default ProfitWaterfallChart;
