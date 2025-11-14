import React from "react";

export default function AdminViewAppointmentModal({ appointment, onClose }) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl mt-12 mb-12">

        {/* HEADER */}
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
            <p className="text-sm text-gray-500">View complete appointment information.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">✕</button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          <div>
            <label className="text-xs text-gray-600">Full Name</label>
            <p className="mt-1 text-sm font-medium">{appointment.name}</p>
          </div>

          <div>
            <label className="text-xs text-gray-600">Email</label>
            <p className="mt-1 text-sm">{appointment.email}</p>
          </div>

          <div>
            <label className="text-xs text-gray-600">User Type</label>
            <p className="mt-1 text-sm">{appointment.role}</p>
          </div>

          <div>
            <label className="text-xs text-gray-600">Topic / Purpose</label>
            <p className="mt-1 text-sm">{appointment.topic}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600">Requested Date & Time</label>
              <p className="mt-1 text-sm">{appointment.requested}</p>
            </div>

            <div>
              <label className="text-xs text-gray-600">Submitted</label>
              <p className="mt-1 text-sm">{appointment.submitted}</p>
            </div>
          </div>

          {/* Agenda File (frontend-only → no file support) */}
          <div>
            <label className="text-xs text-gray-600">Agenda Document</label>
            <p className="mt-1 text-sm text-gray-400">Not available</p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
