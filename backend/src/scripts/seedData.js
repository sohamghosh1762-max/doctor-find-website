import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import Pharmacy from "../models/Pharmacy.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import MedicalHistory from "../models/MedicalHistory.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Notification from "../models/Notification.js";
import SymptomAnalysis from "../models/SymptomAnalysis.js";

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/doctorfind";
    await mongoose.connect(mongoUri);
    console.log("Connected to database for seeding...");

    // Seed Patient User Rahul Verma
    let patient = await User.findOne({ email: "rahul@example.com" });
    const hashedPassword = await bcrypt.hash("password123", 10);

    if (!patient) {
      patient = await User.create({
        name: "Rahul Verma",
        email: "rahul@example.com",
        password: hashedPassword,
        role: "patient",
        phone: "+91 98765 43210",
        patientId: "PAT-849201",
        gender: "Male",
        dateOfBirth: "1995-08-15",
        bloodGroup: "O+",
        address: "72/A Park Street, Flat 4B, Kolkata, West Bengal 700016",
        city: "Kolkata",
        state: "West Bengal",
        pincode: "700016",
        height: 175,
        weight: 70,
        emergencyContact: {
          name: "Sunita Verma",
          relationship: "Mother",
          phone: "+91 98765 99999"
        },
        insurance: {
          provider: "Star Health Insurance",
          policyNumber: "SH-987214-X",
          coverage: "₹5,00,000",
          expiry: "2027-12-31"
        },
        medicalConditions: ["Mild Hypertension", "Seasonal Asthma"],
        allergies: ["Penicillin", "Dust Mites"],
        currentMedications: ["Amlodipine 5mg", "Montair LC"],
        preferredHospital: "Apollo Gleneagles Hospital",
        preferredDoctor: "Dr. Ananya Sharma"
      });
      console.log("Patient Rahul Verma created.");
    }

    // Seed Hospitals
    await Hospital.deleteMany({});
    await Hospital.insertMany([
      {
        name: "Zenith Super Specialist Hospital",
        address: "9/3, Feeder Road, Belgharia, Rathala, Kolkata, West Bengal 700056",
        phone: "+91 33 2564 3000",
        specialization: "Super Speciality & Emergency Trauma",
        latitude: 22.6684,
        longitude: 88.3813,
        emergencyAvailable: true
      },
      {
        name: "Apollo Hospital Kolkata",
        address: "58 Canal Circular Rd, Kadapara, Phool Bagan, Kolkata, West Bengal 700054",
        phone: "+91 33 2320 3040",
        specialization: "Cardiology, Multi-Speciality 24x7",
        latitude: 22.5726,
        longitude: 88.3972,
        emergencyAvailable: true
      },
      {
        name: "Fortis Hospital Anandapur",
        address: "730 Anandapur, E.M. Bypass, Kolkata, West Bengal 700107",
        phone: "+91 33 6628 4444",
        specialization: "Neurosurgery & Critical Care",
        latitude: 22.5186,
        longitude: 88.3931,
        emergencyAvailable: true
      },
      {
        name: "Charnock Hospital",
        address: "BMC Activity Centre, Major Arterial Road, New Town, Kolkata 700156",
        phone: "+91 33 4050 0500",
        specialization: "Pulmonology & Emergency",
        latitude: 22.6248,
        longitude: 88.4372,
        emergencyAvailable: true
      }
    ]);
    console.log("Hospitals seeded.");

    // Seed Pharmacies
    await Pharmacy.deleteMany({});
    await Pharmacy.insertMany([
      {
        name: "Apollo Pharmacy",
        address: "Block BB, Sector 1, Salt Lake City, Kolkata, West Bengal 700064",
        phone: "+91 33 2321 1100",
        latitude: 22.5867,
        longitude: 88.4172,
        openingHours: "24 Hours Open",
        verified: true
      },
      {
        name: "Frank Ross Pharmacy",
        address: "12 Feeder Road, Rathala, Belgharia, Kolkata 700056",
        phone: "+91 33 2564 1212",
        latitude: 22.6690,
        longitude: 88.3820,
        openingHours: "8:00 AM - 11:00 PM",
        verified: true
      }
    ]);
    console.log("Pharmacies seeded.");

    // Seed Doctors
    const doctorsData = [
      {
        name: "Dr. Ananya Sharma",
        email: "ananya.sharma@doctorfind.com",
        phone: "+91 98300 11223",
        specialization: "Cardiologist",
        qualification: "MBBS, MD (Cardiology), FACC",
        experience: 12,
        fees: 800,
        hospital: "Apollo Hospital Kolkata",
        location: "Kolkata, West Bengal",
        licenseNumber: "WBMC-68492",
        rating: 4.9,
        totalReviews: 240,
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
        verified: true
      },
      {
        name: "Dr. Vikram Sethi",
        email: "vikram.sethi@doctorfind.com",
        phone: "+91 98300 22334",
        specialization: "Neurologist",
        qualification: "MBBS, DM (Neurology)",
        experience: 15,
        fees: 1000,
        hospital: "Fortis Hospital Anandapur",
        location: "Kolkata, West Bengal",
        licenseNumber: "WBMC-55910",
        rating: 4.8,
        totalReviews: 180,
        profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
        verified: true
      },
      {
        name: "Dr. Priya Nair",
        email: "priya.nair@doctorfind.com",
        phone: "+91 98300 33445",
        specialization: "Dermatologist",
        qualification: "MBBS, MD (Dermatology)",
        experience: 9,
        fees: 700,
        hospital: "Zenith Super Specialist Hospital",
        location: "Kolkata, West Bengal",
        licenseNumber: "WBMC-74102",
        rating: 4.7,
        totalReviews: 145,
        profileImage: "https://images.unsplash.com/photo-1594824813566-88855ce78906?q=80&w=300&auto=format&fit=crop",
        verified: true
      }
    ];

    let doctorDocs = [];
    for (const doc of doctorsData) {
      let existingDoc = await Doctor.findOne({ email: doc.email });
      if (!existingDoc) {
        existingDoc = await Doctor.create(doc);
      }
      doctorDocs.push(existingDoc);
    }
    console.log("Doctors seeded.");

    // Seed Appointments
    await Appointment.deleteMany({ patient: patient._id });
    await Appointment.insertMany([
      {
        patient: patient._id,
        doctor: doctorDocs[0]._id,
        doctorName: "Dr. Ananya Sharma",
        doctorImage: doctorDocs[0].profileImage,
        specialization: "Cardiologist",
        hospital: "Apollo Hospital Kolkata",
        appointmentDate: "2026-07-28",
        appointmentTime: "10:30 AM",
        mode: "Online",
        status: "Confirmed",
        symptoms: "Quarterly Cardiovascular Evaluation & ECG review",
        videoCallUrl: "https://meet.jit.si/DoctorFindAI-Call-849",
        consultationFee: 800
      },
      {
        patient: patient._id,
        doctor: doctorDocs[1]._id,
        doctorName: "Dr. Vikram Sethi",
        doctorImage: doctorDocs[1].profileImage,
        specialization: "Neurologist",
        hospital: "Fortis Hospital Anandapur",
        appointmentDate: "2026-08-04",
        appointmentTime: "02:00 PM",
        mode: "Offline",
        status: "Pending",
        symptoms: "Mild migraine headaches during stress",
        videoCallUrl: "",
        consultationFee: 1000
      }
    ]);
    console.log("Appointments seeded.");

    // Seed Prescriptions
    await Prescription.deleteMany({ patient: patient._id });
    await Prescription.insertMany([
      {
        patient: patient._id,
        prescribingDoctor: "Dr. Ananya Sharma",
        doctorSpecialty: "Cardiologist",
        hospital: "Apollo Hospital Kolkata",
        date: "2026-07-15",
        status: "Current",
        medicines: [
          { name: "Amlodipine 5mg", dosage: "5mg", frequency: "1-0-0", duration: "30 Days", instructions: "Take every morning before breakfast" },
          { name: "Telmisartan 40mg", dosage: "40mg", frequency: "0-0-1", duration: "30 Days", instructions: "Take after dinner with water" }
        ],
        notes: "Keep daily blood pressure log. Reduce salt consumption."
      }
    ]);
    console.log("Prescriptions seeded.");

    console.log("\nDatabase successfully seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
