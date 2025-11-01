export interface User { _id: string; email: string; userType: string; }
export interface Appointment { _id: string; description: string; user: User; createdAt: string; }
