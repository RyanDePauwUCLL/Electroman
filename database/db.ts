import * as SQLite from "expo-sqlite";

interface User {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  password: string;
  birthdate?: string | null;
  municipality?: string | null;
  postalcode?: string | null;
  street?: string | null;
  houseNumber?: string | null;
  box?: string | null;
}

interface Workorder {
  id: number;
  city?: string | null;
  device?: string | null;
  problemCode?: string | null;
  customerName?: string | null;
  processed?: number | null;
  detailedProblemDescription?: string | null;
  repairInformation?: string | null;
}

let db: SQLite.SQLiteDatabase | undefined;

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
  db.execSync(`DROP TABLE IF EXISTS users;`);

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

  getDB().runSync(
    `DELETE FROM workorders WHERE
       city LIKE ? OR city LIKE ? OR
       device LIKE ? OR device LIKE ? OR
       customerName LIKE ? OR customerName LIKE ?`,
    ["{%", "%city=%", "{%", "%city=%", "{%", "%city=%"],
  );
}

export function getUserByUsername(username: string) {
  return getDB().getFirstSync("SELECT * FROM users WHERE username = ?", [
    username,
  ]) as User | undefined;
}

export function getUserById(id: number) {
  return getDB().getFirstSync("SELECT * FROM users WHERE id = ?", [id]) as
    | User
    | undefined;
}

export function createUser(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  birthdate?: string,
  municipality?: string,
  postalcode?: string,
  street?: string,
  houseNumber?: string,
  box?: string,
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
  const rows = getDB().getAllSync("SELECT * FROM workorders") as Workorder[];
  return rows.map((row: Workorder) => ({
    id: Number(row.id),
    city: String(row.city ?? ""),
    device: String(row.device ?? ""),
    problemCode: String(row.problemCode ?? ""),
    customerName: String(row.customerName ?? ""),
    processed: Number(row.processed ?? 0),
  }));
}
export function getWorkorderById(id: number) {
  return getDB().getFirstSync("SELECT * FROM workorders WHERE id = ?", [id]) as
    | Workorder
    | undefined;
}

export function addWorkorder(
  city: string,
  device: string,
  problemCode: string,
  customerName: string,
  detailedProblemDescription?: string,
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

export function saveRepairInfo(id: number, repairInformation: string) {
  getDB().runSync(
    "UPDATE workorders SET repairInformation = ?, processed = 1 WHERE id = ?",
    [repairInformation, id],
  );
}

export function reopenWorkorder(id: number) {
  getDB().runSync(
    "UPDATE workorders SET processed = 0, repairInformation = NULL WHERE id = ?",
    [id],
  );
}

// Logs useful DB internals to help locate the database file.
// Call with `logDatabaseInfo(true)` for a more verbose preview.
export function logDatabaseInfo(verbose = false) {
  const _db = getDB();
  try {
    const dbAny = _db as any;
    const keys = Object.keys(dbAny || {}).slice(0, 200);
    console.log("[logDatabaseInfo] DB object keys:", keys);

    const pathCandidates = [
      "databasePath",
      "_dbPath",
      "path",
      "filename",
      "name",
      "_name",
      "database",
    ];

    const found: Record<string, any> = {};
    for (const k of pathCandidates) {
      if (k in dbAny) found[k] = dbAny[k];
    }
    console.log("[logDatabaseInfo] Path-like properties:", found);

    if (verbose) {
      const preview: Record<string, any> = {};
      for (const k of keys) {
        try {
          const v = dbAny[k];
          if (v === null || v === undefined) preview[k] = v;
          else if (
            typeof v === "string" ||
            typeof v === "number" ||
            typeof v === "boolean"
          )
            preview[k] = v;
          else preview[k] = typeof v;
        } catch (e) {
          preview[k] = "<unreadable>";
        }
      }
      console.log("[logDatabaseInfo] DB preview (top keys):", preview);
    }

    // Best-effort single value to display
    const single =
      found.databasePath ??
      found._dbPath ??
      found.path ??
      found.filename ??
      found.name ??
      null;
    return single;
  } catch (e) {
    console.log("[logDatabaseInfo] Failed to read DB info", e);
    return null;
  }
}
