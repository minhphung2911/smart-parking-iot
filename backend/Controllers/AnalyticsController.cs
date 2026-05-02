using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartParking.Api.Data;

namespace SmartParking.Api.Controllers;

[ApiController]
[Route("api/analytics")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AnalyticsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var sessions = await _db.ParkingSessions
            .Include(s => s.Vehicle)
            .ToListAsync();

        var totalRevenue = sessions.Sum(x => x.Fee);
        var totalSessions = sessions.Count();

        var bikeCount = sessions.Count(s => s.Vehicle?.VehicleType == "Bike");
        var carCount = sessions.Count(s => s.Vehicle?.VehicleType == "Car");

        // Last 7 days trend
        var trend = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .Reverse()
            .Select(date => new
            {
                day = date.ToString("ddd"),
                revenue = sessions
                    .Where(s => s.CheckOutTime?.Date == date.Date)
                    .Sum(s => s.Fee)
            }).ToList();

        // Daily stats for table
        var dailyStats = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .Select(date => new
            {
                date = date.ToString("dd/MM"),
                cars = sessions.Count(s => s.CheckInTime.Date == date.Date),
                revenue = sessions
                    .Where(s => s.CheckOutTime?.Date == date.Date)
                    .Sum(s => s.Fee)
            }).ToList();

        return Ok(new
        {
            totalRevenue,
            totalSessions,
            bikeCount,
            carCount,
            revenueTrend = trend,
            dailyStats = dailyStats
        });
    }
}
