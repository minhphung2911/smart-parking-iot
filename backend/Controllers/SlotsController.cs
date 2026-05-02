using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.Api.Data;
using SmartParking.Api.Models;

namespace SmartParking.Api.Controllers;

[ApiController]
[Route("api/slots")]
public class SlotsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SlotsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_db.ParkingSlots.ToList());
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var slot = await _db.ParkingSlots.FindAsync(id);
        if (slot == null) return NotFound();

        string oldStatus = slot.Status ?? "Available";
        string newStatus = request.Status; // Case should be handled by client or normalized here

        // Normalize status
        if (newStatus.Equals("occupied", StringComparison.OrdinalIgnoreCase)) newStatus = "Occupied";
        else if (newStatus.Equals("available", StringComparison.OrdinalIgnoreCase)) newStatus = "Available";
        else if (newStatus.Equals("reserved", StringComparison.OrdinalIgnoreCase)) newStatus = "Reserved";
        else if (newStatus.Equals("fault", StringComparison.OrdinalIgnoreCase)) newStatus = "Fault";

        slot.Status = newStatus;

        // Log the manual change
        _db.Logs.Add(new Log { 
            EventTime = DateTime.UtcNow, 
            ActionType = $"Manual Update: {newStatus}", 
            SlotCode = slot.SlotCode,
            Details = $"Thay đổi từ {oldStatus}"
        });

        await _db.SaveChangesAsync();
        return Ok(slot);
    }
}

public class UpdateStatusRequest
{
    public string? Status { get; set; }
    public string? PlateNumber { get; set; }
}
