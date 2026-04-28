using Microsoft.AspNetCore.Mvc;
using SmartParking.Api.Data;

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
}
