import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token (Patient token, Admin token, or Doctor token)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") || localStorage.getItem("doctorToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

// ==========================
// Auth APIs
// ==========================
export const loginApi = async (credentials: { email: string; password: string }) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const registerApi = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const fetchProfileApi = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// ==========================
// Patient Dashboard & Profile
// ==========================
export const fetchPatientDashboard = async () => {
  const res = await api.get("/patient/dashboard");
  return res.data;
};

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

export const fetchGlobalSearch = async (query: string) => {
  const res = await api.get(`/patient/search?query=${encodeURIComponent(query)}`);
  return res.data;
};

// ==========================
// Doctor APIs
// ==========================
export const fetchDoctors = async (params?: { specialization?: string; location?: string; name?: string }) => {
  const res = await api.get("/doctors", { params });
  return res.data;
};

export const fetchDoctorById = async (id: string) => {
  const res = await api.get(`/doctors/${id}`);
  return res.data;
};

export const searchDoctorsApi = async (query: { specialization?: string; location?: string; name?: string }) => {
  const res = await api.get("/doctors/search", { params: query });
  return res.data;
};

export const doctorLoginApi = async (credentials: { email: string; password: string }) => {
  const res = await api.post("/doctors/login", credentials);
  return res.data;
};

export const changeDoctorPasswordApi = async (id: string, data: { password: string }) => {
  const res = await api.put(`/doctors/change-password/${id}`, data);
  return res.data;
};

export const addDoctorApi = async (data: any) => {
  const res = await api.post("/doctors", data);
  return res.data;
};

export const verifyDoctorApi = async (id: string) => {
  const res = await api.put(`/doctors/verify/${id}`);
  return res.data;
};

export const updateDoctorApi = async (id: string, data: any) => {
  const res = await api.put(`/doctors/${id}`, data);
  return res.data;
};

export const deleteDoctorApi = async (id: string) => {
  const res = await api.delete(`/doctors/${id}`);
  return res.data;
};

export const fetchDoctorSlots = async (id: string) => {
  const res = await api.get(`/doctors/${id}/slots`);
  return res.data;
};

export const updateDoctorSlots = async (id: string, data: any) => {
  const res = await api.put(`/doctors/${id}/slots`, data);
  return res.data;
};

// ==========================
// Appointments APIs
// ==========================
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

export const createAppointment = bookAppointment;

export const rescheduleAppointment = async (id: string, data: { appointmentDate: string; appointmentTime: string }) => {
  const res = await api.patch(`/appointments/${id}/reschedule`, data);
  return res.data;
};

export const cancelAppointment = async (id: string) => {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
};

export const updateAppointmentStatusApi = async (id: string, status: string) => {
  const res = await api.patch(`/appointments/${id}/status`, { status });
  return res.data;
};

export const fetchDoctorAppointmentsApi = async (doctorId?: string) => {
  const url = doctorId ? `/appointments/doctor/${doctorId}` : "/appointments/doctor";
  const res = await api.get(url);
  return res.data;
};

export const fetchAllAppointmentsApi = async () => {
  const res = await api.get("/appointments/admin/all");
  return res.data;
};

// ==========================
// Prescriptions APIs
// ==========================
export const fetchMyPrescriptions = async (params?: { status?: string; search?: string }) => {
  const res = await api.get("/prescriptions", { params });
  return res.data;
};

export const fetchPrescriptionById = async (id: string) => {
  const res = await api.get(`/prescriptions/${id}`);
  return res.data;
};

export const createPrescriptionApi = async (data: any) => {
  const res = await api.post("/prescriptions", data);
  return res.data;
};

export const requestPrescriptionRefill = async (id: string) => {
  const res = await api.post(`/prescriptions/${id}/refill`);
  return res.data;
};

// ==========================
// Medical Records APIs
// ==========================
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

// ==========================
// Medical History APIs
// ==========================
export const fetchMedicalHistory = async () => {
  const res = await api.get("/medical-history");
  return res.data;
};

