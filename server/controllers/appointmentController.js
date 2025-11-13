import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";

// ---------------------- GET ALL / MINE ----------------------
export const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user;

    let filter = { is_deleted: false };
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


// ---------------------- CREATE APPOINTMENT ----------------------
export const createAppointment = async (req, res) => {
  try {
    const { slotId, title, description } = req.body;
    if (!req.user) return res.status(401).json({ message: "Authentication required" });

    const role_name = req.user.role;

    if (!slotId || !title || !description)
      return res.status(400).json({ message: "Slot, title and description required" });

    if (role_name === "admin")
      return res.status(403).json({ message: "Admin cannot book appointments" });

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    if (slot.isBooked) return res.status(400).json({ message: "Slot unavailable" });

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

    const populated = await Appointment.findById(appt._id)
      .populate("slot")
      .populate("user");

    return res.status(201).json(populated);

  } catch (err) {
    console.error("createAppointment error:", err);
    return res.status(500).json({ message: err.message });
  }
};


// ---------------------- GET BY ID ----------------------
export const getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("user")
      .populate("slot");

    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "admin" &&
    String(appt.user._id) !== String(req.user._id)) {
  return res.status(403).json({ message: "Forbidden" });
}


    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------------------- UPDATE (TITLE/DESCRIPTION ONLY) ----------------------
export const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Not found" });

    if (req.user.role !== "admin" &&
    String(appt.user) !== String(req.user._id)) {
  return res.status(403).json({ message: "Forbidden" });
}


    const { title, description } = req.body;
    if (title) appt.title = title;
    if (description) appt.description = description;

    await appt.save();

    const populated = await Appointment.findById(appt._id)
      .populate("slot")
      .populate("user");

    res.json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------------------- SOFT DELETE ----------------------
export const deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Not found" });
    console.log("🟦 CANCEL DEBUG ----");
    console.log("Requester user:", req.user);
    console.log("Appointment user:", appt.user);
    console.log("Admin?", req.user.role);
    console.log("User match?", String(appt.user) === String(req.user._id));

    if (req.user.role !== "admin" &&
    String(appt.user) !== String(req.user._id)) {
  return res.status(403).json({ message: "Forbidden" });
}


    const slot = await Slot.findById(appt.slot);
    if (slot) {
      slot.isBooked = false;
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


// ---------------------- ADMIN STATUS UPDATE ----------------------
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
  return res.status(403).json({ message: "Admin only" });


    const { status } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const appt = await Appointment.findById(req.params.id)
      .populate("user")
      .populate("slot");

    if (!appt) return res.status(404).json({ message: "Not found" });

    appt.status = status;
    await appt.save();

    if (status === "rejected") {
      const slot = await Slot.findById(appt.slot._id);
      if (slot) {
        slot.isBooked = false;
        await slot.save();
      }
    }

    res.json(appt);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------------------- RESCHEDULE APPOINTMENT (THE REAL ONE) ----------------------
export const rescheduleAppointment = async (req, res) => {
  
  try {
    const appointmentId = req.params.id;
    const { slotId } = req.body;

    if (!slotId)
      return res.status(400).json({ message: "New slotId required" });

    const appt = await Appointment.findById(appointmentId);
    if (!appt || appt.is_deleted)
      return res.status(404).json({ message: "Appointment not found" });
    console.log("DEBUG — Logged-in user ID:", req.user?._id);
    console.log("DEBUG — Appointment user ID:", appt?.user?._id);
    console.log("DEBUG — Logged-in user role:", req.user?.role);

    if (
      req.user.role !== "admin" &&
      String(appt.user) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newSlot = await Slot.findById(slotId);
    if (!newSlot) return res.status(404).json({ message: "New slot not found" });
    if (newSlot.isBooked) return res.status(400).json({ message: "Slot already booked" });

    const oldSlot = await Slot.findById(appt.slot);
    if (oldSlot) {
      oldSlot.isBooked = false;
      await oldSlot.save();
    }

    newSlot.isBooked = true;
    await newSlot.save();

    appt.slot = newSlot._id;
    appt.status = req.user.role === "internal user" ? "approved" : "pending";
    await appt.save();

    const updated = await Appointment.findById(appt._id)
      .populate("slot")
      .populate("user");

    res.json(updated);

  } catch (err) {
    console.error("Reschedule error:", err);
    res.status(500).json({ message: err.message });
  }
};
