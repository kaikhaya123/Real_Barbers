-- SQLite schema for Real Barbershop bookings

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS barbers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,       -- ISO date YYYY-MM-DD
  time TEXT NOT NULL,       -- HH:MM (24h)
  barber TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending / confirmed / cancelled
  created_at TEXT NOT NULL
);

-- Index for quick slot lookups
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(barber, date, time);
