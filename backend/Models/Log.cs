namespace SmartParking.Api.Models;

public class Log
{
    public int LogID { get; set; }
    public DateTime EventTime { get; set; }
    public string ActionType { get; set; }
    public string PlateNumber { get; set; }
    public string SlotCode { get; set; }
}
