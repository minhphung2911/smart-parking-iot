using Microsoft.AspNetCore.Mvc;
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
    public IActionResult Get()
    {
        var revenue = _db.ParkingSessions.Sum(x => x.Fee);

        return Ok(new
        {
            totalRevenue = revenue,
            totalSessions = _db.ParkingSessions.Count()
        });
    }
}
