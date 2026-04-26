namespace SmartParking
{
    partial class Form1
    {
        private System.ComponentModel.IContainer components = null;

        private System.Windows.Forms.TextBox txtSerial;
        private System.Windows.Forms.TextBox txtPlate;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.Button btnEntry;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Label lblSlots;
        private System.Windows.Forms.DataGridView dgvCurrent;
        private System.Windows.Forms.DataGridView dgvHistory;

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
            this.txtSerial = new System.Windows.Forms.TextBox();
            this.txtPlate = new System.Windows.Forms.TextBox();
            this.btnConnect = new System.Windows.Forms.Button();
            this.btnEntry = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.lblSlots = new System.Windows.Forms.Label();
            this.dgvCurrent = new System.Windows.Forms.DataGridView();
            this.dgvHistory = new System.Windows.Forms.DataGridView();

            ((System.ComponentModel.ISupportInitialize)(this.dgvCurrent)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.dgvHistory)).BeginInit();
            this.SuspendLayout();

            // txtSerial
            this.txtSerial.Multiline = true;
            this.txtSerial.Location = new System.Drawing.Point(10, 80);
            this.txtSerial.Size = new System.Drawing.Size(250, 250);

            // txtPlate
            this.txtPlate.Location = new System.Drawing.Point(150, 40);
            this.txtPlate.Size = new System.Drawing.Size(150, 22);

            // btnConnect
            this.btnConnect.Location = new System.Drawing.Point(10, 10);
            this.btnConnect.Size = new System.Drawing.Size(120, 30);
            this.btnConnect.Text = "Connect";
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);

            // btnEntry
            this.btnEntry.Location = new System.Drawing.Point(320, 40);
            this.btnEntry.Size = new System.Drawing.Size(80, 30);
            this.btnEntry.Text = "Entry";
            this.btnEntry.Click += new System.EventHandler(this.btnEntry_Click);

            // btnExit
            this.btnExit.Location = new System.Drawing.Point(410, 40);
            this.btnExit.Size = new System.Drawing.Size(80, 30);
            this.btnExit.Text = "Exit";
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);

            // lblSlots
            this.lblSlots.Location = new System.Drawing.Point(150, 10);
            this.lblSlots.Size = new System.Drawing.Size(200, 30);
            this.lblSlots.Text = "Slots: 0";

            // dgvCurrent
            this.dgvCurrent.Location = new System.Drawing.Point(270, 80);
            this.dgvCurrent.Size = new System.Drawing.Size(500, 200);

            // dgvHistory
            this.dgvHistory.Location = new System.Drawing.Point(10, 350);
            this.dgvHistory.Size = new System.Drawing.Size(760, 200);

            // Form1
            this.ClientSize = new System.Drawing.Size(800, 600);
            this.Controls.Add(this.txtSerial);
            this.Controls.Add(this.txtPlate);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.btnEntry);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.lblSlots);
            this.Controls.Add(this.dgvCurrent);
            this.Controls.Add(this.dgvHistory);
            this.Text = "Smart Parking";

            ((System.ComponentModel.ISupportInitialize)(this.dgvCurrent)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.dgvHistory)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}