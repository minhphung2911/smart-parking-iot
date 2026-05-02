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
        SerialPort serial = new SerialPort("COM3", 9600);
        string connStr = @"Server=localhost,1433;Database=SmartParkingDB;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True";
        
        double totalRevenue = 0;
        private static readonly Random random = new Random();

        // Debounce cho cập nhật slot từ Arduino
        private System.Windows.Forms.Timer slotUpdateTimer;
        private string pendingSlotStatus = null;
        private string lastAppliedSlotStatus = null;

        public Form1()
        {
            InitializeComponent();
            WireUpEvents();
            LoadComPorts();
            LoadData();
            UpdateStats(5, 0);
            
            // Setup serial
            serial.DataReceived += Serial_DataReceived;
            
            // Setup debounce timer (500ms) - chỉ update UI sau khi trạng thái ổn định
            slotUpdateTimer = new System.Windows.Forms.Timer();
            slotUpdateTimer.Interval = 500;
            slotUpdateTimer.Tick += (s, ev) =>
            {
                slotUpdateTimer.Stop();
                if (pendingSlotStatus != null && pendingSlotStatus != lastAppliedSlotStatus)
                {
                    ApplySlotUpdate(pendingSlotStatus);
                    lastAppliedSlotStatus = pendingSlotStatus;
                }
            };
        }

        void WireUpEvents()
        {
            // Control buttons
            btnAutoEntry.Click += btnAutoEntry_Click;
            btnAutoExit.Click += btnAutoExit_Click;
            btnConnect.Click += btnConnect_Click;
            
            // Slot click events
            for (int i = 0; i < 5; i++)
            {
                int slotIndex = i;
                slotPanels[i].Click += (s, e) => SlotPanel_Click(slotIndex);
            }
        }

        void LoadComPorts()
        {
            cmbComPort.Items.Clear();
            foreach (string port in SerialPort.GetPortNames())
                cmbComPort.Items.Add(port);
            if (cmbComPort.Items.Count > 0)
                cmbComPort.SelectedIndex = 0;
        }

        // --- NÚT BẤM ---
        private void btnEntry_Click(object sender, EventArgs e)
        {
            OpenEntryGate();
            XeVao(GenerateRandomLicensePlate());
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                string q = "SELECT TOP 1 SlotNumber FROM ParkingLog WHERE TimeOut IS NULL ORDER BY TimeIn ASC";
                SqlCommand cmd = new SqlCommand(q, conn);
                object result = cmd.ExecuteScalar();
                if (result != null)
                {
                    OpenExitGate();
                    XeRaTheoSlot((int)result);
                }
                else MessageBox.Show("Không còn xe nào trong bãi!");
            }
        }

        private void btnAutoEntry_Click(object sender, EventArgs e)
        {
            // Mở cổng vào trước
            OpenEntryGate();
            
            string plate = GenerateRandomLicensePlate();
            XeVao(plate);
        }

        private void btnAutoExit_Click(object sender, EventArgs e)
        {
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                conn.Open();
                string q = "SELECT TOP 1 SlotNumber FROM ParkingLog WHERE TimeOut IS NULL ORDER BY TimeIn ASC";
                SqlCommand cmd = new SqlCommand(q, conn);
                object result = cmd.ExecuteScalar();
                if (result != null)
                {
                    // Mở cổng ra trước khi xe ra
                    OpenExitGate();
                    XeRaTheoSlot((int)result);
                }
                else MessageBox.Show("Không có xe để ra!");
            }
        }

        private void btnConnect_Click(object sender, EventArgs e)
        {
            if (!serial.IsOpen)
            {
                try
                {
                    serial.PortName = cmbComPort.Text;
                    serial.BaudRate = 9600;
                    serial.Open();
                    btnConnect.Text = "Ngắt";
                    btnConnect.BackColor = Color.LightCoral;
                    lblConnectionStatus.Text = "🟢 Đã kết nối";
                    lblConnectionStatus.ForeColor = Color.Green;
                    AddLog("Kết nối", "Đã kết nối Arduino", "", "Thành công");
                }
                catch (Exception ex) { MessageBox.Show("Lỗi kết nối: " + ex.Message); }
            }
            else
            {
                serial.Close();
                btnConnect.Text = "Kết nối";
                btnConnect.BackColor = Color.LightGreen;
                lblConnectionStatus.Text = "⚪ Chưa kết nối";
                lblConnectionStatus.ForeColor = Color.Gray;
                AddLog("Ngắt kết nối", "Đã ngắt kết nối", "", "");
            }
        }

        void SlotPanel_Click(int slotIndex)
        {
            if (slotPanels[slotIndex].BackColor == Color.LightGreen)
            {
                OpenEntryGate();
                string plate = GenerateRandomLicensePlate();
                XeVao(plate, slotIndex + 1);
            }
            else
            {
                OpenExitGate();
                XeRaTheoSlot(slotIndex + 1);
            }
        }

        // --- DATABASE ---
        void XeVao(string plate, int manualSlot = -1)
        {
            int slotToAssign = manualSlot;
            if (slotToAssign == -1)
            {
                for (int i = 0; i < 5; i++)
                    if (slotPanels[i].BackColor == Color.LightGreen) { slotToAssign = i + 1; break; }
            }
            if (slotToAssign == -1) { MessageBox.Show("Hết chỗ!"); return; }

            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    SqlTransaction trans = conn.BeginTransaction();
                    try
                    {
                        // 1. Vehicles
                        string checkV = "SELECT VehicleID FROM Vehicles WHERE PlateNumber=@p";
                        SqlCommand cmdV = new SqlCommand(checkV, conn, trans);
                        cmdV.Parameters.AddWithValue("@p", plate);
                        object vId = cmdV.ExecuteScalar();
                        if (vId == null)
                        {
                            string insertV = "INSERT INTO Vehicles (PlateNumber, VehicleType, IsVIP) VALUES (@p, 'Car', 0); SELECT SCOPE_IDENTITY();";
                            SqlCommand cmdIV = new SqlCommand(insertV, conn, trans);
                            cmdIV.Parameters.AddWithValue("@p", plate);
                            vId = cmdIV.ExecuteScalar();
                        }
                        int vehicleId = Convert.ToInt32(vId);
                        
                        // 2. ParkingSessions
                        string insertS = "INSERT INTO ParkingSessions (VehicleID, SlotID, CheckInTime, Status) VALUES (@v, @s, @now, 'Active')";
                        SqlCommand cmdS = new SqlCommand(insertS, conn, trans);
                        cmdS.Parameters.AddWithValue("@v", vehicleId);
                        cmdS.Parameters.AddWithValue("@s", slotToAssign);
                        cmdS.Parameters.AddWithValue("@now", DateTime.UtcNow);
                        cmdS.ExecuteNonQuery();
                        
                        // 3. ParkingSlots
                        string updateSlot = "UPDATE ParkingSlots SET Status='Occupied', LastUpdated=@now WHERE SlotID=@s";
                        SqlCommand cmdSlot = new SqlCommand(updateSlot, conn, trans);
                        cmdSlot.Parameters.AddWithValue("@s", slotToAssign);
                        cmdSlot.Parameters.AddWithValue("@now", DateTime.UtcNow);
                        cmdSlot.ExecuteNonQuery();
                        
                        // 4. Logs
                        string insertLog = "INSERT INTO Logs (EventTime, ActionType, PlateNumber, SlotCode, Source, Status, Details) VALUES (@now, 'Check-in', @p, @sc, 'WinForms', 'Success', 'Xe vao')";
                        SqlCommand cmdLog = new SqlCommand(insertLog, conn, trans);
                        cmdLog.Parameters.AddWithValue("@now", DateTime.UtcNow);
                        cmdLog.Parameters.AddWithValue("@p", plate);
                        cmdLog.Parameters.AddWithValue("@sc", "S" + slotToAssign);
                        cmdLog.ExecuteNonQuery();
                        
                        // 5. Legacy
                        string q = "INSERT INTO ParkingLog (Plate, TimeIn, SlotNumber) VALUES (@p, @now, @s)";
                        SqlCommand cmd = new SqlCommand(q, conn, trans);
                        cmd.Parameters.AddWithValue("@p", plate);
                        cmd.Parameters.AddWithValue("@now", DateTime.UtcNow);
                        cmd.Parameters.AddWithValue("@s", slotToAssign);
                        cmd.ExecuteNonQuery();
                        
                        trans.Commit();
                    }
                    catch { trans.Rollback(); throw; }
                }
                
                // Update UI
                slotPanels[slotToAssign - 1].BackColor = Color.IndianRed;
                slotLabels[slotToAssign - 1].Text = $"S{slotToAssign}\n{plate}\nCÓ XE";
                AddLog("Xe vào", plate, $"S{slotToAssign}", "Thành công");
                LoadData();
                UpdateSlotStats();
                
                // Notify Arduino
                if (serial.IsOpen) serial.WriteLine($"SLOT:{slotToAssign - 1},1");
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
                    SqlTransaction trans = conn.BeginTransaction();
                    try
                    {
                        string g = "SELECT TOP 1 Id, TimeIn, Plate FROM ParkingLog WHERE SlotNumber=@s AND TimeOut IS NULL";
                        SqlCommand cmd = new SqlCommand(g, conn, trans);
                        cmd.Parameters.AddWithValue("@s", slot);
                        SqlDataReader r = cmd.ExecuteReader();
                        if (r.Read())
                        {
                            int id = r.GetInt32(0);
                            DateTime tIn = r.GetDateTime(1);
                            string p = r.GetString(2);
                            r.Close();

                            double fee = Math.Max(1, Math.Ceiling((DateTime.UtcNow - tIn).TotalHours)) * 10000;
                            int duration = (int)(DateTime.UtcNow - tIn).TotalMinutes;
                            totalRevenue += fee;
                            
                            // 1. ParkingSessions
                            string updateS = "UPDATE ParkingSessions SET CheckOutTime=@now, DurationMinutes=@d, Fee=@f, Status='Closed' WHERE SlotID=@s AND Status='Active'";
                            SqlCommand cmdS = new SqlCommand(updateS, conn, trans);
                            cmdS.Parameters.AddWithValue("@now", DateTime.UtcNow);
                            cmdS.Parameters.AddWithValue("@d", duration);
                            cmdS.Parameters.AddWithValue("@f", fee);
                            cmdS.Parameters.AddWithValue("@s", slot);
                            cmdS.ExecuteNonQuery();
                            
                            // 2. ParkingSlots
                            string updateSlot = "UPDATE ParkingSlots SET Status='Available', LastUpdated=@now WHERE SlotID=@s";
                            SqlCommand cmdSlot = new SqlCommand(updateSlot, conn, trans);
                            cmdSlot.Parameters.AddWithValue("@now", DateTime.UtcNow);
                            cmdSlot.Parameters.AddWithValue("@s", slot);
                            cmdSlot.ExecuteNonQuery();
                            
                            // 3. Logs
                            string insertLog = "INSERT INTO Logs (EventTime, ActionType, PlateNumber, SlotCode, Source, Status, Details) VALUES (@now, 'Check-out', @p, @sc, 'WinForms', 'Success', @detail)";
                            SqlCommand cmdLog = new SqlCommand(insertLog, conn, trans);
                            cmdLog.Parameters.AddWithValue("@now", DateTime.UtcNow);
                            cmdLog.Parameters.AddWithValue("@p", p);
                            cmdLog.Parameters.AddWithValue("@sc", "S" + slot);
                            cmdLog.Parameters.AddWithValue("@detail", $"Phi: {fee:N0} VND");
                            cmdLog.ExecuteNonQuery();
                            
                            // 4. Legacy
                            string u = "UPDATE ParkingLog SET TimeOut=@now, Fee=@f WHERE Id=@id";
                            SqlCommand uc = new SqlCommand(u, conn, trans);
                            uc.Parameters.AddWithValue("@now", DateTime.UtcNow);
                            uc.Parameters.AddWithValue("@f", fee);
                            uc.Parameters.AddWithValue("@id", id);
                            uc.ExecuteNonQuery();
                            
                            // Update UI
                            slotPanels[slot - 1].BackColor = Color.LightGreen;
                            slotLabels[slot - 1].Text = $"S{slot}\n\nTRỐNG";
                            AddLog("Xe ra", p, $"S{slot}", $"Phi: {fee:N0} VND");
                            
                            trans.Commit();
                            
                            // Thông báo xe ra đã hiển thị trên log table, không cần MessageBox
                            
                            // Notify Arduino
                            if (serial.IsOpen) serial.WriteLine($"SLOT:{slot - 1},0");
                        }
                        else r.Close();
                    }
                    catch { trans.Rollback(); throw; }
                }
                LoadData();
                UpdateSlotStats();
            }
            catch (Exception ex) { MessageBox.Show("Lỗi SQL: " + ex.Message); }
        }

        // --- ARDUINO ---
        private void Serial_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            try
            {
                string data = serial.ReadLine().Trim();
                this.Invoke(new Action(() => {
                    if (data.StartsWith("SLOTS:")) 
                {
                    // Debounce: reset timer, lưu trạng thái chờ
                    pendingSlotStatus = data.Replace("SLOTS:", "");
                    slotUpdateTimer.Stop();
                    slotUpdateTimer.Start();
                }
                    else if (data == "ENTRY")
                    {
                        AddLog("Cổng vào", "Cảm biến", "", "Phát hiện xe vào");
                        XeVao(GenerateRandomLicensePlate());
                    }
                    else if (data == "EXIT")
                    {
                        AddLog("Cổng ra", "Cảm biến", "", "Phát hiện xe ra");
                        using (SqlConnection conn = new SqlConnection(connStr))
                        {
                            conn.Open();
                            string q = "SELECT TOP 1 SlotNumber FROM ParkingLog WHERE TimeOut IS NULL ORDER BY TimeIn ASC";
                            SqlCommand cmd = new SqlCommand(q, conn);
                            object result = cmd.ExecuteScalar();
                            if (result != null) XeRaTheoSlot((int)result);
                        }
                    }
                    else if (data == "GATE:OPENING") AddLog("Cổng", "Đang mở", "", "Servo hoạt động");
                    else if (data == "GATE:CLOSED") AddLog("Cổng", "Đã đóng", "", "Servo đóng");
                    else if (data == "FULL") AddLog("Cổng vào", "Bãi đầy", "", "Không mở cổng");
                }));
            }
            catch { }
        }

        void ApplySlotUpdate(string status)
        {
            try
            {
                string[] s = status.Split(',');
                bool needReload = false;
                for (int i = 0; i < 5; i++)
                {
                    // Arduino: 1=trống, 0=có xe
                    bool isEmpty = (s[i] == "1");
                    slotPanels[i].BackColor = isEmpty ? Color.LightGreen : Color.IndianRed;
                    
                    if (isEmpty && slotLabels[i].Text.Contains("CÓ XE"))
                    {
                        // Cảm biến báo trống và label đang hiển thị có xe → reset về trống
                        slotLabels[i].Text = $"S{i+1}\n\nTRỐNG";
                    }
                    else if (!isEmpty && !slotLabels[i].Text.Contains("CÓ XE") && !slotLabels[i].Text.Contains("TRỐNG"))
                    {
                        // Cảm biến báo có xe NHƯNG label bị lỗi/mất text
                        needReload = true;
                    }
                    else if (!isEmpty && slotLabels[i].Text.Contains("TRỐNG"))
                    {
                        // Cảm biến báo có xe nhưng label đang hiển thị TRỐNG → cần reload
                        needReload = true;
                    }
                }
                UpdateSlotStats();
                
                if (needReload)
                    LoadData();
            }
            catch { }
        }

        // --- UI UPDATES ---
        void UpdateSlotStats()
        {
            int empty = 0, occupied = 0;
            for (int i = 0; i < 5; i++)
            {
                if (slotPanels[i].BackColor == Color.LightGreen) empty++;
                else occupied++;
            }
            lblEmptySlots.Text = $"🟢 Trống: {empty}";
            lblOccupiedSlots.Text = $"🔴 Có xe: {occupied}";
            lblRevenue.Text = $"💰 Doanh thu: {totalRevenue:N0} VNĐ";
        }

        void UpdateStats(int empty, int occupied)
        {
            lblEmptySlots.Text = $"🟢 Trống: {empty}";
            lblOccupiedSlots.Text = $"🔴 Có xe: {occupied}";
            lblRevenue.Text = $"💰 Doanh thu: {totalRevenue:N0} VNĐ";
        }

        void AddLog(string evt, string plate, string slot, string detail)
        {
            ListViewItem item = new ListViewItem(DateTime.Now.ToString("HH:mm:ss"));
            item.SubItems.Add(evt);
            item.SubItems.Add(plate);
            item.SubItems.Add(slot);
            item.SubItems.Add(detail);
            lvLogs.Items.Insert(0, item);
        }

        void LoadData()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connStr))
                {
                    conn.Open();
                    // Load current from ParkingSessions
                    SqlDataAdapter da = new SqlDataAdapter(@"
                        SELECT v.PlateNumber, ps.CheckInTime, ps.SlotID as SlotNumber 
                        FROM ParkingSessions ps 
                        JOIN Vehicles v ON ps.VehicleID = v.VehicleID 
                        WHERE ps.Status='Active'", conn);
                    DataTable dt = new DataTable();
                    da.Fill(dt);
                    
                    // Update slot displays
                    foreach (DataRow row in dt.Rows)
                    {
                        int slot = Convert.ToInt32(row["SlotNumber"]) - 1;
                        if (slot >= 0 && slot < 5)
                        {
                            slotPanels[slot].BackColor = Color.IndianRed;
                            slotLabels[slot].Text = $"S{slot+1}\n{row["PlateNumber"]}\nCÓ XE";
                        }
                    }
                    UpdateSlotStats();
                }
            }
            catch { }
        }

        string GenerateRandomLicensePlate()
        {
            return $"{random.Next(10, 99)}{(char)random.Next('A', 'Z' + 1)}-{random.Next(10000, 99999)}";
        }

        // === GATE CONTROL ===
        void OpenEntryGate()
        {
            if (serial.IsOpen)
            {
                serial.Write("GATE:ENTRY\n");
                AddLog("Cổng vào", "Mở cổng", "", "Đang mở...");
            }
            else
            {
                AddLog("Cổng vào", "Không kết nối", "", "Chưa kết nối Arduino");
            }
        }

        void OpenExitGate()
        {
            if (serial.IsOpen)
            {
                serial.Write("GATE:EXIT\n");
                AddLog("Cổng ra", "Mở cổng", "", "Đang mở...");
            }
            else
            {
                AddLog("Cổng ra", "Không kết nối", "", "Chưa kết nối Arduino");
            }
        }
    }
}
