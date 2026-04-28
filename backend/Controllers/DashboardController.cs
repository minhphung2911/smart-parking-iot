using Microsoft.AspNetCore.Mvc;
using SmartParking.Api.Data;

namespace SmartParking.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var total = _db.ParkingSlots.Count();
        var occupied = _db.ParkingSlots.Count(x => x.Status == "Occupied");
        var available = _db.ParkingSlots.Count(x => x.Status == "Available");

        var revenue = _db.ParkingSessions
            .Where(x => x.CheckOutTime != null &&
                   x.CheckOutTime.Value.Date == DateTime.Today)
            .Sum(x => (decimal?)x.Fee) ?? 0;

        return Ok(new
        {
            totalSlots = total,
            occupied,
            available,
            revenueToday = revenue
        });
    }
}
