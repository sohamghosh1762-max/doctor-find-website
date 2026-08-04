import Doctor from "../models/Doctor.js";
import Activity from "../models/Activity.js";
import bcrypt from "bcryptjs";
import generateDoctorToken from "../utils/generateDoctorToken.js";

// Add Doctor
export const addDoctor = async (req, res) => {
  try {

    const doctorData = {
      ...req.body,
      password: "123456"
    };

    const doctor = await Doctor.create(
      doctorData
    );

    console.log(
      "Saved Password:",
      doctor.password
    );

    await Activity.create({
      title: `New doctor ${doctor.name} registered`,
      type: "doctor",
    });

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      doctor,
    });

  } catch (error) {

    console.log("ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const defaultSlots = [
  { day: "Monday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Tuesday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Wednesday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Thursday", startTime: "02:00 PM", endTime: "06:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Friday", startTime: "09:00 AM", endTime: "01:00 PM", slotDuration: 30, maxPatients: 10 },
  { day: "Saturday", startTime: "10:00 AM", endTime: "02:00 PM", slotDuration: 30, maxPatients: 8 }
];

const defaultDoctorsList = [
  {
    _id: "doc-1",
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@doctorfind.com",
    phone: "+91 98301 12345",
    specialization: "Cardiologist",
    qualification: "MBBS, MD (General Medicine), DM (Cardiology)",
    experience: 12,
    hospital: "Apollo Gleneagles Hospital, Kolkata",
    fees: 800,
    location: "Phool Bagan, Kolkata",
    consultationMode: "Both",
    verified: true,
    rating: 4.9,
    totalReviews: 324,
    about: "Dr. Ananya Sharma is a senior consultant cardiologist with over 12 years of clinical expertise in preventive cardiology, coronary interventions, and heart failure management.",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
    availabilitySlots: defaultSlots
  },
  {
    _id: "doc-2",
    name: "Dr. Vikram Sethi",
    email: "vikram.sethi@doctorfind.com",
    phone: "+91 98302 23456",
    specialization: "Neurologist",
    qualification: "MBBS, MD, DM (Neurology), Fellowship (Stroke Care)",
    experience: 15,
    hospital: "Zenith Super Specialist Hospital",
    fees: 1000,
    location: "Belgharia Rathala, Kolkata",
    consultationMode: "Both",
    verified: true,
    rating: 4.8,
    totalReviews: 280,
    about: "Dr. Vikram Sethi specializes in neuro-trauma, stroke rehabilitation, epilepsy treatment, and complex movement disorders.",
    profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    availabilitySlots: defaultSlots
  },
  {
    _id: "doc-3",
    name: "Dr. Priya Nair",
    email: "priya.nair@doctorfind.com",
    phone: "+91 98303 34567",
    specialization: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics), DCH",
    experience: 8,
    hospital: "Fortis Healthcare Anandapur",
    fees: 650,
    location: "Anandapur, Kolkata",
    consultationMode: "Both",
    verified: true,
    rating: 4.9,
    totalReviews: 195,
    about: "Dr. Priya Nair provides compassionate pediatric care, newborn screening, vaccinations, and childhood growth assessment.",
    profileImage: "https://images.unsplash.com/photo-1594824813566-88855ce78c80?q=80&w=400&auto=format&fit=crop",
    availabilitySlots: defaultSlots
  },
  {
    _id: "doc-4",
    name: "Dr. Rajesh Varma",
    email: "rajesh.varma@doctorfind.com",
    phone: "+91 98304 45678",
    specialization: "Orthopedic",
    qualification: "MBBS, MS (Orthopedics), M.Ch (Orth)",
    experience: 14,
    hospital: "Charnock Hospital, New Town",
    fees: 900,
    location: "New Town, Kolkata",
    consultationMode: "Both",
    verified: true,
    rating: 4.7,
    totalReviews: 210,
    about: "Dr. Rajesh Varma is a renowned joint replacement surgeon and sports injury specialist.",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
    availabilitySlots: defaultSlots
  },
  {
    _id: "doc-5",
    name: "Dr. Sunita Rao",
    email: "sunita.rao@doctorfind.com",
    phone: "+91 98305 56789",
    specialization: "Gynecologist",
    qualification: "MBBS, MS (Obstetrics & Gynaecology)",
    experience: 11,
    hospital: "Apollo Hospital Kolkata",
    fees: 750,
    location: "Salt Lake, Kolkata",
    consultationMode: "Both",
    verified: true,
    rating: 4.9,
    totalReviews: 410,
    about: "Dr. Sunita Rao specializes in high-risk pregnancies, laparoscopic gynecological surgery, and reproductive health.",
    profileImage: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=400&auto=format&fit=crop",
    availabilitySlots: defaultSlots
  },
  {
    _id: "doc-6",
    name: "Dr. Aris Thorne",
    email: "aris.thorne@doctorfind.com",
    phone: "+91 98306 67890",
    specialization: "Dermatologist",
    qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    experience: 9,
    hospital: "Skin & Laser Wellness Clinic",
    fees: 700,
    location: "Park Street, Kolkata",
    consultationMode: "Both",
    verified: true,
    rating: 4.8,
    totalReviews: 185,
    about: "Dr. Aris Thorne focuses on clinical dermatology, laser skin therapies, acne treatments, and cosmetic procedures.",
    profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    availabilitySlots: defaultSlots
  }
];

