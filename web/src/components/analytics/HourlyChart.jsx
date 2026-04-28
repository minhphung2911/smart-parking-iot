import { Card, CardContent, Typography, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "6 AM", vehicles: 10 },
  { time: "7 AM", vehicles: 22 },
  { time: "8 AM", vehicles: 38 },
  { time: "9 AM", vehicles: 45 },
  { time: "10 AM", vehicles: 40 },
  { time: "11 AM", vehicles: 35 },
  { time: "12 PM", vehicles: 50 },
  { time: "1 PM", vehicles: 48 },
  { time: "2 PM", vehicles: 30 },
  { time: "3 PM", vehicles: 25 },
];

const HourlyChart = () => {
  return (
    <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none', height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={3}>Peak Hourly Check-ins</Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#697386', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#697386', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#1976d2', fontWeight: 600 }}
              />
              <Line type="monotone" dataKey="vehicles" stroke="#1976d2" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HourlyChart;
