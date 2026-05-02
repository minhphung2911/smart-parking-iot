using System;
using System.Drawing;
using System.IO.Ports;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace SmartParking
{
    public partial class Form1 : Form
    {
        // --- CẤU HÌNH HỆ THỐNG ---
        SerialPort serial = new SerialPort("COM3", 9600);
        private ApiClient _api = new ApiClient();
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
            // Tìm slot đầu tiên có xe (theo UI) thay vì SQL
            for (int i = 0; i < 5; i++)
            {
                if (slotPanels[i].BackColor == Color.IndianRed)
                {
                    OpenExitGate();
                    XeRaTheoSlot(i + 1);
                    return;
                }
            }
            MessageBox.Show("Không còn xe nào trong bãi!");
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
            // Tìm slot đầu tiên có xe (theo UI) thay vì SQL
            for (int i = 0; i < 5; i++)
            {
                if (slotPanels[i].BackColor == Color.IndianRed)
                {
                    // Mở cổng ra trước khi xe ra
                    OpenExitGate();
                    XeRaTheoSlot(i + 1);
                    return;
                }
            }
            MessageBox.Show("Không có xe để ra!");
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

        // --- API METHODS ---
        void XeVao(string plate, int manualSlot = -1)
        {
            // Chuyển sang gọi API
            XeVaoApi(plate, manualSlot);
        }

        async void XeVaoApi(string plate, int manualSlot = -1)
        {
            // Tìm slot trống nếu không chỉ định
            int slotToAssign = manualSlot;
            if (slotToAssign == -1)
            {
                for (int i = 0; i < 5; i++)
                    if (slotPanels[i].BackColor == Color.LightGreen) { slotToAssign = i + 1; break; }
            }
            if (slotToAssign == -1) { MessageBox.Show("Hết chỗ!"); return; }

            try
            {
                string slotCode = $"S{slotToAssign}";
                string result = await _api.ParkingEntryAsync(plate, "Car", slotCode);

                if (result.Contains("error"))
                {
                    MessageBox.Show("Lỗi API: " + result);
                    return;
                }

                // Update UI
                slotPanels[slotToAssign - 1].BackColor = Color.IndianRed;
                slotLabels[slotToAssign - 1].Text = $"S{slotToAssign}\n{plate}\nCÓ XE";
                AddLog("Xe vào", plate, $"S{slotToAssign}", "Thành công");

                await LoadDataFromApi();
                UpdateSlotStats();

                if (serial.IsOpen) serial.WriteLine($"SLOT:{slotToAssign - 1},1");
            }
            catch (Exception ex) { MessageBox.Show("Lỗi: " + ex.Message); }
        }

        void XeRaTheoSlot(int slot)
        {
            // Chuyển sang gọi API
            XeRaTheoSlotApi(slot);
        }

        async void XeRaTheoSlotApi(int slot)
        {
            try
            {
                string plate = GetPlateFromSlot(slot);
                if (string.IsNullOrEmpty(plate))
                {
                    MessageBox.Show("Không tìm thấy xe ở slot này!");
                    return;
                }

                string result = await _api.ParkingExitAsync(plate);

                if (result.Contains("error"))
                {
                    MessageBox.Show("Lỗi API: " + result);
                    return;
                }

                string duration = ExtractJsonValue(result, "duration");
                int fee = 0;
                int.TryParse(ExtractJsonValue(result, "fee"), out fee);
                totalRevenue += fee;

                slotPanels[slot - 1].BackColor = Color.LightGreen;
                slotLabels[slot - 1].Text = $"S{slot}\n\nTRỐNG";
                AddLog("Xe ra", plate, $"S{slot}", $"Phí: {fee:N0} VND");

                await LoadDataFromApi();
                UpdateSlotStats();

                if (serial.IsOpen) serial.WriteLine($"SLOT:{slot - 1},0");
            }
            catch (Exception ex) { MessageBox.Show("Lỗi: " + ex.Message); }
        }

        async void ForwardSlotStatusToApi(string status)
        {
            try
            {
                string[] parts = status.Split(',');
                if (parts.Length != 5) return;

                int[] slotStatuses = new int[5];
                for (int i = 0; i < 5; i++)
                {
                    slotStatuses[i] = parts[i] == "1" ? 1 : 0;
                }

                string result = await _api.SendSensorUpdateAsync(slotStatuses);
                if (result.Contains("error"))
                {
                    AddLog("API", "Lỗi forward slot", "", result);
                }
            }
            catch { }
        }

        async void ForwardEntryDetectedToApi()
        {
            try { await _api.SendEntryDetectedAsync(); } catch { }
        }

        async void ForwardExitDetectedToApi()
        {
            try { await _api.SendExitDetectedAsync(); } catch { }
        }

        async Task LoadDataFromApi()
        {
            try
            {
                string result = await _api.GetSlotsAsync();
                if (result.Contains("error")) return;

                // Parse JSON array: [{"slotID":1,"slotCode":"S1","status":"Available","plateNumber":"51A-12345",...},...]
                string[] items = result.Split(new[] { "},{" }, StringSplitOptions.None);
                foreach (string item in items)
                {
                    string slotCode    = ExtractJsonValue(item, "slotCode");
                    string status      = ExtractJsonValue(item, "status");
                    string plateNumber = ExtractJsonValue(item, "plateNumber");

                    if (slotCode.Length >= 2 && int.TryParse(slotCode.Substring(1), out int slotNum))
                    {
                        int index = slotNum - 1;
                        if (index >= 0 && index < 5)
                        {
                            if (status == "Occupied")
                            {
                                slotPanels[index].BackColor = Color.IndianRed;
                                string plate = ExtractJsonValue(item, "plateNumber");
                                if (!string.IsNullOrEmpty(plate))
                                    slotLabels[index].Text = $"S{slotNum}\n{plate}\nCÓ XE";
                                else
                                    slotLabels[index].Text = $"S{slotNum}\nCÓ XE";
                            }
                            else
                            {
                                slotPanels[index].BackColor = Color.LightGreen;
                                slotLabels[index].Text = $"S{slotNum}\n\nTRỐNG";
                            }
                        }
                    }
                }
                UpdateSlotStats();
            }
            catch { }
        }

        // Simple JSON value extractor - không cần thư viện
        string ExtractJsonValue(string json, string key)
        {
            string search = "\"" + key + "\":";
            int start = json.IndexOf(search);
            if (start < 0) return "";
            start += search.Length;

            // Skip whitespace
            while (start < json.Length && json[start] == ' ') start++;
            if (start >= json.Length) return "";

            if (json[start] == '"')
            {
                // String value
                start++;
                int end = json.IndexOf('"', start);
                if (end < 0) return "";
                return json.Substring(start, end - start);
            }
            else
            {
                // Number or boolean value
                int end = start;
                while (end < json.Length && json[end] != ',' && json[end] != '}' && json[end] != ']')
                    end++;
                return json.Substring(start, end - start).Trim();
            }
        }

        string GetPlateFromSlot(int slot)
        {
            string text = slotLabels[slot - 1].Text;
            string[] lines = text.Split('\n');
            if (lines.Length >= 2 && !lines[1].Contains("TRỐNG") && !string.IsNullOrWhiteSpace(lines[1]))
                return lines[1];
            return "";
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
                        ForwardEntryDetectedToApi(); // Forward lên API
                        XeVao(GenerateRandomLicensePlate());
                    }
                    else if (data == "EXIT")
                    {
                        AddLog("Cổng ra", "Cảm biến", "", "Phát hiện xe ra");
                        ForwardExitDetectedToApi(); // Forward lên API
                        // Tìm slot đầu tiên có xe (theo UI) thay vì SQL
                        for (int i = 0; i < 5; i++)
                        {
                            if (slotPanels[i].BackColor == Color.IndianRed)
                            {
                                XeRaTheoSlot(i + 1);
                                break;
                            }
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
                
                // Forward lên API
                ForwardSlotStatusToApi(status);
                
                if (needReload)
                    LoadDataFromApi(); // Dùng API thay vì SQL
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
            // Chuyển sang gọi API (async fire-and-forget)
            _ = LoadDataFromApi();
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
