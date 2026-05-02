using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.Api.Data;
using SmartParking.Api.Models;

namespace SmartParking.Api.Controllers;

[ApiController]
[Route("api/iot")]
public class IoTController : ControllerBase
{
    private readonly AppDbContext _db;

    public IoTController(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Nhận cập nhật trạng thái sensor từ Arduino/WiForms
    /// </summary>
    [HttpPost("sensor-update")]
    public async Task<IActionResult> SensorUpdate([FromBody] SensorUpdateRequest request)
    {
        try
        {
            // Log sensor data
            _db.Logs.Add(new Log
            {
                EventTime = DateTime.UtcNow,
                ActionType = "Sensor Update",
                PlateNumber = null,
                SlotCode = null,
                Source = "IoT",
                Status = "Success",
                Details = $"Sensor states: {string.Join(",", request.SlotStatuses)}"
            });

            await _db.SaveChangesAsync();

            return Ok(new { message = "Sensor data received", slotStatuses = request.SlotStatuses });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Báo cáo phát hiện xe vào cổng
    /// </summary>
    [HttpPost("entry-detected")]
    public async Task<IActionResult> EntryDetected([FromBody] EntryDetectedRequest request)
    {
        try
        {
            _db.Logs.Add(new Log
            {
                EventTime = DateTime.UtcNow,
                ActionType = "Entry Detected",
                PlateNumber = null,
                SlotCode = null,
                Source = "IoT",
                Status = "Success",
                Details = "Vehicle detected at entry gate"
            });

            await _db.SaveChangesAsync();

            return Ok(new { message = "Entry detection recorded", timestamp = request.Timestamp });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Báo cáo phát hiện xe ra cổng
    /// </summary>
    [HttpPost("exit-detected")]
    public async Task<IActionResult> ExitDetected([FromBody] ExitDetectedRequest request)
    {
        try
        {
            _db.Logs.Add(new Log
            {
                EventTime = DateTime.UtcNow,
                ActionType = "Exit Detected",
                PlateNumber = null,
                SlotCode = null,
                Source = "IoT",
                Status = "Success",
                Details = "Vehicle detected at exit gate"
            });

            await _db.SaveChangesAsync();

            return Ok(new { message = "Exit detection recorded", timestamp = request.Timestamp });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Gửi lệnh điều khiển cổng
    /// </summary>
    [HttpPost("gate-command")]
    public async Task<IActionResult> GateCommand([FromBody] GateCommandRequest request)
    {
        try
        {
            _db.Logs.Add(new Log
            {
                EventTime = DateTime.UtcNow,
                ActionType = "Gate Command",
                PlateNumber = null,
                SlotCode = null,
                Source = "IoT",
                Status = "Success",
                Details = $"Gate command: {request.Command}"
            });

            await _db.SaveChangesAsync();

            return Ok(new
            {
                action = request.Command,
                timestamp = DateTime.UtcNow,
                message = $"Gate {request.Command} acknowledged"
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Lấy trạng thái để hiển thị LCD
    /// </summary>
    [HttpGet("lcd-status")]
    public async Task<IActionResult> GetLcdStatus()
    {
        var slots = await _db.ParkingSlots.ToListAsync();
        var emptyCount = slots.Count(s => s.Status == "Available");

        return Ok(new
        {
            emptySlots = emptyCount,
            totalSlots = slots.Count,
            isFull = emptyCount == 0,
            slots = slots.Select(s => new
            {
                s.SlotCode,
                s.Status,
                isEmpty = s.Status == "Available"
            })
        });
    }
}

// DTO Classes
public class SensorUpdateRequest
{
    public int[] SlotStatuses { get; set; } // [1,1,0,1,0] where 1=empty, 0=occupied
}

public class EntryDetectedRequest
{
    public DateTime Timestamp { get; set; }
}

public class ExitDetectedRequest
{
    public DateTime Timestamp { get; set; }
}

public class GateCommandRequest
{
    public string Command { get; set; } // "open" or "close"
}
