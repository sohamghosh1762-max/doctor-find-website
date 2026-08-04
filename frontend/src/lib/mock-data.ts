import doc1 from "@/assets/doc-1.jpg";
import doc2 from "@/assets/doc-2.jpg";
import doc3 from "@/assets/doc-3.jpg";
import doc4 from "@/assets/doc-4.jpg";

export const doctors = [
  { id: "1", name: "Dr. Arjun Mehta", specialty: "Cardiologist", img: doc1, exp: "8+ Years", rating: 4.9, reviews: 320, fee: 800, availability: "Available Today" },
  { id: "2", name: "Dr. Priya Sharma", specialty: "Gynecologist", img: doc2, exp: "10+ Years", rating: 4.8, reviews: 421, fee: 700, availability: "Available Tomorrow" },
  { id: "3", name: "Dr. Rohan Verma", specialty: "Dermatologist", img: doc3, exp: "6+ Years", rating: 4.7, reviews: 210, fee: 600, availability: "Available Today" },
  { id: "4", name: "Dr. Neha Kapoor", specialty: "Pediatrician", img: doc4, exp: "7+ Years", rating: 4.9, reviews: 300, fee: 650, availability: "Available Today" },
];

export const features = [
  { icon: "Brain", title: "AI Symptom Checker", desc: "Analyze your symptoms and get AI-powered health insights in seconds." },
  { icon: "ShieldCheck", title: "Verified Doctors", desc: "Book appointments with experienced and verified medical professionals." },
  { icon: "CalendarClock", title: "Instant Appointments", desc: "Schedule appointments in seconds — skip the wait, save time." },
  { icon: "FileText", title: "Smart Prescriptions", desc: "Digital prescriptions, secure storage, accessible always." },
  { icon: "MapPin", title: "Nearby Pharmacies", desc: "Locate nearby pharmacies and get medicines delivered fast." },
  { icon: "Siren", title: "Emergency Locator", desc: "Find the best hospitals near you in an emergency — instantly." },
];

export const places = [
  { name: "City Care Hospital", type: "hospital", lat: 19.076, lng: 72.8777, dist: "0.6 km" },
  { name: "Apex Medical Center", type: "hospital", lat: 19.082, lng: 72.872, dist: "1.2 km" },
  { name: "Sunrise Hospital", type: "hospital", lat: 19.07, lng: 72.885, dist: "1.8 km" },
  { name: "MediPlus Pharmacy", type: "pharmacy", lat: 19.078, lng: 72.881, dist: "0.4 km" },
  { name: "Apollo Pharmacy", type: "pharmacy", lat: 19.073, lng: 72.874, dist: "0.9 km" },
  { name: "Wellness Drugs", type: "pharmacy", lat: 19.085, lng: 72.879, dist: "1.5 km" },
];