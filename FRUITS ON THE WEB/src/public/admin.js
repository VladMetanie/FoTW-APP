require("dotenv").config();
const fs = require("fs");
const { MongoClient } = require("mongodb");
const Database = require("./database");

function generateAdminList(users) {
  const userAdmin = users
    .map(
      (user) => `
    <li>
      <p><strong>First Name:</strong> ${user.firstName}</p>
      <p><strong>Last Name:</strong> ${user.lastName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Score:</strong> ${user.score}</p>
    </li>
  `
    )
    .join("");
  return userAdmin;
}

function createHTMLFile(userAdmin) {
  const filePath = "../FRUITS ON THE WEB/src/html/admin.html";

  fs.readFile(filePath, "utf-8", (error, fileContent) => {
    if (error) {
      console.error("A apărut o eroare la citirea fișierului:", error);
      return;
    }

    const updatedContent = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!--<link rel="stylesheet" type="text/css" href="../css/home_page.css" /> -->
            <link rel="stylesheet" type="text/css" href="../css/admin.css" />
            <link rel="stylesheet" type="text/css" href="../css/common.css" />
            <link rel="stylesheet" type="text/css" href="../css/responsive.css" />
            <link rel="icon" type="image/x-icon" href="../css/img/Logo.png" />
            <title>Admin</title>
          </head>
          <body>
            <div class="logo">
              <img src="../css/img/LogoNegru2.png" alt="LogoNegru2" /> <br />
            </div>
            <div class="admin" id="adminPanel">
              <h2>All users:</h2>
              <ul id="user-list">
                ${userAdmin}
              </ul>
            </div>
            <!-- top bar -->
            <input class="menu-icon" type="checkbox" id="menu-icon" name="menu-icon" />
            <label for="menu-icon"></label>
            <nav class="nav">
              <ul class="MenuButtons">
                <li><a href="/home"> Home</a></li>
                <li><a href="/help">Help</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/logout">Logout</a></li>
              </ul>
            </nav>
          </body>
        </html>`;

    fs.writeFile(filePath, updatedContent, (error) => {
      if (error) {
        console.error("A apărut o eroare la scrierea fișierului:", error);
      } else {
        console.log('Fișierul "admin.html" a fost actualizat cu succes.');
      }
    });
  });
}

async function updateAdmin() {
  const database = new Database(process.env.DB_URL, process.env.DB_NAME);

  try {
    await database.connect();
    const users = await database.getAdmin();
    const htmlContent1 = generateAdminList(users);
    createHTMLFile(htmlContent1);
  } catch (error) {
    console.error("A apărut o eroare:", error);
  } finally {
    await database.disconnect();
  }
}

updateAdmin();

setInterval(updateAdmin, 1000);
