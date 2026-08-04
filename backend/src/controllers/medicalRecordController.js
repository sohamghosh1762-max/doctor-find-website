import MedicalRecord from "../models/MedicalRecord.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Upload / Create Medical Record
export const uploadMedicalRecord = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const { title, category, fileUrl, fileType, doctorName, hospitalName, notes, tags } = req.body;

    const record = await MedicalRecord.create({
      patientId,
      title: title || "Medical Document",
      category: category || "Lab Report",
      fileUrl: fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileType: fileType || "PDF",
      doctorName: doctorName || "Dr. Ananya Sharma",
      hospitalName: hospitalName || "Apollo Gleneagles Hospital",
      notes: notes || "",
      tags: tags || [category || "Report"]
    });

    await Notification.create({
      user: patientId,
      title: "Lab Report Uploaded",
      message: `New document "${record.title}" has been successfully uploaded to your Medical Records.`,
      type: "report",
      linkId: record._id
    });

    res.status(201).json({
      success: true,
      message: "Medical record uploaded successfully",
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get My Medical Records
export const getMyMedicalRecords = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const { category, search } = req.query;
    let query = { patientId };

    if (category && category !== "All") {
      query.category = category;
    }

    let records = await MedicalRecord.find(query).sort({ createdAt: -1 });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      records = records.filter(r =>
        r.title.toLowerCase().includes(s) ||
        r.category.toLowerCase().includes(s) ||
        (r.doctorName && r.doctorName.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Medical Record
export const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
