namespace SmartParking
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        // Các thành phần giao diện
        private System.Windows.Forms.GroupBox grpControl;
        private System.Windows.Forms.Label lblPlate;
        private System.Windows.Forms.TextBox txtPlate;
        private System.Windows.Forms.Button btnEntry;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Label lblStatus;

        private System.Windows.Forms.GroupBox grpCurrent;
        private System.Windows.Forms.DataGridView dgvCurrent;

        private System.Windows.Forms.GroupBox grpHistory;
        private System.Windows.Forms.DataGridView dgvHistory;

        private System.Windows.Forms.Label lblTitle;

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
            this.grpControl = new System.Windows.Forms.GroupBox();
            this.lblPlate = new System.Windows.Forms.Label();
            this.txtPlate = new System.Windows.Forms.TextBox();
            this.btnEntry = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.lblStatus = new System.Windows.Forms.Label();
            this.grpCurrent = new System.Windows.Forms.GroupBox();
            this.dgvCurrent = new System.Windows.Forms.DataGridView();
            this.grpHistory = new System.Windows.Forms.GroupBox();
            this.dgvHistory = new System.Windows.Forms.DataGridView();
            this.lblTitle = new System.Windows.Forms.Label();

            this.grpControl.SuspendLayout();
            this.grpCurrent.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvCurrent)).BeginInit();
            this.grpHistory.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvHistory)).BeginInit();
            this.SuspendLayout();

            // lblTitle - Tiêu đề ứng dụng
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new System.Drawing.Font("Arial", 16F, System.Drawing.FontStyle.Bold);
            this.lblTitle.Location = new System.Drawing.Point(12, 9);
            this.lblTitle.Text = "HỆ THỐNG QUẢN LÝ BÃI XE THÔNG MINH";
            this.lblTitle.ForeColor = System.Drawing.Color.DarkBlue;

            // grpControl - Khu vực điều khiển thủ công
            this.grpControl.Controls.Add(this.lblPlate);
            this.grpControl.Controls.Add(this.txtPlate);
            this.grpControl.Controls.Add(this.btnEntry);
            this.grpControl.Controls.Add(this.btnExit);
            this.grpControl.Location = new System.Drawing.Point(12, 50);
            this.grpControl.Size = new System.Drawing.Size(260, 150);
            this.grpControl.Text = "Điều khiển cổng";

            this.lblPlate.Location = new System.Drawing.Point(10, 30);
            this.lblPlate.Text = "Biển số:";

            this.txtPlate.Location = new System.Drawing.Point(80, 27);
            this.txtPlate.Size = new System.Drawing.Size(160, 22);

            this.btnEntry.Location = new System.Drawing.Point(13, 70);
            this.btnEntry.Size = new System.Drawing.Size(110, 40);
            this.btnEntry.Text = "XE VÀO (F1)";
            this.btnEntry.BackColor = System.Drawing.Color.LightBlue;

            this.btnExit.Location = new System.Drawing.Point(130, 70);
            this.btnExit.Size = new System.Drawing.Size(110, 40);
            this.btnExit.Text = "XE RA (F2)";
            this.btnExit.BackColor = System.Drawing.Color.LightPink;

            // grpCurrent - Bảng xe đang đỗ
            this.grpCurrent.Controls.Add(this.dgvCurrent);
            this.grpCurrent.Location = new System.Drawing.Point(12, 210);
            this.grpCurrent.Size = new System.Drawing.Size(430, 180);
            this.grpCurrent.Text = "Danh sách xe trong bãi";

            this.dgvCurrent.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvCurrent.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvCurrent.BackgroundColor = System.Drawing.Color.White;

            // grpHistory - Bảng lịch sử & doanh thu
            this.grpHistory.Controls.Add(this.dgvHistory);
            this.grpHistory.Location = new System.Drawing.Point(12, 400);
            this.grpHistory.Size = new System.Drawing.Size(776, 188);
            this.grpHistory.Text = "Nhật ký xe ra và doanh thu";

            this.dgvHistory.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.dgvHistory.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvHistory.BackgroundColor = System.Drawing.Color.White;

            // lblStatus - Trạng thái bãi xe (Sử dụng cho sơ đồ Panel)
            this.lblStatus.AutoSize = true;
            this.lblStatus.Font = new System.Drawing.Font("Arial", 10F, System.Drawing.FontStyle.Bold);
            this.lblStatus.Location = new System.Drawing.Point(300, 55);
            this.lblStatus.Text = "SƠ ĐỒ VỊ TRÍ TRỐNG (REAL-TIME):";

            // Form1
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 600);
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.grpControl);
            this.Controls.Add(this.grpCurrent);
            this.Controls.Add(this.grpHistory);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Smart Parking System v1.0";

            this.grpControl.ResumeLayout(false);
            this.grpControl.PerformLayout();
            this.grpCurrent.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dgvCurrent)).EndInit();
            this.grpHistory.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dgvHistory)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}