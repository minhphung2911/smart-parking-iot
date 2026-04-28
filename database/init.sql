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
    SlotID INT IDENTITY PRIMARY KEY,
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
   2. INSERT PARKING SLOTS (5 slots for WinForms)
========================================================= */

INSERT INTO ParkingSlots (SlotID, SlotCode, Zone, FloorNo, DistanceFromGate, Status)
VALUES
(1,'S1','A',1,1,'Available'),
(2,'S2','A',1,2,'Available'),
(3,'S3','A',1,3,'Available'),
(4,'S4','A',1,4,'Available'),
(5,'S5','A',1,5,'Available');
GO


/* =========================================================
   3. INSERT VEHICLES (30 xe)
========================================================= */

INSERT INTO Vehicles (PlateNumber, VehicleType, OwnerName, IsVIP)
VALUES
('67A12345','Car','Nguyen Van A',0),
('51B45678','Car','Tran Thi B',1),
('59C88888','Car','Le Van C',0),
('66D77777','Car','Pham Van D',0),
('72A11111','Car','Hoang Van E',1),
('83B22222','Car','Vo Thi F',0),
('94C33333','Car','Nguyen G',0),
('68D44444','Car','Tran H',0),
('63A55555','Car','Le I',0),
('70B66666','Car','Pham J',1),

('60A11122','Car','User11',0),
('60A11123','Car','User12',0),
('60A11124','Car','User13',0),
('60A11125','Car','User14',0),
('60A11126','Car','User15',0),
('60A11127','Car','User16',0),
('60A11128','Car','User17',0),
('60A11129','Car','User18',0),
('60A11130','Car','User19',0),
('60A11131','Car','User20',0),

('60A11132','Car','User21',0),
('60A11133','Car','User22',0),
('60A11134','Car','User23',0),
('60A11135','Car','User24',0),
('60A11136','Car','User25',0),
('60A11137','Car','User26',0),
('60A11138','Car','User27',0),
('60A11139','Car','User28',0),
('60A11140','Car','User29',0),
('60A11141','Car','User30',0);
GO


/* =========================================================
   4. ACTIVE SESSIONS (xe đang đỗ)
========================================================= */

INSERT INTO ParkingSessions
(VehicleID, SlotID, CheckInTime, DurationMinutes, Fee, Status)
VALUES
(1,1,DATEADD(HOUR,-2,GETDATE()),120,20,'Active'),
(2,2,DATEADD(HOUR,-1,GETDATE()),60,10,'Active');
GO


/* =========================================================
   5. CLOSED SESSIONS lịch sử (40 records)
========================================================= */

DECLARE @i INT = 7;
WHILE @i <= 46
BEGIN
    INSERT INTO ParkingSessions
    (VehicleID, SlotID, CheckInTime, CheckOutTime, DurationMinutes, Fee, Status)
    VALUES
    (
        ((@i-1)%30)+1,
        ((@i-1)%6)+1,
        DATEADD(DAY,-ABS(CHECKSUM(NEWID())%7),
            DATEADD(HOUR,-ABS(CHECKSUM(NEWID())%10),GETDATE())),
        DATEADD(DAY,-ABS(CHECKSUM(NEWID())%7),
            DATEADD(HOUR,-ABS(CHECKSUM(NEWID())%5),GETDATE())),
        60 + ABS(CHECKSUM(NEWID())%180),
        10 + ABS(CHECKSUM(NEWID())%40),
        'Closed'
    );
    SET @i = @i + 1;
END
GO


/* =========================================================
   6. LOGS (50 records)
========================================================= */

DECLARE @n INT = 1;
WHILE @n <= 50
BEGIN
    INSERT INTO Logs
    (EventTime, ActionType, PlateNumber, SlotCode, Source, Status, Details)
    VALUES
    (
        DATEADD(MINUTE,-@n*5,GETDATE()),
        CASE @n % 5
            WHEN 0 THEN 'Check-in'
            WHEN 1 THEN 'Check-out'
            WHEN 2 THEN 'Assign'
            WHEN 3 THEN 'Transfer'
            ELSE 'Fault'
        END,
        CONCAT('60A',10000+@n),
        CONCAT(CHAR(65 + (@n%2)), ((@n%3)+1)),
        CASE WHEN @n % 2 = 0 THEN 'Auto Sensor' ELSE 'Admin' END,
        CASE WHEN @n % 7 = 0 THEN 'Error' ELSE 'Success' END,
        CONCAT('System generated event #',@n)
    );
    SET @n = @n + 1;
END
GO


/* =========================================================
   7. SYSTEM FAULTS (5 records)
========================================================= */

INSERT INTO SystemFaults
(SlotID, FaultType, Description, Severity, Status)
VALUES
(2,'Sensor Offline','A2 sensor lost signal','High','Open'),
(5,'Barrier Jam','Gate response delayed','Medium','Open'),
(4,'Camera Blur','License plate camera blurry','Low','Open'),
(2,'Connection Timeout','Controller reconnecting','Medium','Closed'),
(5,'Power Surge','Recovered after restart','High','Closed');
GO


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
