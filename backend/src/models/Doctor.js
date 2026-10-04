import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    passwordChanged: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    hospital: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    languages: [
      {
        type: String,
      },
    ],

    consultationMode: {
      type: String,
      enum: ["Online", "Offline", "Both"],
      default: "Both",
    },

    availabilitySlots: [
      {
        day: {
          type: String,
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
        slotDuration: {
          type: Number,
          default: 30,
        },
        maxPatients: {
          type: Number,
          default: 10,
        },
      },
    ],

    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    licenseCertificate: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
doctorSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Exclude password when serializing to JSON
doctorSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("Doctor", doctorSchema);