// Get All Doctors
export const getAllDoctors = async (req, res) => {
  try {
    let doctors = await Doctor.find();

    if (!doctors || doctors.length === 0) {
      doctors = defaultDoctorsList;
    } else {
      // Merge defaults for missing fields
      doctors = doctors.map(d => {
        const obj = d.toObject ? d.toObject() : { ...d };
        if (!obj.profileImage) obj.profileImage = defaultDoctorsList[0].profileImage;
        if (!obj.availabilitySlots || obj.availabilitySlots.length === 0) obj.availabilitySlots = defaultSlots;
        return obj;
      });
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Doctor By ID
export const getDoctorById = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id).catch(() => null);

    if (!doctor) {
      doctor = defaultDoctorsList.find(d => d._id === req.params.id) || defaultDoctorsList[0];
    } else {
      doctor = doctor.toObject ? doctor.toObject() : { ...doctor };
      if (!doctor.profileImage) doctor.profileImage = defaultDoctorsList[0].profileImage;
      if (!doctor.availabilitySlots || doctor.availabilitySlots.length === 0) doctor.availabilitySlots = defaultSlots;
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Doctors
export const searchDoctors = async (req, res) => {
  try {
    const { specialization, location } = req.query;

    const query = {};

    if (specialization) {
      query.specialization = {
        $regex: specialization,
        $options: "i",
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    let doctors = await Doctor.find(query);
    if (!doctors || doctors.length === 0) {
      doctors = defaultDoctorsList.filter(d => {
        const specMatch = !specialization || d.specialization.toLowerCase().includes(specialization.toLowerCase());
        const locMatch = !location || d.location.toLowerCase().includes(location.toLowerCase());
        return specMatch && locMatch;
      });
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Doctor
export const verifyDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.verified = true;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor verified successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Availability
export const updateAvailability = async (req, res) => {
  try {
    const slots = req.body.availabilitySlots || req.body.slots || [];
    let doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availabilitySlots: slots },
      { new: true }
    );

    if (!doctor) {
      const match = defaultDoctorsList.find(d => d._id === req.params.id);
      if (match) {
        match.availabilitySlots = slots;
        return res.status(200).json({
          success: true,
          availabilitySlots: slots,
          availability: slots
        });
      }
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      availabilitySlots: doctor.availabilitySlots,
      availability: doctor.availabilitySlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Availability
export const getAvailability = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id).catch(() => null);

    if (!doctor) {
      doctor = defaultDoctorsList.find(d => d._id === req.params.id) || defaultDoctorsList[0];
    }

    const slots = doctor?.availabilitySlots && doctor.availabilitySlots.length > 0 ? doctor.availabilitySlots : defaultSlots;

    res.status(200).json({
      success: true,
      availabilitySlots: slots,
      availability: slots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(
      req.params.id
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const doctorLogin = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    const doctor =
      await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const isMatch =
      await doctor.matchPassword(
        password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      success: true,
      token: generateDoctorToken(
        doctor._id
      ),
      doctor,
      mustChangePassword:
        !doctor.passwordChanged,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeDoctorPassword =
  async (req, res) => {
    try {

      const doctor =
        await Doctor.findById(
          req.params.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found",
        });
      }

      doctor.password =
        req.body.password;

      doctor.passwordChanged =
        true;

      await doctor.save();

      res.status(200).json({
        success: true,
        message:
          "Password updated successfully",
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };