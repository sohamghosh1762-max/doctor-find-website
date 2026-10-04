import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import Pharmacy from "../models/Pharmacy.js";
import Medicine from "../models/Medicine.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import MedicalHistory from "../models/MedicalHistory.js";
import MedicalRecord from "../models/MedicalRecord.js";
import Notification from "../models/Notification.js";
import Settings from "../models/Settings.js";

dotenv.config();

const defaultSlots = [
  { day: "Monday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Tuesday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Wednesday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Thursday", startTime: "02:00 PM", endTime: "06:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Friday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Saturday", startTime: "10:00 AM", endTime: "02:00 PM", slotDuration: 30, maxPatients: 8 },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/doctorfind";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // 1. Seed Admin User
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    let admin = await User.findOne({ email: "admin@doctorfind.com" });
    if (!admin) {
      admin = await User.create({
        name: "DoctorFind Administrator",
        email: "admin@doctorfind.com",
        password: adminPassword,
        role: "admin",
        phone: "+91 98300 00000",
        patientId: "ADM-000001",
      });
      console.log("✓ Admin created: admin@doctorfind.com (Password: Admin@123)");
    }

    // 2. Seed Patient User (Rahul Verma)
    const patientPassword = await bcrypt.hash("Password@123", 10);
    let patient = await User.findOne({ email: "rahul@example.com" });
    if (!patient) {
      patient = await User.create({
        name: "Rahul Verma",
        email: "rahul@example.com",
        password: patientPassword,
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
          phone: "+91 98765 99999",
        },
        insurance: {
          provider: "Star Health Insurance",
          policyNumber: "SH-987214-X",
          coverage: "₹5,00,000",
          expiry: "2027-12-31",
        },
        medicalConditions: ["Mild Hypertension", "Seasonal Asthma"],
        allergies: ["Penicillin", "Dust Mites"],
        currentMedications: ["Amlodipine 5mg", "Montair LC"],
        preferredHospital: "Apollo Hospital Kolkata",
        preferredDoctor: "Dr. Ananya Sharma",
      });
      console.log("✓ Patient created: rahul@example.com (Password: Password@123)");
    }

    // 3. Seed Hospitals
    await Hospital.deleteMany({});
    const hospitals = await Hospital.insertMany([
      {
        name: "Zenith Super Specialist Hospital",
        address: "9/3, Feeder Road, Belgharia, Rathala, Kolkata, West Bengal 700056",
        city: "Belgharia, Kolkata",
        phone: "+91 33 2564 3000",
        specialization: "Super Speciality & Emergency Trauma",
        latitude: 22.6684,
        longitude: 88.3813,
        emergencyAvailable: true,
        rating: 4.8,
      },
      {
        name: "Apollo Hospital Kolkata",
        address: "58 Canal Circular Rd, Kadapara, Phool Bagan, Kolkata, West Bengal 700054",
        city: "Phool Bagan, Kolkata",
        phone: "+91 33 2320 3040",
        specialization: "Cardiology, Multi-Speciality 24x7",
        latitude: 22.5726,
        longitude: 88.3972,
        emergencyAvailable: true,
        rating: 4.9,
      },
      {
        name: "Fortis Hospital Anandapur",
        address: "730 Anandapur, E.M. Bypass, Kolkata, West Bengal 700107",
        city: "Anandapur, Kolkata",
        phone: "+91 33 6628 4444",
        specialization: "Neurosurgery & Critical Care",
        latitude: 22.5186,
        longitude: 88.3931,
        emergencyAvailable: true,
        rating: 4.7,
      },
      {
        name: "Charnock Hospital",
        address: "BMC Activity Centre, Major Arterial Road, New Town, Kolkata 700156",
        city: "New Town, Kolkata",
        phone: "+91 33 4050 0500",
        specialization: "Pulmonology & Emergency",
        latitude: 22.6248,
        longitude: 88.4372,
        emergencyAvailable: true,
        rating: 4.8,
      },
    ]);
    console.log("✓ Hospitals seeded.");

    // 4. Seed Pharmacies
    await Pharmacy.deleteMany({});
    const pharmacies = await Pharmacy.insertMany([
      {
        name: "Apollo Pharmacy",
        address: "Block BB, Sector 1, Salt Lake City, Kolkata, West Bengal 700064",
        city: "Salt Lake, Kolkata",
        phone: "+91 33 2321 1100",
        latitude: 22.5867,
        longitude: 88.4172,
        openingHours: "24 Hours Open",
        verified: true,
      },
      {
        name: "Frank Ross Pharmacy",
        address: "12 Feeder Road, Rathala, Belgharia, Kolkata 700056",
        city: "Belgharia, Kolkata",
        phone: "+91 33 2564 1212",
        latitude: 22.6690,
        longitude: 88.3820,
        openingHours: "8:00 AM - 11:00 PM",
        verified: true,
      },
    ]);
    console.log("✓ Pharmacies seeded.");

    // 5. Seed Medicines
    await Medicine.deleteMany({});
    await Medicine.insertMany([
      { name: "Amlodipine 5mg", brand: "Amlokind", category: "Cardiovascular", price: 45, stock: 120, pharmacyName: "Apollo Pharmacy", location: "Salt Lake" },
      { name: "Telmisartan 40mg", brand: "Telma", category: "Cardiovascular", price: 95, stock: 85, pharmacyName: "Apollo Pharmacy", location: "Salt Lake" },
      { name: "Montair LC", brand: "Cipla", category: "Respiratory", price: 180, stock: 60, pharmacyName: "Frank Ross", location: "Belgharia" },
      { name: "Paracetamol 650mg", brand: "Dolo 650", category: "Analgesic", price: 32, stock: 300, pharmacyName: "Frank Ross", location: "Belgharia" },
      { name: "Pan 40", brand: "Alkem", category: "Gastroenterology", price: 140, stock: 95, pharmacyName: "Apollo Pharmacy", location: "Salt Lake" },
    ]);
    console.log("✓ Medicines seeded.");

    // 6. Seed Doctors
    await Doctor.deleteMany({});
    const doctorPass = "Doctor@123";
    const doctorsData = [
      {
        name: "Dr. Ananya Sharma",
        email: "ananya.sharma@doctorfind.com",
        password: doctorPass,
        phone: "+91 98301 12345",
        specialization: "Cardiologist",
        qualification: "MBBS, MD (General Medicine), DM (Cardiology)",
        experience: 12,
        hospital: "Apollo Hospital Kolkata",
        fees: 800,
        location: "Phool Bagan, Kolkata",
        consultationMode: "Both",
        licenseNumber: "WBMC-68492",
        verified: true,
        rating: 4.9,
        totalReviews: 324,
        about: "Dr. Ananya Sharma is a senior consultant cardiologist with over 12 years of clinical expertise in preventive cardiology and heart care.",
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
        availabilitySlots: defaultSlots,
      },
      {
        name: "Dr. Vikram Sethi",
        email: "vikram.sethi@doctorfind.com",
        password: doctorPass,
        phone: "+91 98302 23456",
        specialization: "Neurologist",
        qualification: "MBBS, MD, DM (Neurology), Fellowship (Stroke Care)",
        experience: 15,
        hospital: "Zenith Super Specialist Hospital",
        fees: 1000,
        location: "Belgharia, Kolkata",
        consultationMode: "Both",
        licenseNumber: "WBMC-55910",
        verified: true,
        rating: 4.8,
        totalReviews: 280,
        about: "Dr. Vikram Sethi specializes in neuro-trauma, stroke rehabilitation, migraine, and complex movement disorders.",
        profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
        availabilitySlots: defaultSlots,
      },
      {
        name: "Dr. Priya Nair",
        email: "priya.nair@doctorfind.com",
        password: doctorPass,
        phone: "+91 98303 34567",
        specialization: "Pediatrician",
        qualification: "MBBS, MD (Pediatrics), DCH",
        experience: 8,
        hospital: "Fortis Hospital Anandapur",
        fees: 650,
        location: "Anandapur, Kolkata",
        consultationMode: "Both",
        licenseNumber: "WBMC-74102",
        verified: true,
        rating: 4.9,
        totalReviews: 195,
        about: "Dr. Priya Nair provides compassionate pediatric care, immunization, and childhood growth assessments.",
        profileImage: "https://images.unsplash.com/photo-1594824813566-88855ce78c80?q=80&w=400&auto=format&fit=crop",
        availabilitySlots: defaultSlots,
      },
    ];

    const seededDoctors = [];
    for (const doc of doctorsData) {
      const created = await Doctor.create(doc);
      seededDoctors.push(created);
    }
    console.log("✓ Doctors seeded: (Login with email & Password: Doctor@123)");

    // 7. Seed Appointments for Patient
    await Appointment.deleteMany({ patient: patient._id });
    await Appointment.insertMany([
      {
        patient: patient._id,
        doctor: seededDoctors[0]._id,
        doctorName: "Dr. Ananya Sharma",
        doctorImage: seededDoctors[0].profileImage,
        specialization: "Cardiologist",
        hospital: "Apollo Hospital Kolkata",
        appointmentDate: "2026-08-01",
        appointmentTime: "10:30 AM",
        mode: "Online",
        status: "Confirmed",
        symptoms: "Quarterly Cardiovascular Checkup & ECG evaluation",
        videoCallUrl: `https://meet.jit.si/DoctorFindAI-${seededDoctors[0]._id}`,
        consultationFee: 800,
      },
      {
        patient: patient._id,
        doctor: seededDoctors[1]._id,
        doctorName: "Dr. Vikram Sethi",
        doctorImage: seededDoctors[1].profileImage,
        specialization: "Neurologist",
        hospital: "Zenith Super Specialist Hospital",
        appointmentDate: "2026-08-06",
        appointmentTime: "02:30 PM",
        mode: "Offline",
        status: "Confirmed",
        symptoms: "Periodic migraine assessment",
        videoCallUrl: "",
        consultationFee: 1000,
      },
    ]);
    console.log("✓ Appointments seeded.");

    // 8. Seed Prescriptions
    await Prescription.deleteMany({ patient: patient._id });
    await Prescription.insertMany([
      {
        patient: patient._id,
        doctor: seededDoctors[0]._id,
        prescribingDoctor: "Dr. Ananya Sharma",
        doctorSpecialty: "Cardiologist",
        hospital: "Apollo Hospital Kolkata",
        date: "2026-07-15",
        status: "Current",
        medicines: [
          { name: "Amlodipine 5mg", dosage: "5mg", frequency: "1-0-0", duration: "30 Days", instructions: "Take every morning before breakfast" },
          { name: "Telmisartan 40mg", dosage: "40mg", frequency: "0-0-1", duration: "30 Days", instructions: "Take after dinner with water" },
        ],
        notes: "Keep daily blood pressure log. Reduce salt intake.",
      },
    ]);
    console.log("✓ Prescriptions seeded.");

    // 9. Seed Medical History & Records
    await MedicalHistory.deleteMany({ patient: patient._id });
    await MedicalHistory.create({
      patient: patient._id,
      bloodGroup: "O+",
      allergies: ["Penicillin", "Dust Mites"],
      chronicDiseases: ["Mild Hypertension"],
      currentMedications: ["Amlodipine 5mg", "Montair LC"],
      timeline: [
        {
          year: 2026,
          date: "15 July 2026",
          title: "Cardiovascular Checkup & Hypertension Management",
          type: "Checkup",
          diagnosis: "Mild Essential Hypertension",
          doctor: "Dr. Ananya Sharma",
          hospital: "Apollo Hospital Kolkata",
          treatment: "Dietary sodium restriction & daily Amlodipine 5mg",
          reports: ["Comprehensive Blood Panel"],
          prescriptions: ["Amlodipine 5mg", "Telmisartan 40mg"],
        },
      ],
    });

    await MedicalRecord.deleteMany({ patientId: patient._id });
    await MedicalRecord.create({
      patientId: patient._id,
      title: "Comprehensive Lipid & Metabolic Panel",
      category: "Blood Test",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileType: "PDF",
      doctorName: "Dr. Ananya Sharma",
      hospitalName: "Apollo Hospital Kolkata",
      notes: "Lipid profile within target limits. HDL optimal.",
      tags: ["Blood Test", "Lipid", "Cardiology"],
    });
    console.log("✓ Medical history and records seeded.");

    // 10. Seed Settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({
        siteName: "DoctorFind AI",
        supportEmail: "support@doctorfind.com",
        contactNumber: "+91 33 2564 3000",
        emergencyHotline: "112",
        maintenanceMode: false,
      });
    }

    console.log("\n==========================================");
    console.log(" DoctorFind AI Database Seeded Successfully!");
    console.log("==========================================");
    console.log("Admin:   admin@doctorfind.com   / Admin@123");
    console.log("Patient: rahul@example.com      / Password@123");
    console.log("Doctor:  ananya.sharma@doctorfind.com / Doctor@123");
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
