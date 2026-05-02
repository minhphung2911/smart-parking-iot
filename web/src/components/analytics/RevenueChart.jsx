import { Card, CardContent, Typography, Box } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", revenue: 180 },
  { day: "Tue", revenue: 210 },
  { day: "Wed", revenue: 195 },
  { day: "Thu", revenue: 250 },
  { day: "Fri", revenue: 310 },
  { day: "Sat", revenue: 420 },
  { day: "Sun", revenue: 380 },
];

const RevenueChart = ({ data: chartData }) => {
  const displayData = chartData?.length > 0 ? chartData : [
    { day: "Thứ 2", revenue: 0 },
    { day: "Thứ 3", revenue: 0 },
    { day: "Thứ 4", revenue: 0 },
    { day: "Thứ 5", revenue: 0 },
    { day: "Thứ 6", revenue: 0 },
    { day: "Thứ 7", revenue: 0 },
    { day: "CN", revenue: 0 },
  ];

  return (
    <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none', height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={3}>Xu hướng doanh thu 7 ngày</Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#697386', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#697386', fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toLocaleString()}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#059669', fontWeight: 600 }}
                formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
