/* =========================================================
   SMART PARKING DATABASE
   Full SQL Script + Sample Data (~100+ records)
   SQL Server
========================================================= */

IF DB_ID('SmartParkingDB') IS NOT NULL
BEGIN
    ALTER DATABASE SmartParkingDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SmartParkingDB;
END
GO

CREATE DATABASE SmartParkingDB;
GO

USE SmartParkingDB;
GO

/* =========================================================
   1. TABLES
========================================================= */

CREATE TABLE ParkingSlots (
    SlotID INT PRIMARY KEY,
    SlotCode NVARCHAR(10) UNIQUE NOT NULL,
    Zone NVARCHAR(10),
    FloorNo INT DEFAULT 1,
    DistanceFromGate INT DEFAULT 0,
    Status NVARCHAR(20) NOT NULL,   -- Available Occupied Reserved Fault
    SensorStatus NVARCHAR(20) DEFAULT 'Online',
    LastUpdated DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Vehicles (
    VehicleID INT IDENTITY PRIMARY KEY,
    PlateNumber NVARCHAR(20) UNIQUE NOT NULL,
    VehicleType NVARCHAR(20) DEFAULT 'Car',
    OwnerName NVARCHAR(100),
    IsVIP BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE ParkingSessions (
    SessionID INT IDENTITY PRIMARY KEY,
    VehicleID INT NOT NULL,
    SlotID INT NOT NULL,
    CheckInTime DATETIME NOT NULL DEFAULT GETDATE(),
    CheckOutTime DATETIME NULL,
    DurationMinutes INT NULL,
    Fee DECIMAL(18,2) DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'Active', -- Active Closed

    FOREIGN KEY (VehicleID) REFERENCES Vehicles(VehicleID),
    FOREIGN KEY (SlotID) REFERENCES ParkingSlots(SlotID)
);
GO

CREATE TABLE Logs (
    LogID INT IDENTITY PRIMARY KEY,
    EventTime DATETIME DEFAULT GETDATE(),
    ActionType NVARCHAR(50),
    PlateNumber NVARCHAR(20),
    SlotCode NVARCHAR(10),
    Source NVARCHAR(30),
    Status NVARCHAR(20),
    Details NVARCHAR(500)
);
GO

<<<<<<< HEAD
-- Table for WinForms Legacy Compatibility
CREATE TABLE ParkingLog (
    Id INT IDENTITY PRIMARY KEY,
    Plate NVARCHAR(20),
    TimeIn DATETIME,
    TimeOut DATETIME,
    SlotNumber INT,
    Fee DECIMAL(18,2)
=======
/* =========================================================
   WINFORMS COMPATIBILITY TABLE
   Legacy ParkingLog table for WinForms desktop app
========================================================= */

CREATE TABLE ParkingLog (
    Id INT IDENTITY PRIMARY KEY,
    Plate NVARCHAR(20) NOT NULL,
    TimeIn DATETIME NOT NULL DEFAULT GETDATE(),
    TimeOut DATETIME NULL,
    SlotNumber INT NOT NULL,
    Fee DECIMAL(18,2) DEFAULT 0
>>>>>>> 060c646655c4e2280012ae4e519582d7af9eaf4d
);
GO

CREATE TABLE SystemFaults (
    FaultID INT IDENTITY PRIMARY KEY,
    SlotID INT NULL,
    FaultType NVARCHAR(100),
    Description NVARCHAR(255),
    Severity NVARCHAR(20),
    Status NVARCHAR(20) DEFAULT 'Open',
    ReportedAt DATETIME DEFAULT GETDATE(),
    ResolvedAt DATETIME NULL,

    FOREIGN KEY (SlotID) REFERENCES ParkingSlots(SlotID)
);
GO


/* =========================================================
<<<<<<< HEAD
   2. INSERT PARKING SLOTS (5 slots ONLY)
=======
   2. INSERT PARKING SLOTS (5 slots for WinForms)
>>>>>>> 060c646655c4e2280012ae4e519582d7af9eaf4d
========================================================= */

INSERT INTO ParkingSlots (SlotID, SlotCode, Zone, FloorNo, DistanceFromGate, Status)
VALUES
<<<<<<< HEAD
('A1','A',1,1,'Available'),
('A2','A',1,2,'Available'),
('A3','A',1,3,'Available'),
('B1','B',1,4,'Available'),
('B2','B',1,5,'Available');
GO
=======
(1,'S1','A',1,1,'Available'),
(2,'S2','A',1,2,'Available'),
(3,'S3','A',1,3,'Available'),
(4,'S4','A',1,4,'Available'),
(5,'S5','A',1,5,'Available');
GO


/* =========================================================
   3. VEHICLES - No seed data (inserted by application)
========================================================= */
-- Empty


/* =========================================================
   4. PARKING SESSIONS - No seed data (inserted by application)
========================================================= */
-- Empty


/* =========================================================
   5. LOGS - No seed data (inserted by application)
========================================================= */
-- Empty


/* =========================================================
   6. SYSTEM FAULTS - No seed data
========================================================= */
-- Empty
>>>>>>> 060c646655c4e2280012ae4e519582d7af9eaf4d


/* =========================================================
   8. QUICK TEST QUERIES
========================================================= */

-- Dashboard
SELECT COUNT(*) AS TotalSlots FROM ParkingSlots;
SELECT COUNT(*) AS OccupiedSlots FROM ParkingSlots WHERE Status='Occupied';
SELECT COUNT(*) AS AvailableSlots FROM ParkingSlots WHERE Status='Available';

-- Parking Slots View
SELECT s.SlotCode, s.Status, v.PlateNumber
FROM ParkingSlots s
LEFT JOIN ParkingSessions ps ON s.SlotID = ps.SlotID AND ps.Status='Active'
LEFT JOIN Vehicles v ON ps.VehicleID = v.VehicleID
ORDER BY s.SlotCode;

-- Logs
SELECT TOP 20 * FROM Logs ORDER BY EventTime DESC;

-- Analytics Revenue
SELECT SUM(Fee) AS RevenueToday
FROM ParkingSessions
WHERE CAST(CheckInTime AS DATE)=CAST(GETDATE() AS DATE);

-- Peak Hour
SELECT DATEPART(HOUR, CheckInTime) AS HourNo, COUNT(*) AS TotalCars
FROM ParkingSessions
GROUP BY DATEPART(HOUR, CheckInTime)
ORDER BY TotalCars DESC;
GO
