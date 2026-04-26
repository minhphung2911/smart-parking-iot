using System;
using System.Data;
using System.Data.SqlClient; // kết nối database
using System.IO.Ports;       // đọc dữ liệu Arduino
using System.Windows.Forms;

namespace SmartParking
{
    public partial class Form1 : Form
    {
        // =========================
        // KHAI BÁO BIẾN
        // =========================

        // Serial để đọc Arduino (NHỚ sửa COM)
        SerialPort serial = new SerialPort("COM3", 9600);

        // Chuỗi kết nối SQL Server
        string connStr = "Data Source=.;Initial Catalog=ParkingDB;Integrated Security=True";

        public Form1()
        {
            InitializeComponent();
        }

        // =========================
        // CONNECT ARDUINO
        // =========================
        private void btnConnect_Click(object sender, EventArgs e)
        {
            try
            {
                serial.DataReceived += Serial_DataReceived; // đăng ký sự kiện nhận dữ liệu
                serial.Open(); // mở cổng COM
                MessageBox.Show("Connected!");
            }
            catch
            {
                MessageBox.Show("Không mở được COM!");
            }
        }

        // =========================
        // NHẬN DỮ LIỆU TỪ ARDUINO
        // =========================
        private void Serial_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            string data = serial.ReadLine().Trim(); // đọc 1 dòng

            // phải dùng Invoke vì khác thread
            this.Invoke(new Action(() =>
            {
                txtSerial.AppendText(data + "\r\n"); // hiển thị lên textbox
                HandleData(data); // xử lý dữ liệu
            }));
        }

        // =========================
        // XỬ LÝ DỮ LIỆU SERIAL
        // =========================
        void HandleData(string data)
        {
            if (data.StartsWith("ENTRY"))
            {
                // nếu Arduino gửi ENTRY:51A12345
                string plate = data.Contains(":") ? data.Split(':')[1] : txtPlate.Text;
                txtPlate.Text = plate;
                XeVao();
            }
            else if (data.StartsWith("EXIT"))
            {
                string plate = data.Contains(":") ? data.Split(':')[1] : txtPlate.Text;
                txtPlate.Text = plate;
                XeRa();
            }
            else if (data.StartsWith("SLOTS"))
            {
                int slots = int.Parse(data.Split(':')[1]);
                lblSlots.Text = "Slots: " + slots;
            }
        }

        // =========================
        // XE VÀO
        // =========================
        void XeVao()
        {
            string plate = txtPlate.Text.Trim();

            if (plate == "")
            {
                MessageBox.Show("Nhập biển số!");
                return;
            }

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();

                // kiểm tra xe đã trong bãi chưa
                string check = "SELECT COUNT(*) FROM ParkingLog WHERE Plate=@p AND TimeOut IS NULL";
                SqlCommand cmdCheck = new SqlCommand(check, conn);
                cmdCheck.Parameters.AddWithValue("@p", plate);

                int exists = (int)cmdCheck.ExecuteScalar();

                if (exists > 0)
                {
                    MessageBox.Show("Xe đã ở trong bãi!");
                    return;
                }

                // thêm xe vào
                string query = "INSERT INTO ParkingLog (Plate, TimeIn) VALUES (@p, GETDATE())";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@p", plate);

                cmd.ExecuteNonQuery();
            }

            LoadCurrent();
            LoadHistory();
        }

        // =========================
        // XE RA + TÍNH TIỀN
        // =========================
        void XeRa()
        {
            string plate = txtPlate.Text.Trim();

            if (plate == "")
            {
                MessageBox.Show("Nhập biển số!");
                return;
            }

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();

                // tìm xe chưa ra
                string query = "SELECT * FROM ParkingLog WHERE Plate=@p AND TimeOut IS NULL";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@p", plate);

                SqlDataReader reader = cmd.ExecuteReader();

                if (!reader.Read())
                {
                    MessageBox.Show("Không tìm thấy xe!");
                    return;
                }

                int id = (int)reader["Id"];
                DateTime timeIn = (DateTime)reader["TimeIn"];
                reader.Close();

                // tính tiền
                DateTime now = DateTime.Now;
                double hours = (now - timeIn).TotalHours;
                double fee = Math.Ceiling(hours) * 5000;

                // update DB
                string update = "UPDATE ParkingLog SET TimeOut=@out, Fee=@fee WHERE Id=@id";

                SqlCommand cmd2 = new SqlCommand(update, conn);
                cmd2.Parameters.AddWithValue("@out", now);
                cmd2.Parameters.AddWithValue("@fee", fee);
                cmd2.Parameters.AddWithValue("@id", id);

                cmd2.ExecuteNonQuery();

                MessageBox.Show("Tiền: " + fee + " VND");
            }

            LoadCurrent();
            LoadHistory();
        }

        // =========================
        // LOAD XE ĐANG TRONG BÃI
        // =========================
        void LoadCurrent()
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();

                SqlDataAdapter da = new SqlDataAdapter(
                    "SELECT * FROM ParkingLog WHERE TimeOut IS NULL", conn);

                DataTable dt = new DataTable();
                da.Fill(dt);

                dgvCurrent.DataSource = dt;
            }
        }

        // =========================
        // LOAD LỊCH SỬ
        // =========================
        void LoadHistory()
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();

                SqlDataAdapter da = new SqlDataAdapter(
                    "SELECT * FROM ParkingLog WHERE TimeOut IS NOT NULL", conn);

                DataTable dt = new DataTable();
                da.Fill(dt);

                dgvHistory.DataSource = dt;
            }
        }

        // =========================
        // BUTTON CLICK THỦ CÔNG
        // =========================
        private void btnEntry_Click(object sender, EventArgs e)
        {
            XeVao();
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            XeRa();
        }
    }
}