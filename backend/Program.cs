using Microsoft.EntityFrameworkCore;
using SmartParking.Api.Data;
using SmartParking.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        p => p.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

// RESET DATABASE FOR CLEAN TESTING (Only runs once if slots count is not 5 or if we want to force reset)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (db.Database.CanConnect())
    {
        // Force reset: Clear all sessions, logs, vehicles to start fresh
        db.ParkingSessions.RemoveRange(db.ParkingSessions);
        db.Logs.RemoveRange(db.Logs);
        db.Vehicles.RemoveRange(db.Vehicles);
        
        // Ensure exactly 5 empty slots
        var currentSlots = db.ParkingSlots.ToList();
        db.ParkingSlots.RemoveRange(currentSlots);
        db.ParkingSlots.AddRange(new List<ParkingSlot>
        {
            new ParkingSlot { SlotID = 1, SlotCode = "S1", Zone = "A", Status = "Available", FloorNo = 1, DistanceFromGate = 1 },
            new ParkingSlot { SlotID = 2, SlotCode = "S2", Zone = "A", Status = "Available", FloorNo = 1, DistanceFromGate = 2 },
            new ParkingSlot { SlotID = 3, SlotCode = "S3", Zone = "A", Status = "Available", FloorNo = 1, DistanceFromGate = 3 },
            new ParkingSlot { SlotID = 4, SlotCode = "S4", Zone = "A", Status = "Available", FloorNo = 1, DistanceFromGate = 4 },
            new ParkingSlot { SlotID = 5, SlotCode = "S5", Zone = "A", Status = "Available", FloorNo = 1, DistanceFromGate = 5 }
        });
        
        db.SaveChanges();
    }
}

app.MapControllers();

app.Run();
