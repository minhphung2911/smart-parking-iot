namespace SmartParking.Api.Models;

public class ParkingSession
{
    public int SessionID { get; set; }
    public string? PlateNumber { get; set; }
    public string? VehicleType { get; set; } // "Car" or "Bike"
    public int SlotID { get; set; }

    public DateTime CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }

    public decimal Fee { get; set; }
    public string? Status { get; set; } // "Parking", "Completed"
}