export const addMedicalHistoryEntry = async (data: any) => {
  const res = await api.post("/medical-history/timeline", data);
  return res.data;
};

export const updateMedicalHistoryApi = async (data: any) => {
  const res = await api.put("/medical-history", data);
  return res.data;
};

// ==========================
// AI Symptom Assessment APIs
// ==========================
export const analyzeSymptomsApi = async (symptoms: string) => {
  const res = await api.post("/ai/symptom-analysis", { symptoms });
  return res.data;
};

export const fetchSymptomHistory = async () => {
  const res = await api.get("/ai/history");
  return res.data;
};

// ==========================
// Nearby Services & Maps APIs
// ==========================
export const fetchNearbyServices = async (category: string = "all", lat?: number, lng?: number) => {
  let url = `/nearby?category=${encodeURIComponent(category)}`;
  if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
    url += `&lat=${lat}&lng=${lng}`;
  }
  const res = await api.get(url);
  return res.data;
};

export const fetchNearbyLocations = async (lat?: number, lng?: number) => {
  let url = "/location/nearby";
  if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
    url += `?lat=${lat}&lng=${lng}`;
  }
  const res = await api.get(url);
  return res;
};

export const fetchGooglePlacesNearby = async (lat: number, lng: number) => {
  const res = await api.get(`/google-places/nearby?lat=${lat}&lng=${lng}`);
  return res.data;
};

// ==========================
// Hospitals APIs
// ==========================
export const fetchHospitals = async () => {
  const res = await api.get("/hospitals");
  return res.data;
};

export const addHospitalApi = async (data: any) => {
  const res = await api.post("/hospitals", data);
  return res.data;
};

export const updateHospitalApi = async (id: string, data: any) => {
  const res = await api.put(`/hospitals/${id}`, data);
  return res.data;
};

export const deleteHospitalApi = async (id: string) => {
  const res = await api.delete(`/hospitals/${id}`);
  return res.data;
};

// ==========================
// Pharmacies & Medicines APIs
// ==========================
export const fetchPharmacies = async () => {
  const res = await api.get("/pharmacies");
  return res.data;
};

export const addPharmacyApi = async (data: any) => {
  const res = await api.post("/pharmacies", data);
  return res.data;
};

export const deletePharmacyApi = async (id: string) => {
  const res = await api.delete(`/pharmacies/${id}`);
  return res.data;
};

export const fetchMedicines = async (search?: string) => {
  const url = search ? `/medicines/search?name=${encodeURIComponent(search)}` : "/medicines";
  const res = await api.get(url);
  return res.data;
};

export const addMedicineApi = async (data: any) => {
  const res = await api.post("/medicines", data);
  return res.data;
};

export const deleteMedicineApi = async (id: string) => {
  const res = await api.delete(`/medicines/${id}`);
  return res.data;
};

// ==========================
// Notifications APIs
// ==========================
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

// ==========================
// Reviews APIs
// ==========================
export const fetchDoctorReviews = async (doctorId: string) => {
  const res = await api.get(`/reviews/doctor/${doctorId}`);
  return res.data;
};

export const fetchAllReviews = async () => {
  const res = await api.get("/reviews");
  return res.data;
};

export const addReviewApi = async (data: { doctor: string; rating: number; comment: string }) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const deleteReviewApi = async (id: string) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

// ==========================
// Admin Dashboard & Management APIs
// ==========================
export const fetchAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const fetchMonthlyAppointments = async () => {
  const res = await api.get("/admin/monthly-appointments");
  return res.data;
};

export const fetchAdminUsers = async () => {
  const res = await api.get("/auth/users");
  return res.data;
};

export const fetchAuditLogsApi = async () => {
  const res = await api.get("/admin/audit-logs");
  return res.data;
};

export const fetchSettingsApi = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettingsApi = async (data: any) => {
  const res = await api.put("/settings", data);
  return res.data;
};
