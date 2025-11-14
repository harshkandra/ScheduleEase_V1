// client/src/components/BookAppointmentModal.jsx
<<<<<<< HEAD
import React, { useState } from "react";
=======
<<<<<<< HEAD
import React, { useEffect, useState } from "react";
>>>>>>> merge/adminedits
import axios from "axios";

/**
 * New virtual-slot version
 * The user selects:
 *   1. Date
 *   2. Duration
 *   3. Picks from generated virtual slots
 *
 * Backend will create the actual Slot entry.
 */
export default function BookAppointmentModal({
  onClose = () => {},
  onSubmit = () => {},
}) {
  // --- FORM STATE ---
  const [form, setForm] = useState({
    name: "",
    email: "",
<<<<<<< HEAD
=======
    phone: "",
=======
import React, { useState } from "react";
import axios from "axios";

/**
 * New virtual-slot version
 * The user selects:
 *   1. Date
 *   2. Duration
 *   3. Picks from generated virtual slots
 *
 * Backend will create the actual Slot entry.
 */
export default function BookAppointmentModal({
  onClose = () => {},
  onSubmit = () => {},
}) {
  // --- FORM STATE ---
  const [form, setForm] = useState({
    name: "",
    email: "",
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
    meetingType: "",
    duration: "",
    purpose: "",
    agenda: "",
<<<<<<< HEAD
    date: "",
    timeStart: "",
=======
<<<<<<< HEAD
    docs: "",
    date: defaultDate || (preselectedSlot ? preselectedSlot.date : ""),
    time: defaultTime || (preselectedSlot ? preselectedSlot.timeStart : ""),
>>>>>>> merge/adminedits
  });

  const [virtualSlots, setVirtualSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

<<<<<<< HEAD
  // --- Change handler ---
=======
  useEffect(() => {
    if (defaultDate) setForm((s) => ({ ...s, date: defaultDate }));
    if (defaultTime) setForm((s) => ({ ...s, time: defaultTime }));
    if (preselectedSlot) {
      setForm((s) => ({ ...s, date: preselectedSlot.date, time: preselectedSlot.timeStart }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, defaultTime, preselectedSlot]);

  // Fetch slots for selected date
  useEffect(() => {
    const load = async () => {
      if (!form.date) {
        setAvailableSlots([]);
        return;
      }
      try {
        setLoadingSlots(true);
        const res = await axios.get(`http://localhost:5000/api/slots?date=${form.date}`, {
          withCredentials: true,
        });
        // Keep only unbooked slots
        const free = (res.data || []).filter((s) => s.isBooked === false || s.isBooked === undefined);
        setAvailableSlots(free);
        // if preselected slot still valid, keep; otherwise reset time
        if (!free.find((s) => s.timeStart === form.time)) {
          setForm((s) => ({ ...s, time: "" }));
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    load();
  }, [form.date]);

=======
    date: "",
    timeStart: "",
  });

  const [virtualSlots, setVirtualSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Change handler ---
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

<<<<<<< HEAD
  // --- Fetch virtual slots ---
  const fetchVirtualSlots = async () => {
    if (!form.date || !form.duration) {
      alert("Select date and duration first.");
      return;
    }

    try {
      setLoadingSlots(true);

      const res = await axios.get(
        `http://localhost:5000/api/slots/available?date=${form.date}&duration=${form.duration}`,
        { withCredentials: true }
      );

      setVirtualSlots(res.data || []);
      if (res.data.length === 0) {
        alert("No available times for selected duration.");
      }
    } catch (err) {
      console.error("Error fetching generated slots:", err);
      alert("Failed to load available times.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // --- Submit booking ---
=======
<<<<<<< HEAD
>>>>>>> merge/adminedits
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.meetingType ||
      !form.duration ||
      !form.purpose ||
      !form.date ||
      !form.timeStart
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      date: form.date,
      startTime: form.timeStart,
      duration: form.duration,
      title: form.purpose,
      description: `${form.meetingType} — ${form.agenda || "No agenda"}`,
<<<<<<< HEAD
=======
      // Do NOT send role_name unless you explicitly want to override backend auth;
      // backend prefers req.user.role / req.user.role_name
=======
  // --- Fetch virtual slots ---
  const fetchVirtualSlots = async () => {
    if (!form.date || !form.duration) {
      alert("Select date and duration first.");
      return;
    }

    try {
      setLoadingSlots(true);

      const res = await axios.get(
        `http://localhost:5000/api/slots/available?date=${form.date}&duration=${form.duration}`,
        { withCredentials: true }
      );

      setVirtualSlots(res.data || []);
      if (res.data.length === 0) {
        alert("No available times for selected duration.");
      }
    } catch (err) {
      console.error("Error fetching generated slots:", err);
      alert("Failed to load available times.");
    } finally {
      setLoadingSlots(false);
    }
  };

  // --- Submit booking ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.meetingType ||
      !form.duration ||
      !form.purpose ||
      !form.date ||
      !form.timeStart
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      date: form.date,
      startTime: form.timeStart,
      duration: form.duration,
      title: form.purpose,
      description: `${form.meetingType} — ${form.agenda || "No agenda"}`,
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
    };

    try {
      setSubmitting(true);
<<<<<<< HEAD
=======
<<<<<<< HEAD
      const res = await axios.post("http://localhost:5000/api/appointments", payload, {
        withCredentials: true,
      });
>>>>>>> merge/adminedits

      const res = await axios.post(
        "http://localhost:5000/api/appointments",
        payload,
        { withCredentials: true }
      );

      alert("Appointment booked successfully!");
      onSubmit(res.data);
      onClose();
    } catch (err) {
<<<<<<< HEAD
      console.error("Booking error:", err.response || err);
      alert(err.response?.data?.message || "Failed to book appointment");
=======
      console.error("Booking error:", err.response?.data || err);
      const message = err.response?.data?.message || "Failed to book appointment.";
      alert(message);
=======

      const res = await axios.post(
        "http://localhost:5000/api/appointments",
        payload,
        { withCredentials: true }
      );

      alert("Appointment booked successfully!");
      onSubmit(res.data);
      onClose();
    } catch (err) {
      console.error("Booking error:", err.response || err);
      alert(err.response?.data?.message || "Failed to book appointment");
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mt-12 mb-12">
<<<<<<< HEAD
        {/* HEADER */}
=======
<<<<<<< HEAD
>>>>>>> merge/adminedits
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Book Appointment
            </h3>
            <p className="text-sm text-gray-500">
              Select a date, duration, and choose from available time slots.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[72vh] overflow-y-auto p-6 space-y-6"
        >
          {/* USER INFO */}
          <div>
            <label className="text-xs text-gray-600">Full Name *</label>
<<<<<<< HEAD
=======
            <input name="name" value={form.name} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required />
=======
        {/* HEADER */}
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Book Appointment
            </h3>
            <p className="text-sm text-gray-500">
              Select a date, duration, and choose from available time slots.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[72vh] overflow-y-auto p-6 space-y-6"
        >
          {/* USER INFO */}
          <div>
            <label className="text-xs text-gray-600">Full Name *</label>
>>>>>>> merge/adminedits
            <input
              name="name"
              value={form.name}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              required
            />
<<<<<<< HEAD
=======
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
          </div>

          <div>
            <label className="text-xs text-gray-600">Email *</label>
<<<<<<< HEAD
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              required
            />
=======
<<<<<<< HEAD
            <input type="email" name="email" value={form.email} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required />
>>>>>>> merge/adminedits
          </div>

          {/* SELECTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Meeting Type */}
            <div>
              <label className="text-xs text-gray-600">Meeting Type *</label>
<<<<<<< HEAD
=======
              <select name="meetingType" value={form.meetingType} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required>
=======
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>

          {/* SELECTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Meeting Type */}
            <div>
              <label className="text-xs text-gray-600">Meeting Type *</label>
>>>>>>> merge/adminedits
              <select
                name="meetingType"
                value={form.meetingType}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              >
<<<<<<< HEAD
=======
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
                <option value="">Select</option>
                <option value="Project Discussion">Project Discussion</option>
                <option value="Research Proposal">Research Proposal</option>
                <option value="Academic Query">Academic Query</option>
              </select>
            </div>

<<<<<<< HEAD
            {/* Duration */}
=======
<<<<<<< HEAD
>>>>>>> merge/adminedits
            <div>
              <label className="text-xs text-gray-600">Duration *</label>
              <select
                name="duration"
                value={form.duration}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs text-gray-600">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* FETCH BUTTON */}
          <button
            type="button"
            onClick={fetchVirtualSlots}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loadingSlots ? "Loading..." : "Check Available Times"}
          </button>

          {/* AVAILABLE TIMES */}
          {virtualSlots.length > 0 && (
            <div>
              <label className="text-xs text-gray-600">Select Time *</label>
              <select
                name="timeStart"
                value={form.timeStart}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                required
              >
                <option value="">Select available time</option>
                {virtualSlots.map((t, i) => (
                  <option key={i} value={t.start}>
                    {t.start} - {t.end}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PURPOSE */}
          <div>
            <label className="text-xs text-gray-600">Purpose *</label>
            <input
              name="purpose"
              value={form.purpose}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* AGENDA */}
          <div>
            <label className="text-xs text-gray-600">Agenda (optional)</label>
            <textarea
              name="agenda"
              value={form.agenda}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm min-h-[70px]"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between gap-3">
<<<<<<< HEAD
=======
            <button type="button" onClick={onClose} className="w-1/3 border rounded px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="w-2/3 rounded px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-400 to-teal-400">
=======
            {/* Duration */}
            <div>
              <label className="text-xs text-gray-600">Duration *</label>
              <select
                name="duration"
                value={form.duration}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs text-gray-600">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* FETCH BUTTON */}
          <button
            type="button"
            onClick={fetchVirtualSlots}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {loadingSlots ? "Loading..." : "Check Available Times"}
          </button>

          {/* AVAILABLE TIMES */}
          {virtualSlots.length > 0 && (
            <div>
              <label className="text-xs text-gray-600">Select Time *</label>
              <select
                name="timeStart"
                value={form.timeStart}
                onChange={change}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
                required
              >
                <option value="">Select available time</option>
                {virtualSlots.map((t, i) => (
                  <option key={i} value={t.start}>
                    {t.start} - {t.end}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* PURPOSE */}
          <div>
            <label className="text-xs text-gray-600">Purpose *</label>
            <input
              name="purpose"
              value={form.purpose}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* AGENDA */}
          <div>
            <label className="text-xs text-gray-600">Agenda (optional)</label>
            <textarea
              name="agenda"
              value={form.agenda}
              onChange={change}
              className="mt-1 w-full border rounded px-3 py-2 text-sm min-h-[70px]"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-between gap-3">
>>>>>>> merge/adminedits
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 border rounded px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 rounded px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-400 to-teal-400"
            >
<<<<<<< HEAD
=======
>>>>>>> adithya/adminedits
>>>>>>> merge/adminedits
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
