const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function hashExistingPasswords() {
  const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rootpassword123", // Remplace par ton mot de passe
    database: "mangaverse_db",
  });

  const users = [
    { email: "user1@gmail.com", password: "password123!" },
    { email: "user2@gmail.com", password: "password123!" },
    { email: "user3@gmail.com", password: "password123!" },
  ];

  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.query("UPDATE Users SET password = ? WHERE email = ?", [
        hashedPassword,
        user.email,
      ]);
      console.log(`Updated password for ${user.email}`);
    }
    console.log("All passwords updated successfully");
  } catch (error) {
    console.error("Error updating passwords:", error);
  } finally {
    db.end();
  }
}

hashExistingPasswords();