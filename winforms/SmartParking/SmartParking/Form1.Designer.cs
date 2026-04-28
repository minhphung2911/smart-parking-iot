namespace SmartParking
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        // --- TITLE & HEADER ---
        private System.Windows.Forms.Label lblTitle;
        private System.Windows.Forms.Label lblSubtitle;

        // --- SLOT PANELS (5 slots) ---
        private System.Windows.Forms.Panel[] slotPanels = new System.Windows.Forms.Panel[5];
        private System.Windows.Forms.Label[] slotLabels = new System.Windows.Forms.Label[5];
        private System.Windows.Forms.Label lblSlotStatus;

        // --- STATISTICS ---
        private System.Windows.Forms.GroupBox grpStats;
        private System.Windows.Forms.Label lblTotalSlots;
        private System.Windows.Forms.Label lblEmptySlots;
        private System.Windows.Forms.Label lblOccupiedSlots;
        private System.Windows.Forms.Label lblRevenue;

        // --- CONTROL PANEL ---
        private System.Windows.Forms.GroupBox grpControl;
        private System.Windows.Forms.Label lblPlate;
        private System.Windows.Forms.TextBox txtPlate;
        private System.Windows.Forms.Button btnEntry;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Button btnMode;
        private System.Windows.Forms.Button btnAutoEntry;
        private System.Windows.Forms.Button btnAutoExit;
        private System.Windows.Forms.Label lblMode;

        // --- COM PORT ---
        private System.Windows.Forms.GroupBox grpComPort;
        private System.Windows.Forms.ComboBox cmbComPort;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.Label lblConnectionStatus;

        // --- LOGS ---
        private System.Windows.Forms.GroupBox grpLogs;
        private System.Windows.Forms.ListView lvLogs;
        private System.Windows.Forms.ColumnHeader colTime;
        private System.Windows.Forms.ColumnHeader colEvent;
        private System.Windows.Forms.ColumnHeader colPlate;
        private System.Windows.Forms.ColumnHeader colSlot;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            // Initialize all components
            this.lblTitle = new System.Windows.Forms.Label();
            this.lblSubtitle = new System.Windows.Forms.Label();
            this.lblSlotStatus = new System.Windows.Forms.Label();

            // Initialize slot panels and labels
            for (int i = 0; i < 5; i++)
            {
                this.slotPanels[i] = new System.Windows.Forms.Panel();
                this.slotLabels[i] = new System.Windows.Forms.Label();
            }

            // Stats
            this.grpStats = new System.Windows.Forms.GroupBox();
            this.lblTotalSlots = new System.Windows.Forms.Label();
            this.lblEmptySlots = new System.Windows.Forms.Label();
            this.lblOccupiedSlots = new System.Windows.Forms.Label();
            this.lblRevenue = new System.Windows.Forms.Label();

            // Control
            this.grpControl = new System.Windows.Forms.GroupBox();
            this.lblPlate = new System.Windows.Forms.Label();
            this.txtPlate = new System.Windows.Forms.TextBox();
            this.btnEntry = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.btnMode = new System.Windows.Forms.Button();
            this.btnAutoEntry = new System.Windows.Forms.Button();
            this.btnAutoExit = new System.Windows.Forms.Button();
            this.lblMode = new System.Windows.Forms.Label();

            // COM Port
            this.grpComPort = new System.Windows.Forms.GroupBox();
            this.cmbComPort = new System.Windows.Forms.ComboBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.lblConnectionStatus = new System.Windows.Forms.Label();

            // Logs
            this.grpLogs = new System.Windows.Forms.GroupBox();
            this.lvLogs = new System.Windows.Forms.ListView();
            this.colTime = new System.Windows.Forms.ColumnHeader();
            this.colEvent = new System.Windows.Forms.ColumnHeader();
            this.colPlate = new System.Windows.Forms.ColumnHeader();
            this.colSlot = new System.Windows.Forms.ColumnHeader();

            this.SuspendLayout();

            // === TITLE ===
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new System.Drawing.Font("Segoe UI", 20F, System.Drawing.FontStyle.Bold);
            this.lblTitle.Location = new System.Drawing.Point(20, 10);
            this.lblTitle.Size = new System.Drawing.Size(500, 40);
            this.lblTitle.Text = "🚗 SMART PARKING SYSTEM";
            this.lblTitle.ForeColor = System.Drawing.Color.DarkBlue;

            this.lblSubtitle.AutoSize = true;
            this.lblSubtitle.Font = new System.Drawing.Font("Segoe UI", 10F);
            this.lblSubtitle.Location = new System.Drawing.Point(25, 50);
            this.lblSubtitle.Size = new System.Drawing.Size(400, 20);
            this.lblSubtitle.Text = "Hệ thống quản lý bãi xe 5 slot - Tích hợp Arduino";
            this.lblSubtitle.ForeColor = System.Drawing.Color.Gray;

            // === SLOT STATUS LABEL ===
            this.lblSlotStatus.AutoSize = true;
            this.lblSlotStatus.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold);
            this.lblSlotStatus.Location = new System.Drawing.Point(20, 85);
            this.lblSlotStatus.Size = new System.Drawing.Size(300, 25);
            this.lblSlotStatus.Text = "📍 TRẠNG THÁI BÃI XE:";
            this.lblSlotStatus.ForeColor = System.Drawing.Color.DarkSlateGray;

            // === SLOT PANELS ===
            int slotWidth = 90;
            int slotHeight = 75;
            int slotSpacing = 10;
            int startLeft = 20;
            int startTop = 115;

            for (int i = 0; i < 5; i++)
            {
                // Panel
                this.slotPanels[i].Size = new System.Drawing.Size(slotWidth, slotHeight);
                this.slotPanels[i].Location = new System.Drawing.Point(startLeft + (i * (slotWidth + slotSpacing)), startTop);
                this.slotPanels[i].BackColor = System.Drawing.Color.LightGreen;
                this.slotPanels[i].BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
                this.slotPanels[i].Tag = i + 1;

                // Label inside panel
                this.slotLabels[i].AutoSize = false;
                this.slotLabels[i].Size = new System.Drawing.Size(slotWidth - 4, slotHeight - 4);
                this.slotLabels[i].Location = new System.Drawing.Point(2, 2);
                this.slotLabels[i].Text = $"S{i+1}\n\nTRỐNG";
                this.slotLabels[i].TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
                this.slotLabels[i].Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
                this.slotLabels[i].Dock = System.Windows.Forms.DockStyle.Fill;

                this.slotPanels[i].Controls.Add(this.slotLabels[i]);
            }

            // === STATISTICS GROUP ===
            this.grpStats.Location = new System.Drawing.Point(560, 85);
            this.grpStats.Size = new System.Drawing.Size(220, 150);
            this.grpStats.Text = "📊 Thống kê";
            this.grpStats.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);

            this.lblTotalSlots.AutoSize = true;
            this.lblTotalSlots.Location = new System.Drawing.Point(10, 25);
            this.lblTotalSlots.Text = "Tổng slot: 5";
            this.lblTotalSlots.Font = new System.Drawing.Font("Segoe UI", 9F);

            this.lblEmptySlots.AutoSize = true;
            this.lblEmptySlots.Location = new System.Drawing.Point(10, 50);
            this.lblEmptySlots.Text = "🟢 Trống: 5";
            this.lblEmptySlots.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.lblEmptySlots.ForeColor = System.Drawing.Color.Green;

            this.lblOccupiedSlots.AutoSize = true;
            this.lblOccupiedSlots.Location = new System.Drawing.Point(10, 75);
            this.lblOccupiedSlots.Text = "🔴 Có xe: 0";
            this.lblOccupiedSlots.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.lblOccupiedSlots.ForeColor = System.Drawing.Color.Red;

            this.lblRevenue.AutoSize = true;
            this.lblRevenue.Location = new System.Drawing.Point(10, 100);
            this.lblRevenue.Text = "💰 Doanh thu: 0 VNĐ";
            this.lblRevenue.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.lblRevenue.ForeColor = System.Drawing.Color.DarkBlue;

            this.grpStats.Controls.Add(this.lblTotalSlots);
            this.grpStats.Controls.Add(this.lblEmptySlots);
            this.grpStats.Controls.Add(this.lblOccupiedSlots);
            this.grpStats.Controls.Add(this.lblRevenue);

            // === COM PORT GROUP ===
            this.grpComPort.Location = new System.Drawing.Point(560, 245);
            this.grpComPort.Size = new System.Drawing.Size(220, 120);
            this.grpComPort.Text = "🔌 Kết nối Arduino";
            this.grpComPort.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);

            this.cmbComPort.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cmbComPort.Location = new System.Drawing.Point(10, 25);
            this.cmbComPort.Size = new System.Drawing.Size(120, 25);

            this.btnConnect.Location = new System.Drawing.Point(140, 25);
            this.btnConnect.Size = new System.Drawing.Size(70, 25);
            this.btnConnect.Text = "Kết nối";
            this.btnConnect.BackColor = System.Drawing.Color.LightGreen;

            this.lblConnectionStatus.AutoSize = true;
            this.lblConnectionStatus.Location = new System.Drawing.Point(10, 60);
            this.lblConnectionStatus.Text = "⚪ Chưa kết nối";
            this.lblConnectionStatus.ForeColor = System.Drawing.Color.Gray;

            this.grpComPort.Controls.Add(this.cmbComPort);
            this.grpComPort.Controls.Add(this.btnConnect);
            this.grpComPort.Controls.Add(this.lblConnectionStatus);

            // === CONTROL GROUP ===
            this.grpControl.Location = new System.Drawing.Point(20, 210);
            this.grpControl.Size = new System.Drawing.Size(520, 155);
            this.grpControl.Text = "🎮 Điều khiển";
            this.grpControl.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);

            this.lblPlate.AutoSize = true;
            this.lblPlate.Location = new System.Drawing.Point(10, 30);
            this.lblPlate.Text = "Biển số:";

            this.txtPlate.Location = new System.Drawing.Point(70, 27);
            this.txtPlate.Size = new System.Drawing.Size(120, 25);

            this.btnEntry.Location = new System.Drawing.Point(200, 25);
            this.btnEntry.Size = new System.Drawing.Size(90, 30);
            this.btnEntry.Text = "🚗 XE VÀO";
            this.btnEntry.BackColor = System.Drawing.Color.LightBlue;

            this.btnExit.Location = new System.Drawing.Point(300, 25);
            this.btnExit.Size = new System.Drawing.Size(90, 30);
            this.btnExit.Text = "🚙 XE RA";
            this.btnExit.BackColor = System.Drawing.Color.LightPink;

            this.lblMode.AutoSize = true;
            this.lblMode.Location = new System.Drawing.Point(405, 30);
            this.lblMode.Text = "Mode: AUTO";
            this.lblMode.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);
            this.lblMode.ForeColor = System.Drawing.Color.Green;

            this.btnMode.Location = new System.Drawing.Point(10, 65);
            this.btnMode.Size = new System.Drawing.Size(150, 35);
            this.btnMode.Text = "🔄 Đổi AUTO/MANUAL";
            this.btnMode.BackColor = System.Drawing.Color.LightYellow;

            this.btnAutoEntry.Location = new System.Drawing.Point(170, 65);
            this.btnAutoEntry.Size = new System.Drawing.Size(160, 35);
            this.btnAutoEntry.Text = "🎲 Xe vào ngẫu nhiên";
            this.btnAutoEntry.BackColor = System.Drawing.Color.LightCyan;

            this.btnAutoExit.Location = new System.Drawing.Point(340, 65);
            this.btnAutoExit.Size = new System.Drawing.Size(160, 35);
            this.btnAutoExit.Text = "🎲 Xe ra ngẫu nhiên";
            this.btnAutoExit.BackColor = System.Drawing.Color.MistyRose;

            this.grpControl.Controls.Add(this.lblPlate);
            this.grpControl.Controls.Add(this.txtPlate);
            this.grpControl.Controls.Add(this.btnEntry);
            this.grpControl.Controls.Add(this.btnExit);
            this.grpControl.Controls.Add(this.lblMode);
            this.grpControl.Controls.Add(this.btnMode);
            this.grpControl.Controls.Add(this.btnAutoEntry);
            this.grpControl.Controls.Add(this.btnAutoExit);

            // === LOGS GROUP ===
            this.grpLogs.Location = new System.Drawing.Point(20, 375);
            this.grpLogs.Size = new System.Drawing.Size(760, 200);
            this.grpLogs.Text = "📝 Nhật ký hoạt động (5,000 VND/giờ)";
            this.grpLogs.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold);

            this.lvLogs.Dock = System.Windows.Forms.DockStyle.Fill;
            this.lvLogs.View = System.Windows.Forms.View.Details;
            this.lvLogs.FullRowSelect = true;
            this.lvLogs.GridLines = true;

            this.colTime.Text = "Thời gian";
            this.colTime.Width = 100;
            this.colEvent.Text = "Sự kiện";
            this.colEvent.Width = 150;
            this.colPlate.Text = "Biển số";
            this.colPlate.Width = 120;
            this.colSlot.Text = "Slot";
            this.colSlot.Width = 80;

            this.lvLogs.Columns.Add(this.colTime);
            this.lvLogs.Columns.Add(this.colEvent);
            this.lvLogs.Columns.Add(this.colPlate);
            this.lvLogs.Columns.Add(this.colSlot);
            this.lvLogs.Columns.Add(new System.Windows.Forms.ColumnHeader { Text = "Chi tiết", Width = 280 });

            this.grpLogs.Controls.Add(this.lvLogs);

            // === FORM SETTINGS ===
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 590);
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.lblSubtitle);
            this.Controls.Add(this.lblSlotStatus);
            for (int i = 0; i < 5; i++) this.Controls.Add(this.slotPanels[i]);
            this.Controls.Add(this.grpStats);
            this.Controls.Add(this.grpComPort);
            this.Controls.Add(this.grpControl);
            this.Controls.Add(this.grpLogs);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Smart Parking - WinForms";
            this.BackColor = System.Drawing.Color.WhiteSmoke;

            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}