namespace SmartParking.Api.Models;

public class ParkingSlot
{
    public int SlotID { get; set; }
    public string? SlotCode { get; set; }
    public string? Status { get; set; }
    public string? Zone { get; set; }
    public int FloorNo { get; set; } = 1;
    public int DistanceFromGate { get; set; } = 0;
    public string? SensorStatus { get; set; } = "Online";
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
