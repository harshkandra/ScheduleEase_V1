import express from "express";
import { upload, gridfsBucket } from "../utils/gridfs.js";
import {
  getAppointments,
  createAppointment,
  getAppointmentById,
  rescheduleAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  getApprovedAppointments,
  getPendingAppointments
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

router.get(
  "/pending", ensureAuthenticated,(req, res, next) => {
    console.log("🟡 HIT /pending ROUTE");
    next();
}, getPendingAppointments);


/* =====================
   LIST + CREATE
===================== */

router.get("/", ensureAuthenticated, getAppointments);
router.post("/", ensureAuthenticated, createAppointment);
router.patch("/:id/reschedule", ensureAuthenticated, rescheduleAppointment);


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
router.patch("/:id/approve", ensureAuthenticated, (req, res, next) => {
  console.log("🔥 HIT /:id/approve");
  next();
}, updateAppointmentStatus);
router.patch("/:id/reject", ensureAuthenticated, updateAppointmentStatus);



// Upload a file and attach it to appointment
router.post("/:id/attachment", upload.single("file"), async (req, res) => {
  try {
    const fileId = req.file.id;

    await Appointment.findByIdAndUpdate(req.params.id, {
      attachment: fileId,
    });

    res.json({
      success: true,
      message: "Attachment uploaded!",
      fileId,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/attachment/:fileId", async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    const stream = gridfsBucket.openDownloadStream(fileId);
    stream.on("error", () => {
      return res.status(404).json({ message: "File not found" });
    });

    stream.pipe(res);
  } catch (err) {
    return res.status(400).json({ message: "Invalid file id" });
  }
});

router.delete("/attachment/:fileId", async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.fileId);
    await gridfsBucket.delete(id);

    res.json({ message: "Attachment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete attachment" });
  }
});

export default router;
