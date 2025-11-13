import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
//import { sendEmail } from "./notificationController.js";

// GET /api/appointments
// Admin gets all, internal/external get their own
// GET /api/appointments
// Admin gets all, internal/external get their own
export const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user; // role is a string like "internal user"

    // default: admin gets all
    let filter = { is_deleted: false };

    // internal/external users only get their own
    if (role === "internal user" || role === "external user") {
      filter.user = _id;
    }

    const appointments = await Appointment.find(filter)
      .populate("user")
      .populate("slot")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error while fetching appointments." });
  }
};



// POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { slotId, title, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const role_name = req.user.role; // FIXED

    if (!slotId || !title || !description) {
      return res.status(400).json({ message: "Slot, title and description required" });
    }

    if (role_name === "admin") {
      return res.status(403).json({ message: "Admin cannot book appointments" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.isBooked) {
      return res.status(400).json({ message: "Slot unavailable" });
    }

    const status = role_name === "internal user" ? "approved" : "pending";

    const appt = await Appointment.create({
      user: req.user._id,
      slot: slot._id,
      title,
      description,
      role_name,
      status,
    });

    slot.isBooked = true;
    await slot.save();

    // ✅ Correct population
    const populated = await Appointment.findById(appt._id).populate([
      { path: "slot" },
      { path: "user" },
    ]);

    return res.status(201).json(populated);
  } catch (err) {
    console.error("createAppointment error:", err);
    return res.status(500).json({ message: err.message });
  }
};



// GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("user")
      .populate("slot");

    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Not found" });

    if (
      req.user.role_name !== "admin" &&
      String(appt.user._id) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/appointments/:id  (reschedule/update)
export const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Not found" });

    if (
      req.user.role_name !== "admin" &&
      String(appt.user) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { slotId, title, description } = req.body;

    if (slotId && String(appt.slot) !== String(slotId)) {
      const oldSlot = await Slot.findById(appt.slot);
      if (oldSlot) {
        oldSlot.is_booked = false;
        await oldSlot.save();
      }

      const newSlot = await Slot.findById(slotId);
      if (!newSlot || newSlot.is_booked)
        return res.status(400).json({ message: "New slot unavailable" });

      appt.slot = newSlot._id;
      newSlot.is_booked = true;
      await newSlot.save();
    }

    if (title) appt.title = title;
    if (description) appt.description = description;

    if (req.user.role_name === "external user")
      appt.status = "pending";

    await appt.save();

    sendEmail({
      to: req.user.email,
      subject: `Appointment Updated`,
      text: `Your appointment has been modified.`
    }).catch(() => {});

    res.json(await appt.populate("slot").populate("user"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE
export const deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt)
      return res.status(404).json({ message: "Not found" });

    if (
      req.user.role_name !== "admin" &&
      String(appt.user) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const slot = await Slot.findById(appt.slot);
    if (slot) {
      slot.is_booked = false;
      await slot.save();
    }

    appt.is_deleted = true;
    appt.status = "cancelled";
    await appt.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN — Approve / Reject
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role_name !== "admin")
      return res.status(403).json({ message: "Admin only" });

    const { status } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const appt = await Appointment.findById(req.params.id)
      .populate("user slot");
    if (!appt)
      return res.status(404).json({ message: "Not found" });

    appt.status = status;
    await appt.save();

    if (status === "rejected") {
      const slot = await Slot.findById(appt.slot._id);
      if (slot) {
        slot.is_booked = false;
        await slot.save();
      }
    }

    sendEmail({
      to: appt.user.email,
      subject: `Appointment ${status}`,
      text: `Your appointment has been ${status} by the Admin.`
    }).catch(() => {});

    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
