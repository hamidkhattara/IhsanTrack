import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import { sequelize } from "./src/models/index.js";
import swaggerSpec from "./src/docs/swagger.js";

import authRoutes from "./src/routes/auth.routes.js";
import associationRoutes from "./src/routes/association.routes.js";
import donationProjectRoutes from "./src/routes/donationProject.routes.js";
import donationRoutes from "./src/routes/donation.routes.js";
import eventRoutes from "./src/routes/event.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const repairVolunteersRegistryEventFk = async () => {
  const [rows] = await sequelize.query(`
    SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'volunteers_registry'
      AND COLUMN_NAME = 'event_id'
      AND REFERENCED_TABLE_NAME IS NOT NULL
  `);

  for (const row of rows) {
    if (row.REFERENCED_TABLE_NAME !== "events") {
      await sequelize.query(
        `ALTER TABLE volunteers_registry DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`
      );
    }
  }

  const [updatedRows] = await sequelize.query(`
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'volunteers_registry'
      AND COLUMN_NAME = 'event_id'
      AND REFERENCED_TABLE_NAME = 'events'
  `);

  if (!updatedRows.length) {
    await sequelize.query(`
      ALTER TABLE volunteers_registry
      ADD CONSTRAINT fk_volunteers_registry_event_id
      FOREIGN KEY (event_id)
      REFERENCES events(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
    `);
  }
};

// ── Middleware ──
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ── Swagger Docs ──
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/associations", associationRoutes);
app.use("/api/donation-projects", donationProjectRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/events", eventRoutes);

// ── Health Check ──
app.get("/", (req, res) => {
  res.json({
    message: "IhsanTrack API is running — إحسان الجزائر",
    docs: "/api-docs",
  });
});

// ── Start Server ──
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Widen role enum first to allow legacy-to-new role value migration safely.
    await sequelize.query(
      "ALTER TABLE users MODIFY role ENUM('donor','volunteer','association','assoc_admin','user') NOT NULL DEFAULT 'donor'"
    );
    await sequelize.query(
      "UPDATE users SET role = 'association' WHERE role IN ('assoc_admin')"
    );
    await sequelize.query("UPDATE users SET role = 'donor' WHERE role IN ('user', '') OR role IS NULL");

    await repairVolunteersRegistryEventFk();

    await sequelize.sync({ alter: true });
    console.log("All models synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
