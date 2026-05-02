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
            new ParkingSlot { SlotCode = "A1", Zone = "A", Status = "Available" },
            new ParkingSlot { SlotCode = "A2", Zone = "A", Status = "Available" },
            new ParkingSlot { SlotCode = "A3", Zone = "A", Status = "Available" },
            new ParkingSlot { SlotCode = "B1", Zone = "B", Status = "Available" },
            new ParkingSlot { SlotCode = "B2", Zone = "B", Status = "Available" }
        });
        
        db.SaveChanges();
    }
}

app.MapControllers();

app.Run();
