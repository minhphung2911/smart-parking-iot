namespace SmartParking.Api.Models;

public class ParkingSlot
{
    public int SlotID { get; set; }
    public string? SlotCode { get; set; }
    public string? Status { get; set; }
    public string? Zone { get; set; }
}
