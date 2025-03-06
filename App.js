require("dotenv").config();
require("module-alias/register");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { exec } = require("child_process");
const ejs = require("ejs");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

// Module aliases (tetap seperti sebelumnya)
const aliasesDir = path.join(__dirname, "Aliases");
fs.readdirSync(aliasesDir).forEach((file) => {
  if (file.endsWith(".js")) {
    const registerFunction = require(path.join(aliasesDir, file));
    if (typeof registerFunction === "function") {
      registerFunction();
      console.log(`Registered aliases from ${file}`);
    }
  }
});

const logs = require("./Middlewares/logs");

// EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Apps/Web/Views"));

// Direktori komponen
const componentsDir = path.join(__dirname, "Apps/Web/Views/Components");

// Membaca semua file di direktori Components secara rekursif
const componentAliases = {};
function readComponentsDir(dir, basePath = "") {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = basePath ? `${basePath}/${file}` : file;
    if (fs.statSync(fullPath).isDirectory()) {
      readComponentsDir(fullPath, relativePath);
    } else if (file.endsWith(".ejs")) {
      const componentName = `@${relativePath.replace(".ejs", "")}`;
      componentAliases[componentName] = `Components/${relativePath}`;
    }
  });
}

readComponentsDir(componentsDir);
console.log("Component aliases yang ditemukan:", componentAliases);

// Override fungsi include EJS
app.engine("ejs", (filePath, options, callback) => {
  const customInclude = (includePath, data) => {
    let resolvedPath = includePath;
    if (includePath.startsWith("@")) {
      resolvedPath = componentAliases[includePath];
      if (!resolvedPath) {
        throw new Error(
          `Komponen ${includePath} tidak ditemukan di direktori Components`
        );
      }
    }
    const fullPath = path.join(app.get("views"), resolvedPath);
    // Render secara sinkronus
    return ejs.render(fs.readFileSync(fullPath, "utf8"), {
      ...options,
      ...data,
    });
  };

  options.include = customInclude;
  ejs.renderFile(filePath, options, callback);
});

// Static files
app.use(express.static(path.join(__dirname, "Apps/Web/Assets")));
app.use(express.static(path.join(__dirname, "Apps/Web/Views")));

// Middleware (tetap seperti sebelumnya)
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(logs);

// Routes (tetap seperti sebelumnya)
app.get("/", (req, res) => {
  res.status(200).render("Pages/index");
});

app.use(["/siempu", "/auth"], (req, res, next) => {
  res.renderAdmin = (view, options) => {
    res.render(`Pages/Admin/${view}`, options);
  };
  next();
});

app.get(["/auth", "/login"], (req, res) => {
  res.redirect(301, "/auth/login");
});

const routesAdmin = require("./Routes/Web/Admin");
app.use("/siempu", routesAdmin);

const routesAuth = require("./Routes/Web/Auth");
app.use("/auth", routesAuth);

const routesApi = require("./Routes/Api/Admin");
app.use("/api/empu", routesApi);

// 404 Handler
app.use((req, res) => {
  const datas = {
    title: "Not Found 404",
    description: "Page not found",
    keywords: "404",
    error: "",
  };
  res.status(404).render("Pages/404", { datas });
});

// Start Server
function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}!`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} sedang digunakan, mencoba membebaskannya...`);
      exec(`fuser -k ${port}/tcp`, (error) => {
        if (error) {
          console.error(
            `Gagal mematikan proses di port ${port}:`,
            error.message
          );
          process.exit(1);
        } else {
          console.log(`Port ${port} berhasil dibebaskan, restart server...`);
          setTimeout(startServer, 1000);
        }
      });
    } else {
      console.error("Error server:", err.message);
      process.exit(1);
    }
  });
}

startServer();
