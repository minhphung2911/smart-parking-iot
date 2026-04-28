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
        // --- CẤU HÌNH HỆ THỐNG ---
        // Đổi COM3 thành cổng thực tế bạn dùng trong Proteus (ví dụ COM1, COM2...)
        SerialPort serial = new SerialPort("COM3", 9600);

        // Chuỗi kết nối SQL Server LocalDB
        string connStr = @"Data Source=(localdb)\ProjectModels;Initial Catalog=ParkingDB;Integrated Security=True";

        // Quản lý 4 ô đỗ xe (Slots)
        Panel[] slotPanels = new Panel[4];
        bool isAutoMode = true; // Mặc định là chế độ AUTO

        public Form1()
        {
            InitializeComponent();
            InitSlotUI(); // Vẽ 4 ô đỗ xe lên giao diện

            // Thiết lập nhận dữ liệu từ Arduino
            serial.DataReceived += Serial_DataReceived;
            try { if (!serial.IsOpen) serial.Open(); } catch { }

            LoadData(); // Tải dữ liệu từ SQL lên bảng hiển thị
        }

        // --- GIAO DIỆN (UI) ---
        // Hàm này tự động tạo 4 ô vuông xanh trên màn hình khi nhấn Start
        void InitSlotUI()
        {
            for (int i = 0; i < 4; i++)
            {
                Panel p = new Panel
                {
                    Width = 80,
                    Height = 80,
                    BackColor = Color.LightGreen,
                    Left = 220 + (i * 90),
                    Top = 80,
                    Tag = i + 1
                };
                p.Click += SlotPanel_Click; // Sự kiện Click cho chế độ Manual

                Label lbl = new Label
                {
                    Text = "S" + (i + 1),
                    Dock = DockStyle.Fill,
                    TextAlign = ContentAlignment.MiddleCenter,
                    Enabled = false
                };
                p.Controls.Add(lbl);
                this.Controls.Add(p);
                slotPanels[i] = p;
            }
        }

        // --- XỬ LÝ SỰ KIỆN NÚT BẤM (Sửa lỗi CS1061) ---

        // 1. Nút Vào Cổng (Entry)
        private void btnEntry_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(txtPlate.Text))
            {
                XeVao(txtPlate.Text);
                txtPlate.Clear();
            }
            else
            {
                MessageBox.Show("Vui lòng nhập biển số xe!");
            }
        }

        // 2. Nút Ra Cổng (Exit)
        private void btnExit_Click(object sender, EventArgs e)
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                // Tìm xe đỗ lâu nhất để cho ra trước (FIFO)
                string q = "SELECT TOP 1 SlotNumber FROM ParkingLog WHERE TimeOut IS NULL ORDER BY TimeIn ASC";
                SqlCommand cmd = new SqlCommand(q, conn);
                object result = cmd.ExecuteScalar();
                if (result != null) XeRaTheoSlot((int)result);
                else MessageBox.Show("Không còn xe nào trong bãi!");
            }
        }

        // 3. Nút Chuyển Chế Độ (Mode)
        private void btnMode_Click(object sender, EventArgs e)
        {
            isAutoMode = !isAutoMode;
            btnMode.Text = isAutoMode ? "CHẾ ĐỘ: AUTO" : "CHẾ ĐỘ: MANUAL";
            btnMode.BackColor = isAutoMode ? Color.LightGray : Color.Orange;
            if (serial.IsOpen) serial.WriteLine(isAutoMode ? "MODE:AUTO" : "MODE:MANUAL");
        }

        // 4. Click trực tiếp vào ô đỗ (Chỉ dùng cho Manual Mode)
        private void SlotPanel_Click(object sender, EventArgs e)
        {
            if (isAutoMode)
            {
                MessageBox.Show("Hãy chuyển sang MANUAL mode để thao tác trực tiếp!");
                return;
            }

            Panel p = (Panel)sender;
            int slotNum = (int)p.Tag;

            if (p.BackColor == Color.LightGreen)
            {
                string randomPlate = "51A-" + new Random().Next(10000, 99999).ToString();
                XeVao(randomPlate, slotNum);
                if (serial.IsOpen) serial.WriteLine("OPEN_GATE");
            }
            else
            {
                XeRaTheoSlot(slotNum);
                if (serial.IsOpen) serial.WriteLine("OPEN_GATE");
            }
        }

        // --- XỬ LÝ DATABASE (SQL) ---

        void XeVao(string plate, int manualSlot = -1)
        {
            int slotToAssign = manualSlot;
            if (slotToAssign == -1)
            {
                for (int i = 0; i < 4; i++)
                    if (slotPanels[i].BackColor == Color.LightGreen) { slotToAssign = i + 1; break; }
            }

            if (slotToAssign == -1) { MessageBox.Show("Hết chỗ!"); return; }

            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    string q = "INSERT INTO ParkingLog (Plate, TimeIn, SlotNumber) VALUES (@p, GETDATE(), @s)";
                    SqlCommand cmd = new SqlCommand(q, conn);
                    cmd.Parameters.AddWithValue("@p", plate);
                    cmd.Parameters.AddWithValue("@s", slotToAssign);
                    cmd.ExecuteNonQuery();
                }
                LoadData();
            }
            catch (Exception ex) { MessageBox.Show("Lỗi SQL: " + ex.Message); }
        }

        void XeRaTheoSlot(int slot)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    string g = "SELECT TOP 1 Id, TimeIn, Plate FROM ParkingLog WHERE SlotNumber=@s AND TimeOut IS NULL";
                    SqlCommand cmd = new SqlCommand(g, conn);
                    cmd.Parameters.AddWithValue("@s", slot);
                    SqlDataReader r = cmd.ExecuteReader();
                    if (r.Read())
                    {
                        int id = r.GetInt32(0);
                        DateTime tIn = r.GetDateTime(1);
                        string p = r.GetString(2);
                        r.Close();

                        double fee = Math.Max(1, Math.Ceiling((DateTime.Now - tIn).TotalHours)) * 5000;
                        string u = "UPDATE ParkingLog SET TimeOut=GETDATE(), Fee=@f WHERE Id=@id";
                        SqlCommand uc = new SqlCommand(u, conn);
                        uc.Parameters.AddWithValue("@f", fee);
                        uc.Parameters.AddWithValue("@id", id);
                        uc.ExecuteNonQuery();
                        MessageBox.Show($"Xe {p} ra bãi. Phí: {fee:N0} VNĐ");
                    }
                    r.Close();
                }
                LoadData();
            }
            catch (Exception ex) { MessageBox.Show("Lỗi SQL: " + ex.Message); }
        }

        // --- KẾT NỐI ARDUINO ---
        private void Serial_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            try
            {
                string data = serial.ReadLine().Trim();
                this.Invoke(new Action(() => {
                    if (data.StartsWith("SLOTS:")) UpdateSlots(data.Replace("SLOTS:", ""));
                }));
            }
            catch { }
        }

        void UpdateSlots(string status)
        {
            string[] s = status.Split(',');
            for (int i = 0; i < 4; i++)
            {
                // Arduino: HIGH (1) là trống, LOW (0) là có xe
                slotPanels[i].BackColor = (s[i] == "1") ? Color.LightGreen : Color.IndianRed;
            }
        }

        void LoadData()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    // Load xe đang trong bãi
                    SqlDataAdapter da1 = new SqlDataAdapter("SELECT Plate, TimeIn, SlotNumber FROM ParkingLog WHERE TimeOut IS NULL", conn);
                    DataTable dt1 = new DataTable(); da1.Fill(dt1);
                    dgvCurrent.DataSource = dt1;

                    // Load lịch sử 10 xe gần nhất
                    SqlDataAdapter da2 = new SqlDataAdapter("SELECT TOP 10 Plate, TimeIn, TimeOut, Fee FROM ParkingLog WHERE TimeOut IS NOT NULL ORDER BY TimeOut DESC", conn);
                    DataTable dt2 = new DataTable(); da2.Fill(dt2);
                    dgvHistory.DataSource = dt2;
                }
            }
            catch { }
        }
    }
}