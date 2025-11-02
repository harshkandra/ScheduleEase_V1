import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
import { sendEmail } from "./notificationController.js";

// GET /api/appointments
// Admin gets all, others get their own
export const getAppointments = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const appts = await Appointment.find().populate("user slot").sort({ createdAt: -1 });
      return res.json(appts);
    }
    const appts = await Appointment.find({ user: req.user._id }).populate("slot").sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { slotId, purpose } = req.body;
    if (!slotId) return res.status(400).json({ message: "slotId required" });

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ message: "Slot already booked" });

    // set status based on role
    let status = "pending";
    if (req.user.role === "internal") status = "approved";
    if (req.user.role === "admin") status = "approved";

    const appt = await Appointment.create({
      user: req.user._id,
      slot: slot._id,
      purpose,
      status,
    });

    // mark slot as booked if approved or pending (reserve)
    slot.isBooked = true;
    await slot.save();

    // send email notification
    sendEmail({
      to: req.user.email,
      subject: `Appointment ${status}`,
      text: `Your appointment is ${status}.`,
    }).catch(()=>{});

    const populated = await appt.populate("slot").populate("user");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate("user slot");
    if (!appt) return res.status(404).json({ message: "Not found" });
    // only admin or owner can view
    if (req.user.role !== "admin" && String(appt.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id  (reschedule or update purpose) - owner or admin
export const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && String(appt.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { slotId, purpose } = req.body;
    if (slotId && String(appt.slot) !== String(slotId)) {
      // free old slot
      const oldSlot = await Slot.findById(appt.slot);
      if (oldSlot) {
        oldSlot.isBooked = false;
        await oldSlot.save();
      }
      // check new slot
      const newSlot = await Slot.findById(slotId);
      if (!newSlot || newSlot.isBooked) return res.status(400).json({ message: "New slot unavailable" });
      appt.slot = newSlot._id;
      newSlot.isBooked = true;
      await newSlot.save();
    }

    if (purpose) appt.purpose = purpose;

    // if external user reschedules, keep status pending until admin approves again
    if (req.user.role === "external") appt.status = "pending";

    await appt.save();

    sendEmail({
      to: req.user.email,
      subject: `Appointment updated`,
      text: `Your appointment has been updated.`,
    }).catch(()=>{});

    const populated = await appt.populate("slot").populate("user");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/appointments/:id  (cancel) - owner or admin
export const deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Not found" });
    if (req.user.role !== "admin" && String(appt.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // free slot
    const slot = await Slot.findById(appt.slot);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    appt.status = "cancelled";
    await appt.save();

    sendEmail({
      to: req.user.email,
      subject: `Appointment cancelled`,
      text: `Your appointment has been cancelled.`,
    }).catch(()=>{});

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id/status  (admin only) - approve/reject
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    const { status } = req.body;
    if (!["approved","rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

    const appt = await Appointment.findById(req.params.id).populate("user slot");
    if (!appt) return res.status(404).json({ message: "Not found" });

    appt.status = status;
    await appt.save();

    // if rejected, free slot
    if (status === "rejected") {
      const slot = await Slot.findById(appt.slot._id);
      if (slot) {
        slot.isBooked = false;
        await slot.save();
      }
    }

    sendEmail({
      to: appt.user.email,
      subject: `Appointment ${status}`,
      text: `Your appointment has been ${status} by admin.`,
    }).catch(()=>{});

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
