import * as SQLite from "expo-sqlite";

let db;

function getDB() {
  if (!db) {
    try {
      db = SQLite.openDatabaseSync("electroman.db");
    } catch (e) {
      db = SQLite.openDatabaseSync(":memory:");
    }
  }
  return db;
}

export function initDB() {
  const db = getDB();

  db.execSync(`DROP TABLE IF EXISTS workorders;`);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT, lastName TEXT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      birthdate TEXT, municipality TEXT,
      postalcode TEXT, street TEXT,
      houseNumber TEXT, box TEXT
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS workorders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT, device TEXT, problemCode TEXT,
      customerName TEXT, processed INTEGER DEFAULT 0,
      detailedProblemDescription TEXT, repairInformation TEXT
    );
  `);

  db.runSync(
    `INSERT OR IGNORE INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)`,
    ["Test", "User", "test", "test"],
  );

  db.execSync(`
    INSERT INTO workorders (city, device, problemCode, customerName, detailedProblemDescription)
    VALUES
      ('Gent',      'TV',      'P001', 'Marie Peeters', 'Scherm toont geen beeld'),
      ('Brussel',   'Laptop',  'P002', 'Luc Claes',     'Start niet op'),
      ('Antwerpen', 'GSM',     'P003', 'Emma Wouters',  'Scherm gebarsten'),
      ('Leuven',    'Tablet',  'P004', 'Jonas Hermans', 'Laadt niet op'),
      ('Gent',      'Printer', 'P005', 'Sara Declercq', 'Papierstoring');
  `);

  // Cleanup any corrupted rows where a serialized object was inserted into a column
  // (e.g. strings like "{city=Leuven, device=...}"). Remove rows where city/device/customerName
  // start with '{' or contain the pattern 'city=' which indicates a stringified object.
  getDB().runSync(
    `DELETE FROM workorders WHERE
       city LIKE ? OR city LIKE ? OR
       device LIKE ? OR device LIKE ? OR
       customerName LIKE ? OR customerName LIKE ?`,
    ["{%", "%city=%", "{%", "%city=%", "{%", "%city=%"],
  );
}

export function getUserByUsername(username) {
  return getDB().getFirstSync("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
}

export function getUserById(id) {
  return getDB().getFirstSync("SELECT * FROM users WHERE id = ?", [id]);
}

export function createUser(
  firstName,
  lastName,
  username,
  password,
  birthdate,
  municipality,
  postalcode,
  street,
  houseNumber,
  box,
) {
  getDB().runSync(
    `INSERT INTO users (firstName, lastName, username, password, birthdate, municipality, postalcode, street, houseNumber, box)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      firstName,
      lastName,
      username,
      password,
      birthdate ?? "",
      municipality ?? "",
      postalcode ?? "",
      street ?? "",
      houseNumber ?? "",
      box ?? "",
    ],
  );
}

export function getWorkorders() {
  const rows = getDB().getAllSync("SELECT * FROM workorders");
  return rows.map((row) => ({
    id: Number(row.id),
    city: String(row.city ?? ""),
    device: String(row.device ?? ""),
    problemCode: String(row.problemCode ?? ""),
    customerName: String(row.customerName ?? ""),
    processed: Number(row.processed ?? 0),
  }));
}
export function getWorkorderById(id) {
  return getDB().getFirstSync("SELECT * FROM workorders WHERE id = ?", [id]);
}

export function addWorkorder(
  city,
  device,
  problemCode,
  customerName,
  detailedProblemDescription,
) {
  const existing = getDB().getFirstSync(
    "SELECT id FROM workorders WHERE city = ? AND device = ? AND customerName = ?",
    [city, device, customerName],
  );
  if (existing) throw new Error("Werkorder bestaat al");

  getDB().runSync(
    `INSERT INTO workorders (city, device, problemCode, customerName, processed, detailedProblemDescription)
     VALUES (?, ?, ?, ?, 0, ?)`,
    [city, device, problemCode, customerName, detailedProblemDescription ?? ""],
  );
}

export function saveRepairInfo(id, repairInformation) {
  getDB().runSync(
    "UPDATE workorders SET repairInformation = ?, processed = 1 WHERE id = ?",
    [repairInformation, id],
  );
}

export function reopenWorkorder(id) {
  getDB().runSync(
    "UPDATE workorders SET processed = 0, repairInformation = NULL WHERE id = ?",
    [id],
  );
}
