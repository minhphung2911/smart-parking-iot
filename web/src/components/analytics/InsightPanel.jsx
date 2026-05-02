import { Card, CardContent, Typography, Box, Stack, Divider } from "@mui/material";
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import InsightsIcon from '@mui/icons-material/Insights';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const InsightRow = ({ icon, title, value, detail }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 1.5 }}>
    <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{title}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.2 }}>{value}</Typography>
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, bgcolor: 'success.50', px: 1, py: 0.5, borderRadius: 1 }}>
        {detail}
      </Typography>
    </Box>
  </Stack>
);

const InsightPanel = () => {
  return (
    <Card sx={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none', height: '100%', bgcolor: '#f8fafc' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <InsightsIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700} color="primary.dark">Thông tin dự báo AI</Typography>
        </Stack>

        <Stack spacing={0} divider={<Divider />}>
          <InsightRow 
            icon={<AccessTimeIcon />} 
            title="Giờ cao điểm hiện tại" 
            value="8:00 AM - 10:00 AM" 
            detail="Dự báo ngày mai: 8:15 AM" 
          />
          <InsightRow 
            icon={<LocalParkingIcon />} 
            title="Vị trí được dùng nhiều nhất" 
            value="A1 (85 lượt)" 
            detail="Đề xuất giá VIP" 
          />
          <InsightRow 
            icon={<LocalParkingIcon sx={{ opacity: 0.5 }} />} 
            title="Vị trí ít được dùng nhất" 
            value="D4 (15 lượt)" 
            detail="Kiểm tra vật cản" 
          />
          <InsightRow 
            icon={<LightbulbCircleIcon />} 
            title="Thời gian đỗ trung bình" 
            value="1 giờ 48 phút" 
            detail="Tỷ lệ quay vòng tối ưu" 
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InsightPanel;
