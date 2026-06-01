import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("electroman.db");

export function initDB() {
  db.execSync(`
        DROP TABLE IF EXISTS workorders;
        DROP TABLE IF EXISTS users;
        `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      birthdate TEXT,
      municipality TEXT,
      postalcode TEXT,
      street TEXT,
      houseNumber TEXT,
      box TEXT
    );

    CREATE TABLE IF NOT EXISTS workorders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT,
      device TEXT,
      problemCode TEXT,
      customerName TEXT,
      processed INTEGER DEFAULT 0,
      detailedProblemDescription TEXT,
      repairInformation TEXT
    );
  `);

  db.runSync(
    `INSERT INTO users (firstName, lastName, username, password, birthdate, municipality, postalcode, street, houseNumber)
     VALUES ('Test', 'User', 'test', 'test', '1990-01-01', 'Gent', '9000', 'Teststraat', '1')`,
  );

  db.execSync(`
    INSERT INTO workorders (city, device, problemCode, customerName, processed, detailedProblemDescription)
    VALUES
      ('Gent',     'TV',      'P001', 'Marie Peeters',  0, 'Scherm toont geen beeld na opstarten'),
      ('Brussel',  'Laptop',  'P002', 'Luc Claes',      0, 'Toestel start niet op, batterij defect'),
      ('Antwerpen','GSM',     'P003', 'Emma Wouters',   0, 'Scherm gebarsten, touchscreen reageert niet'),
      ('Leuven',   'Tablet',  'P004', 'Jonas Hermans',  0, 'Laadt niet meer op via USB-C'),
      ('Gent',     'Printer', 'P005', 'Sara Declercq',  0, 'Papierstoring bij elke afdruk');
  `);
}
