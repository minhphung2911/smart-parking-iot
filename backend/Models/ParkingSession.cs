namespace SmartParking.Api.Models;

public class ParkingSession
{
    public int SessionID { get; set; }
    public int VehicleID { get; set; }
    public int SlotID { get; set; }

    public DateTime CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public int? DurationMinutes { get; set; }
    public decimal Fee { get; set; }
    public string? Status { get; set; } // "Active", "Closed"

    // Navigation properties
    public Vehicle? Vehicle { get; set; }
}
