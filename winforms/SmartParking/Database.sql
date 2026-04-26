CREATE DATABASE ParkingDB;
GO

USE ParkingDB;

CREATE TABLE ParkingLog (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Plate NVARCHAR(50),
    TimeIn DATETIME,
    TimeOut DATETIME,
    SlotNumber INT,
    Fee FLOAT
);