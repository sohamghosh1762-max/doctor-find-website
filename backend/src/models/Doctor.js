import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
  type: String,
  required: true,
  unique: true
},

password: {
  type: String,
  required: true,
  default: "123456"
},

passwordChanged: {
  type: Boolean,
  default: false
},

phone: {
  type: String,
  required: true
},

    specialization: {
      type: String,
      required: true
    },

    qualification: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    hospital: {
      type: String,
      required: true
    },

    fees: {
      type: Number,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    languages: [
      {
        type: String
      }
    ],

    consultationMode: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Both"
      ],
      default: "Both"
    },

    availabilitySlots: [
  {
    day: {
      type: String
    },

    startTime: {
      type: String
    },

    endTime: {
      type: String
    },

    slotDuration: {
      type: Number,
      default: 30
    },

    maxPatients: {
      type: Number,
      default: 10
    }
  }
],

    licenseNumber: {
      type: String,
      required: true
    },

    licenseCertificate: {
      type: String,
      default: ""
    },

    profileImage: {
      type: String,
      default: ""
    },

    about: {
      type: String,
      default: ""
    },

    verified: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

doctorSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );
});

doctorSchema.methods.matchPassword =
  async function (enteredPassword) {
    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

export default mongoose.model(
  "Doctor",
  doctorSchema
);