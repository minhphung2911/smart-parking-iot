using Microsoft.EntityFrameworkCore;
using SmartParking.Api.Models;

namespace SmartParking.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<ParkingSlot> ParkingSlots { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<ParkingSession> ParkingSessions { get; set; }
    public DbSet<Log> Logs { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ParkingSlot>().HasKey(x => x.SlotID);
        modelBuilder.Entity<Vehicle>().HasKey(x => x.VehicleID);
        modelBuilder.Entity<ParkingSession>().HasKey(x => x.SessionID);
        modelBuilder.Entity<Log>().HasKey(x => x.LogID);
    }
}
