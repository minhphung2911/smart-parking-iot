using System;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.IO.Ports;
using System.Windows.Forms;

namespace SmartParking
{
    public partial class Form1 : Form
    {
        // Khởi tạo cổng COM (Sửa tên cổng phù hợp với máy bạn, ví dụ COM2, COM3...)
        SerialPort serial = new SerialPort("COM3", 9600);

        // Chuỗi kết nối Database
        string connStr = @"Data Source=(localdb)\ProjectModels;Initial Catalog=ParkingDB;Integrated Security=True";

        // Mảng quản lý các ô đỗ xe trên giao diện
        Panel[] slotPanels = new Panel[5];

        public Form1()
        {
            InitializeComponent();
            InitSlotUI(); // Vẽ các ô đỗ xe khi mở app

            // Đăng ký sự kiện nhận dữ liệu từ Arduino
            serial.DataReceived += Serial_DataReceived;
            try
            {
                if (!serial.IsOpen) serial.Open();
            }
            catch
            {
                MessageBox.Show("Cảnh báo: Không thể mở cổng COM. Hãy kiểm tra kết nối Arduino/Proteus.");
            }

            LoadData(); // Nạp dữ liệu từ Database lên các bảng
        }

        // ================= GIAO DIỆN CÁC Ô ĐỖ XE =================
        void InitSlotUI()
        {
            for (int i = 0; i < 5; i++)
            {
                Panel p = new Panel
                {
                    Width = 80,
                    Height = 80,
                    BackColor = Color.LightGreen,
                    Left = 300 + (i * 90),
                    Top = 80,
                    Tag = i + 1 // Lưu số Slot
                };
                Label lbl = new Label
                {
                    Text = "Slot " + (i + 1),
                    Dock = DockStyle.Fill,
                    TextAlign = ContentAlignment.MiddleCenter
                };
                p.Controls.Add(lbl);
                this.Controls.Add(p);
                slotPanels[i] = p;
            }
        }

        // ================= QUẢN LÝ DỮ LIỆU =================
        void LoadData()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    // 1. Lấy danh sách xe đang trong bãi
                    SqlDataAdapter daCur = new SqlDataAdapter("SELECT Plate, TimeIn, SlotNumber FROM ParkingLog WHERE TimeOut IS NULL", conn);
                    DataTable dtCur = new DataTable();
                    daCur.Fill(dtCur);
                    dgvCurrent.DataSource = dtCur;

                    // 2. Lấy lịch sử 10 xe ra gần nhất
                    SqlDataAdapter daHis = new SqlDataAdapter("SELECT TOP 10 Plate, TimeIn, TimeOut, Fee FROM ParkingLog WHERE TimeOut IS NOT NULL ORDER BY TimeOut DESC", conn);
                    DataTable dtHis = new DataTable();
                    daHis.Fill(dtHis);
                    dgvHistory.DataSource = dtHis;

                    // 3. Cập nhật màu sắc các ô đỗ xe dựa trên dữ liệu thật
                    UpdateSlotColors(dtCur);
                }
            }
            catch (Exception ex) { Console.WriteLine("Lỗi LoadData: " + ex.Message); }
        }

        void UpdateSlotColors(DataTable dtActive)
        {
            // Reset tất cả về màu xanh (Trống)
            foreach (var p in slotPanels) p.BackColor = Color.LightGreen;

            // Chỗ nào có xe trong DB thì đổi sang màu đỏ (Đầy)
            foreach (DataRow row in dtActive.Rows)
            {
                int slotNum = Convert.ToInt32(row["SlotNumber"]);
                if (slotNum >= 1 && slotNum <= 5)
                    slotPanels[slotNum - 1].BackColor = Color.IndianRed;
            }
        }

        // ================= NGHIỆP VỤ XE VÀO / RA =================
        void XeVao(string plate)
        {
            if (string.IsNullOrEmpty(plate)) return;

            // Tìm slot trống đầu tiên
            int slotToAssign = -1;
            for (int i = 0; i < slotPanels.Length; i++)
            {
                if (slotPanels[i].BackColor == Color.LightGreen)
                {
                    slotToAssign = i + 1;
                    break;
                }
            }

            if (slotToAssign == -1)
            {
                MessageBox.Show("Bãi xe đã đầy!");
                return;
            }

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                string query = "INSERT INTO ParkingLog (Plate, TimeIn, SlotNumber) VALUES (@plate, GETDATE(), @slot)";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@plate", plate);
                cmd.Parameters.AddWithValue("@slot", slotToAssign);
                cmd.ExecuteNonQuery();
            }
            LoadData(); // Cập nhật lại giao diện
        }

        // Hàm xử lý xe ra (Đã sửa tên không dấu)
        void XeRaNgauNhien()
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                // Tìm xe vào sớm nhất mà chưa ra để xử lý
                string getQuery = "SELECT TOP 1 Id, TimeIn, Plate FROM ParkingLog WHERE TimeOut IS NULL ORDER BY TimeIn ASC";
                SqlCommand cmd = new SqlCommand(getQuery, conn);
                SqlDataReader r = cmd.ExecuteReader();

                if (r.Read())
                {
                    int id = r.GetInt32(0);
                    DateTime timeIn = r.GetDateTime(1);
                    string plate = r.GetString(2);
                    r.Close();

                    // Tính tiền: 5000đ mỗi giờ (tối thiểu 1 giờ)
                    double hours = (DateTime.Now - timeIn).TotalHours;
                    double fee = Math.Max(1, Math.Ceiling(hours)) * 5000;

                    string upQuery = "UPDATE ParkingLog SET TimeOut=GETDATE(), Fee=@fee WHERE Id=@id";
                    SqlCommand upCmd = new SqlCommand(upQuery, conn);
                    upCmd.Parameters.AddWithValue("@fee", fee);
                    upCmd.Parameters.AddWithValue("@id", id);
                    upCmd.ExecuteNonQuery();

                    MessageBox.Show($"Xe {plate} ra bãi.\nThời gian gửi: {hours:N1} giờ.\nPhí thanh toán: {fee:N0} VNĐ");
                }
                else
                {
                    r.Close();
                    MessageBox.Show("Bãi hiện đang trống, không có xe để xuất!");
                }
            }
            LoadData();
        }

        // ================= SỰ KIỆN TỪ ARDUINO / GIAO DIỆN =================
        private void Serial_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            try
            {
                string raw = serial.ReadLine().Trim();
                string[] parts = raw.Split('|');

                // Đảm bảo cập nhật giao diện từ luồng khác không bị lỗi (Thread-safe)
                this.Invoke(new Action(() => {
                    if (parts[0] == "ENTRY") XeVao(parts[1]);
                    if (parts[0] == "EXIT") XeRaNgauNhien();
                }));
            }
            catch { }
        }

        // Xử lý khi nhấn nút trên giao diện (nếu bạn có tạo nút)
        private void btnEntry_Click(object sender, EventArgs e)
        {
            XeVao(txtPlate.Text);
            txtPlate.Clear();
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            XeRaNgauNhien();
        }
    }
}