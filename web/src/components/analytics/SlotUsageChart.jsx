import { Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { slot: "A1", usage: 85 },
  { slot: "A2", usage: 72 },
  { slot: "A3", usage: 65 },
  { slot: "B1", usage: 90 },
  { slot: "B2", usage: 55 },
  { slot: "C1", usage: 40 },
  { slot: "D4", usage: 15 },
];

const SlotUsageChart = () => {
  return (
    <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none', height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={3}>Slot Usage Frequency (Top/Bottom)</Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#697386', fontSize: 12 }} />
              <YAxis dataKey="slot" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0a0a0a', fontWeight: 600, fontSize: 12 }} width={40} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#f59e0b', fontWeight: 600 }}
              />
              <Bar dataKey="usage" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SlotUsageChart;
