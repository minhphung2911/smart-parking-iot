namespace SmartParking.Api.Models;

public class SystemFault
{
    public int FaultID { get; set; }
    public int? SlotID { get; set; }
    public string? FaultType { get; set; }
    public string? Description { get; set; }
    public string? Severity { get; set; }
    public string? Status { get; set; } = "Open";
    public DateTime ReportedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ResolvedAt { get; set; }
}
