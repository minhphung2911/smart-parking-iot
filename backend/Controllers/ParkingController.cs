using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.Api.Data;
using SmartParking.Api.Models;

namespace SmartParking.Api.Controllers;

[ApiController]
[Route("api/parking")]
public class ParkingController : ControllerBase
{
    private readonly AppDbContext _db;

    public ParkingController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("entry")]
    public async Task<IActionResult> Entry([FromBody] EntryRequest request)
    {
        var slot = await _db.ParkingSlots.FirstOrDefaultAsync(s => s.SlotCode == request.SlotId);
        if (slot == null) return NotFound("Slot not found");
        if (slot.Status == "Occupied") return BadRequest("Slot already occupied");

        // Find or create vehicle
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.PlateNumber == request.PlateNumber);
        if (vehicle == null)
        {
            vehicle = new Vehicle
            {
                PlateNumber = request.PlateNumber,
                VehicleType = request.VehicleType ?? "Car"
            };
            _db.Vehicles.Add(vehicle);
            await _db.SaveChangesAsync();
        }

        var session = new ParkingSession
        {
            VehicleID = vehicle.VehicleID,
            SlotID = slot.SlotID,
            CheckInTime = DateTime.UtcNow,
            Status = "Active",
            Fee = 0
        };

        slot.Status = "Occupied";
        _db.ParkingSessions.Add(session);

        _db.Logs.Add(new Log
        {
            EventTime = DateTime.UtcNow,
            ActionType = "Check-in",
            PlateNumber = request.PlateNumber,
            SlotCode = slot.SlotCode,
            Source = "API",
            Status = "Success",
            Details = $"Loại xe: {request.VehicleType}"
        });

        await _db.SaveChangesAsync();
        return Ok(session);
    }

    [HttpPost("exit")]
    public async Task<IActionResult> Exit([FromBody] ExitRequest request)
    {
        // Find vehicle first
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.PlateNumber == request.PlateNumber);
        if (vehicle == null) return NotFound("Vehicle not found");

        var session = await _db.ParkingSessions
            .Where(s => s.VehicleID == vehicle.VehicleID && s.Status == "Active")
            .OrderByDescending(s => s.CheckInTime)
            .FirstOrDefaultAsync();

        if (session == null) return NotFound("No active parking session found for this plate");

        var slot = await _db.ParkingSlots.FindAsync(session.SlotID);
        var checkOutTime = DateTime.UtcNow;
        var duration = checkOutTime - session.CheckInTime;

        // Fee calculation - Fixed rate: 20,000 VNĐ/giờ
        decimal fee = 0;
        double totalHours = Math.Max(1, Math.Ceiling(duration.TotalHours));
        fee = (decimal)totalHours * 20000;

        session.CheckOutTime = checkOutTime;
        session.DurationMinutes = (int)duration.TotalMinutes;
        session.Fee = fee;
        session.Status = "Closed";

        if (slot != null) slot.Status = "Available";

        _db.Logs.Add(new Log
        {
            EventTime = DateTime.UtcNow,
            ActionType = "Check-out",
            PlateNumber = request.PlateNumber,
            SlotCode = slot?.SlotCode,
            Source = "API",
            Status = "Success",
            Details = $"Thời gian: {duration.Hours}h{duration.Minutes}m, Phí: {fee:N0}đ"
        });

        await _db.SaveChangesAsync();

        return Ok(new
        {
            duration = $"{(int)duration.TotalHours}h{duration.Minutes}m",
            fee = (int)fee
        });
    }
}

public class EntryRequest
{
    public string? PlateNumber { get; set; }
    public string? VehicleType { get; set; } // "Car" or "Bike"
    public string? SlotId { get; set; } // SlotCode from frontend
}

public class ExitRequest
{
    public string? PlateNumber { get; set; }
}
