import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

// Patient Dashboard API
export const fetchPatientDashboard = async () => {
  const res = await api.get("/patient/dashboard");
  return res.data;
};

// Patient Profile APIs
export const fetchPatientProfile = async () => {
  const res = await api.get("/patient/profile");
  return res.data;
};

export const updatePatientProfile = async (data: any) => {
  const res = await api.put("/patient/profile", data);
  return res.data;
};

export const changePassword = async (data: any) => {
  const res = await api.post("/patient/change-password", data);
  return res.data;
};

// Global Search API
export const fetchGlobalSearch = async (query: string) => {
  const res = await api.get(`/patient/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

// Appointments APIs
export const fetchMyAppointments = async (params?: { status?: string; mode?: string; search?: string }) => {
  const res = await api.get("/appointments", { params });
  return res.data;
};

export const fetchAppointmentById = async (id: string) => {
  const res = await api.get(`/appointments/${id}`);
  return res.data;
};

export const bookAppointment = async (data: any) => {
  const res = await api.post("/appointments", data);
  return res.data;
};

export const rescheduleAppointment = async (id: string, data: { appointmentDate: string; appointmentTime: string }) => {
  const res = await api.patch(`/appointments/${id}/reschedule`, data);
  return res.data;
};

export const cancelAppointment = async (id: string) => {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
};

// Prescriptions APIs
export const fetchMyPrescriptions = async (params?: { status?: string; search?: string }) => {
  const res = await api.get("/prescriptions", { params });
  return res.data;
};

export const requestPrescriptionRefill = async (id: string) => {
  const res = await api.post(`/prescriptions/${id}/refill`);
  return res.data;
};

// Medical Records APIs
export const fetchMedicalRecords = async (params?: { category?: string; search?: string }) => {
  const res = await api.get("/medical-records", { params });
  return res.data;
};

export const uploadMedicalRecord = async (data: any) => {
  const res = await api.post("/medical-records", data);
  return res.data;
};

export const deleteMedicalRecord = async (id: string) => {
  const res = await api.delete(`/medical-records/${id}`);
  return res.data;
};

// Medical History API
export const fetchMedicalHistory = async () => {
  const res = await api.get("/medical-history");
  return res.data;
};

export const addMedicalHistoryEntry = async (data: any) => {
  const res = await api.post("/medical-history/timeline", data);
  return res.data;
};

// AI Symptom Analysis APIs
export const analyzeSymptomsApi = async (symptoms: string) => {
  const res = await api.post("/ai/symptom-analysis", { symptoms });
  return res.data;
};

export const fetchSymptomHistory = async () => {
  const res = await api.get("/ai/history");
  return res.data;
};

// Nearby Services API
export const fetchNearbyServices = async (category: string = "all", lat?: number, lng?: number) => {
  let url = `/nearby?category=${encodeURIComponent(category)}`;
  if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
    url += `&lat=${lat}&lng=${lng}`;
  }
  const res = await api.get(url);
  return res.data;
};

// Notifications APIs
export const fetchNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id: string) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};
