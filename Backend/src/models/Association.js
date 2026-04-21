import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Association = sequelize.define(
  "Association",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "users", key: "id" },
    },
    social_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    wilaya: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Maps_link: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    social_media_links: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    opening_hours: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    agreed_to_tos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "associations",
    timestamps: true,
    underscored: true,
  }
);

export default Association;
