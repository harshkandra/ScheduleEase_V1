// client/src/components/BookAppointmentModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 Props:
  - slot: (optional) preselected slot object { _id, date, timeStart, timeEnd, isBooked }
  - role: (optional) UI label — backend uses req.user.role/_name, not this prop
  - defaultDate, defaultTime (optional)
  - onClose()
  - onSubmit(appointment) -> called with backend response
*/
export default function BookAppointmentModal({
  slot: preselectedSlot = null,
  role = "student",
  defaultDate = "",
  defaultTime = "",
  onClose = () => {},
  onSubmit = () => {},
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    meetingType: "",
    duration: "",
    purpose: "",
    agenda: "",
    docs: "",
    date: defaultDate || (preselectedSlot ? preselectedSlot.date : ""),
    time: defaultTime || (preselectedSlot ? preselectedSlot.timeStart : ""),
  });

  const [availableSlots, setAvailableSlots] = useState([]); // array of slot objects from DB
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const change = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.meetingType || !form.duration || !form.purpose || !form.date || !form.time) {
      alert("Please fill all required fields");
      return;
    }

    // Find the matching slot object
    const selectedSlot = availableSlots.find((s) => s.timeStart === form.time && s.date === form.date);
    if (!selectedSlot) {
      alert("Please select a valid available slot from the dropdown.");
      return;
    }

    // Build payload that backend expects
    const payload = {
      slotId: selectedSlot._id,
      title: form.purpose,
      description: `${form.meetingType} — ${form.agenda || "No agenda"}`,
      // Do NOT send role_name unless you explicitly want to override backend auth;
      // backend prefers req.user.role / req.user.role_name
    };

    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:5000/api/appointments", payload, {
        withCredentials: true,
      });

      // success
      const created = res.data;
      onSubmit(created);
      onClose();
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
      const message = err.response?.data?.message || "Failed to book appointment.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mt-12 mb-12">
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Book Appointment</h3>
            <p className="text-sm text-gray-500">Select a date and choose an available time slot.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[72vh] overflow-y-auto p-6 space-y-6">
          <div>
            <label className="text-xs text-gray-600">Full Name *</label>
            <input name="name" value={form.name} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required />
          </div>

          <div>
            <label className="text-xs text-gray-600">Email *</label>
            <input type="email" name="email" value={form.email} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600">Meeting Type *</label>
              <select name="meetingType" value={form.meetingType} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required>
                <option value="">Select</option>
                <option value="Project Discussion">Project Discussion</option>
                <option value="Research Proposal">Research Proposal</option>
                <option value="Academic Query">Academic Query</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600">Duration (minutes) *</label>
              <select name="duration" value={form.duration} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required>
                <option value="">Select</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
                <option value="60">60</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600">Date *</label>
              <input type="date" name="date" value={form.date} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600">Available Time *</label>
            <select name="time" value={form.time} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required disabled={loadingSlots}>
              <option value="">{loadingSlots ? "Loading slots..." : "Select a time slot"}</option>
              {availableSlots.map((s) => (
                <option key={s._id} value={s.timeStart}>
                  {s.timeStart} - {s.timeEnd}
                </option>
              ))}
            </select>
            {!loadingSlots && form.date && availableSlots.length === 0 && (
              <p className="text-xs text-red-500 mt-1">No available slots for this date.</p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-600">Purpose *</label>
            <input name="purpose" value={form.purpose} onChange={change} className="mt-1 w-full border rounded px-3 py-2 text-sm" required />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={onClose} className="w-1/3 border rounded px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="w-2/3 rounded px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-400 to-teal-400">
              {submitting ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
