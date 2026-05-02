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
    public DbSet<SystemFault> SystemFaults { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // ParkingSlot
        modelBuilder.Entity<ParkingSlot>(entity =>
        {
            entity.HasKey(x => x.SlotID);
            entity.Property(x => x.SlotCode).HasMaxLength(10);
            entity.Property(x => x.Zone).HasMaxLength(10);
            entity.Property(x => x.Status).HasMaxLength(20);
            entity.Property(x => x.SensorStatus).HasMaxLength(20).HasDefaultValue("Online");
            entity.Property(x => x.LastUpdated).HasDefaultValueSql("GETDATE()");
        });

        // Vehicle
        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(x => x.VehicleID);
            entity.Property(x => x.PlateNumber).HasMaxLength(20);
            entity.Property(x => x.VehicleType).HasMaxLength(20).HasDefaultValue("Car");
            entity.Property(x => x.OwnerName).HasMaxLength(100);
            entity.Property(x => x.IsVIP).HasDefaultValue(false);
            entity.Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
        });

        // ParkingSession
        modelBuilder.Entity<ParkingSession>(entity =>
        {
            entity.HasKey(x => x.SessionID);
            entity.Property(x => x.CheckInTime).HasDefaultValueSql("GETDATE()");
            entity.Property(x => x.Fee).HasColumnType("decimal(18,2)").HasDefaultValue(0);
            entity.Property(x => x.Status).HasMaxLength(20).HasDefaultValue("Active");
        });

        // Log
        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(x => x.LogID);
            entity.Property(x => x.EventTime).HasDefaultValueSql("GETDATE()");
            entity.Property(x => x.ActionType).HasMaxLength(50);
            entity.Property(x => x.PlateNumber).HasMaxLength(20);
            entity.Property(x => x.SlotCode).HasMaxLength(10);
            entity.Property(x => x.Source).HasMaxLength(30);
            entity.Property(x => x.Status).HasMaxLength(20);
            entity.Property(x => x.Details).HasMaxLength(500);
        });

        // SystemFault
        modelBuilder.Entity<SystemFault>(entity =>
        {
            entity.HasKey(x => x.FaultID);
            entity.Property(x => x.FaultType).HasMaxLength(100);
            entity.Property(x => x.Description).HasMaxLength(255);
            entity.Property(x => x.Severity).HasMaxLength(20);
            entity.Property(x => x.Status).HasMaxLength(20).HasDefaultValue("Open");
            entity.Property(x => x.ReportedAt).HasDefaultValueSql("GETDATE()");
        });
    }
}
