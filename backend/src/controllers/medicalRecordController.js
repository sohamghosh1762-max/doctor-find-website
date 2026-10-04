import path from "path";
import fs from "fs";
import MedicalRecord from "../models/MedicalRecord.js";
import Notification from "../models/Notification.js";
import { logAuditEvent } from "../services/auditService.js";

// Upload / Create Medical Record (Protected - Patient / Doctor / Admin)
export const uploadMedicalRecord = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { title, category, fileUrl, fileType, doctorName, hospitalName, notes, tags } = req.body;

    const record = await MedicalRecord.create({
      patientId,
      title: title || "Medical Document",
      category: category || "Lab Report",
      fileUrl: fileUrl || "",
      fileType: fileType || "PDF",
      doctorName: doctorName || "",
      hospitalName: hospitalName || "",
      notes: notes || "",
      tags: tags || [category || "Report"],
    });

    await Notification.create({
      user: patientId,
      title: "Medical Record Added",
      message: `New document "${record.title}" has been added to your Medical Records.`,
      type: "report",
      linkId: String(record._id),
    });

    await logAuditEvent({
      req,
      action: "MEDICAL_RECORD_CREATED",
      resource: "MedicalRecord",
      resourceId: record._id,
      details: { title: record.title, category: record.category },
    });

    res.status(201).json({
      success: true,
      message: "Medical record uploaded successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload medical record.",
      code: "RECORD_UPLOAD_ERROR",
    });
  }
};

// Get My Medical Records (Protected - Scoped to req.user._id)
export const getMyMedicalRecords = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { category, search } = req.query;

    let query = { patientId };

    if (category && category !== "All") {
      query.category = category;
    }

    let records = await MedicalRecord.find(query).sort({ createdAt: -1 });

    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.category.toLowerCase().includes(s) ||
          (r.doctorName && r.doctorName.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch medical records.",
      code: "RECORDS_FETCH_ERROR",
    });
  }
};

// Get Single Medical Record By ID (Ownership Checked)
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found.",
        code: "RECORD_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isOwner = String(record.patientId) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this medical record.",
        code: "UNAUTHORIZED_RECORD_ACCESS",
      });
    }

    await logAuditEvent({
      req,
      action: "MEDICAL_RECORD_VIEWED",
      resource: "MedicalRecord",
      resourceId: record._id,
    });

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "RECORD_FETCH_ERROR",
    });
  }
};

// Delete Medical Record (Ownership Checked)
export const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found.",
        code: "RECORD_NOT_FOUND",
      });
    }

    const userId = String(req.user._id);
    const isOwner = String(record.patientId) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this medical record.",
        code: "UNAUTHORIZED_RECORD_DELETE",
      });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    await logAuditEvent({
      req,
      action: "MEDICAL_RECORD_DELETED",
      resource: "MedicalRecord",
      resourceId: record._id,
    });

    res.status(200).json({
      success: true,
      message: "Medical record deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      code: "RECORD_DELETE_ERROR",
    });
  }
};

// Securely Stream File with Ownership Check
export const getSecureRecordFile = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const userId = String(req.user._id);
    const isOwner = String(record.patientId) === userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Unauthorized file access" });
    }

    if (!record.fileUrl || !record.fileUrl.startsWith("/uploads/")) {
      return res.redirect(record.fileUrl || "/");
    }

    const relativeFileName = record.fileUrl.replace("/uploads/", "");
    const safePath = path.resolve("uploads", path.basename(relativeFileName));

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ success: false, message: "File not found on server" });
    }

    res.sendFile(safePath);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
