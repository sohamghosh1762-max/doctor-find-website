import SymptomAnalysis from "../models/SymptomAnalysis.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please describe your symptoms before analyzing."
      });
    }

    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const text = symptoms.toLowerCase();

    let possibleConditions = [];
    let severity = "Moderate";
    let recommendations = [];
    let suggestedSpecialist = "General Physician";
    let urgencyLevel = "Consult within 24-48 hours";
    let suggestedTests = [];

    if (text.includes("chest") || text.includes("heart") || text.includes("breath")) {
      severity = "High";
      suggestedSpecialist = "Cardiologist";
      urgencyLevel = "Immediate medical evaluation recommended";
      possibleConditions = [
        { condition: "Angina / Ischemic Heart Condition", probability: "78%", description: "Chest pressure or discomfort caused by reduced blood flow to heart muscle." },
        { condition: "Hypertensive Episode", probability: "65%", description: "Elevated systemic blood pressure requiring monitoring." }
      ];
      recommendations = [
        "Avoid strenuous physical activities immediately",
        "Sit upright in a comfortable ventilated room",
        "Keep emergency contact numbers ready"
      ];
      suggestedTests = ["Electrocardiogram (ECG)", "Troponin I Test", "Echocardiogram"];
    } else if (text.includes("headache") || text.includes("migraine") || text.includes("dizzy")) {
      severity = "Moderate";
      suggestedSpecialist = "Neurologist";
      urgencyLevel = "Schedule consultation within 24 hours";
      possibleConditions = [
        { condition: "Tension Headache / Stress Migraine", probability: "82%", description: "Throbbing sensation caused by muscle contractions or vascular tension." },
        { condition: "Cervicogenic Headache", probability: "55%", description: "Head pain originating from neck stiffness or poor ergonomics." }
      ];
      recommendations = [
        "Rest in a quiet, darkened room",
        "Ensure adequate hydration (2-3 liters of water)",
        "Apply cool compress on forehead"
      ];
      suggestedTests = ["Brain MRI", "Cervical Spine X-Ray", "Blood Pressure Check"];
    } else if (text.includes("fever") || text.includes("cough") || text.includes("cold") || text.includes("flu")) {
      severity = "Mild";
      suggestedSpecialist = "General Physician";
      urgencyLevel = "Routine consultation within 48 hours";
      possibleConditions = [
        { condition: "Viral Upper Respiratory Infection", probability: "88%", description: "Contagious viral infection affecting nasal passage and throat." },
        { condition: "Influenza (Flu)", probability: "70%", description: "Acute viral illness with body aches and elevated temperature." }
      ];
      recommendations = [
        "Drink warm water and herbal tea regularly",
        "Steam inhalation 2-3 times a day",
        "Isolate to prevent spreading infection"
      ];
      suggestedTests = ["Complete Blood Count (CBC)", "Nasal Swab Test"];
    } else if (text.includes("skin") || text.includes("rash") || text.includes("itch")) {
      severity = "Mild";
      suggestedSpecialist = "Dermatologist";
      urgencyLevel = "Non-urgent evaluation within 3 days";
      possibleConditions = [
        { condition: "Allergic Contact Dermatitis", probability: "84%", description: "Inflammatory skin condition triggered by allergen exposure." },
        { condition: "Eczema / Atopic Dermatitis", probability: "62%", description: "Chronic dry itchy skin condition." }
      ];
      recommendations = [
        "Avoid scratching the affected area",
        "Apply mild hypoallergenic moisturizer",
        "Identify and eliminate contact allergens"
      ];
      suggestedTests = ["Skin Patch Test", "IgE Allergy Blood Test"];
    } else {
      severity = "Moderate";
      suggestedSpecialist = "General Physician";
      urgencyLevel = "Consult a physician within 24-48 hours";
      possibleConditions = [
        { condition: "General Physical Exhaustion / Malaise", probability: "75%", description: "Overexertion or early stage non-specific viral syndrome." },
        { condition: "Nutritional Deficiency", probability: "50%", description: "Possible Vitamin D3 or Iron deficiency." }
      ];
      recommendations = [
        "Get 7-8 hours of uninterrupted restful sleep",
        "Eat a balanced nutrition-dense diet",
        "Monitor body parameters"
      ];
      suggestedTests = ["Routine Health Screening", "Vitamin D3 & B12 Panel"];
    }

    // Fetch nearby matching doctors
    const doctors = await Doctor.find({
      $or: [
        { specialty: new RegExp(suggestedSpecialist, "i") },
        { specialty: "General Physician" }
      ]
    }).limit(3);

    const nearbyDoctors = doctors.map(d => ({
      name: d.name,
      specialty: d.specialty,
      rating: d.rating || 4.8,
      hospital: d.hospital || "Apollo Gleneagles Hospital"
    }));

    const analysisData = {
      patientId,
      symptomsText: symptoms,
      possibleConditions,
      severity,
      recommendations,
      suggestedSpecialist,
      urgencyLevel,
      suggestedTests,
      nearbyDoctors,
      disclaimer: "This AI Symptom Analysis is for informational purposes only and does not replace professional medical advice or diagnosis."
    };

    const savedAnalysis = await SymptomAnalysis.create(analysisData);

    res.status(200).json({
      success: true,
      analysis: savedAnalysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSymptomHistory = async (req, res) => {
  try {
    let patientId = req.user?._id;
    if (!patientId) {
      const defaultUser = await User.findOne({ email: "rahul@example.com" });
      patientId = defaultUser?._id;
    }

    const history = await SymptomAnalysis.find({ patientId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};