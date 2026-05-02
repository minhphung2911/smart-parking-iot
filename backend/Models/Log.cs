namespace SmartParking.Api.Models;

public class Log
{
    public int LogID { get; set; }
    public DateTime EventTime { get; set; } = DateTime.UtcNow;
    public string? ActionType { get; set; }
    public string? PlateNumber { get; set; }
    public string? SlotCode { get; set; }
    public string? Source { get; set; }
    public string? Status { get; set; }
    public string? Details { get; set; }
}
