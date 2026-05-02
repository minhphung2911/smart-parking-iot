namespace SmartParking.Api.Models;

public class Vehicle
{
    public int VehicleID { get; set; }
    public string? PlateNumber { get; set; }
    public string? VehicleType { get; set; } = "Car";
    public string? OwnerName { get; set; }
    public bool IsVIP { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
