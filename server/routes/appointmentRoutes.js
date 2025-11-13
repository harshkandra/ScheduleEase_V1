import express from "express";
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  rescheduleAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import { mockAuth } from "../middleware/mockAuth.js";

const router = express.Router();

import { ensureAuthenticated } from "../middleware/authMiddleware.js";
router.get("/", ensureAuthenticated, getAppointments);
router.post("/", ensureAuthenticated, createAppointment);
router.patch("/:id/reschedule", ensureAuthenticated, rescheduleAppointment);




router.use(mockAuth);

// router.route("/")
//   .get(getAppointments)
//   .post(createAppointment);

router.route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.put("/:id/status", updateAppointmentStatus);

export default router;

