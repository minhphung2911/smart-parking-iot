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
        var slots = _db.ParkingSlots
            .GroupJoin(
                _db.ParkingSessions.Where(s => s.Status == "Active"),
                slot => slot.SlotID,
                session => session.SlotID,
                (slot, sessions) => new { slot, sessions })
            .SelectMany(
                x => x.sessions.DefaultIfEmpty(),
                (x, session) => new { x.slot, session })
            .GroupJoin(
                _db.Vehicles,
                x => x.session.VehicleID,
                vehicle => vehicle.VehicleID,
                (x, vehicles) => new { x.slot, x.session, vehicles })
            .SelectMany(
                x => x.vehicles.DefaultIfEmpty(),
                (x, vehicle) => new
                {
                    x.slot.SlotID,
                    x.slot.SlotCode,
                    x.slot.Status,
                    PlateNumber = vehicle != null ? vehicle.PlateNumber : null,
                    VehicleType = vehicle != null ? vehicle.VehicleType : null
                })
            .ToList();
            
        return Ok(slots);
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
        _db.Logs.Add(new Log
        {
            EventTime = DateTime.UtcNow,
            ActionType = $"Manual Update: {newStatus}",
            SlotCode = slot.SlotCode,
            Source = "Admin",
            Status = "Success",
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
