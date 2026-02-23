const express = require("express");
const Joi = require("joi");
const router = express.Router();
const sql = require("../db/db");
require("dotenv").config();

const apiHost = process.env.API_HOST || "http://localhost:5005";
const normalizePhotoUrl = (value) => {
  if (!value || typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return trimmed;
  const base = apiHost.replace(/\/+$/, "");
  const path = trimmed.replace(/^\/+/, "");
  return `${base}/${path}`;
};
const voteSchema = Joi.object({
  id_candidato: Joi.number().integer().positive().required(),
});

// Ruta para obtener todas las solicitudes
router.get("/get", async (req, res) => {
  try {
    const results = await sql.functions.getRows("votaciones");
    res.json(results);
  } catch (err) {
    console.error("Error fetching rows:", err); // Log para verificar el error
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener todas las solicitudes con la foto completa
router.get("/getCandidatos", async (req, res) => {
  try {
    const results = await sql.functions.getRows("candidatos");
    const candidatos = results.map((candidato) => ({
      ...candidato,
      foto_url: normalizePhotoUrl(candidato.foto_url),
    }));

    res.json(candidatos);
  } catch (err) {
    console.error("Error fetching rows:", err); // Log para verificar el error
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener la cantidad de votos por candidato
router.get("/getCandidateVotes", async (req, res) => {
  try {
    const results = await sql.functions.getCandidateVotes();
    console.log("Candidate votes retrieved at:", Date()); // Log para verificar los resultados
    res.json(results);
  } catch (err) {
    console.error("Error fetching candidate votes:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para crear una nueva solicitud
router.post("/create", async (req, res) => {
  try {
    const { value, error } = voteSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        error: "Datos inválidos",
        details: error.details.map((detail) => detail.message),
      });
    }

    await sql.functions.insertRow("votaciones", value);
    console.log("Insercion exitosa", Date());

    res.status(201).json({ message: "Voto registrado exitosamente" });
  } catch (err) {
    console.error("Error creando la fila:", err);
    res
      .status(500)
      .json({ error: err.message || "Error interno del servidor" });
  }
});

module.exports = router;
