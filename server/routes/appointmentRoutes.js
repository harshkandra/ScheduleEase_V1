import express from "express";
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getApprovedAppointments
} from "../controllers/appointmentController.js";

import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================
   STATIC ROUTES FIRST
===================== */

// All approved appointments
router.get("/approved", ensureAuthenticated, (req, res, next) => {
  console.log("🔥 HIT /approved ROUTE");
  next();
}, getApprovedAppointments);

/* =====================
   LIST + CREATE
===================== */

router.get("/", ensureAuthenticated, getAppointments);
router.post("/", ensureAuthenticated, createAppointment);

/* =====================
   SPECIFIC APPOINTMENT
===================== */

// get specific appointment
router.get("/:id", ensureAuthenticated, getAppointmentById);

// update appointment
router.put("/:id", ensureAuthenticated, updateAppointment);

// delete appointment
router.delete("/:id", ensureAuthenticated, deleteAppointment);

/* =====================
   ADMIN STATUS UPDATE
===================== */

router.put("/:id/status", ensureAuthenticated, updateAppointmentStatus);

export default router;
