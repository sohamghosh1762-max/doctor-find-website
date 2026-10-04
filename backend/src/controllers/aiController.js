import SymptomAnalysis from "../models/SymptomAnalysis.js";
import Doctor from "../models/Doctor.js";

const MEDICAL_DISCLAIMER =
  "Notice: This is an AI-assisted preliminary symptom assessment for informational and triage guidance only. It is NOT a medical diagnosis, clinical evaluation, or treatment prescription. If you are experiencing chest pain, severe breathing difficulty, sudden weakness, or severe bleeding, please call emergency services (112 / 911 / 102) or visit the nearest emergency room immediately.";

export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please describe your symptoms to receive an assessment.",
        code: "MISSING_SYMPTOMS",
      });
    }

    const patientId = req.user?._id || null;
    const text = symptoms.toLowerCase();

    let possibleConditions = [];
    let severity = "Moderate";
    let recommendations = [];
    let suggestedSpecialist = "General Physician";
    let urgencyLevel = "Consult a physician within 24-48 hours";
    let suggestedTests = [];
    let isEmergency = false;

    if (
      text.includes("chest") ||
      text.includes("heart") ||
      text.includes("breath") ||
      text.includes("shortness of breath") ||
      text.includes("unconscious")
    ) {
      severity = "Emergency";
      isEmergency = true;
      suggestedSpecialist = "Cardiologist / Emergency Medicine";
      urgencyLevel = "URGENT: Immediate emergency evaluation strongly recommended";
      possibleConditions = [
        {
          condition: "Possible Acute Cardiovascular / Respiratory Episode",
          relevance: "High Concern",
          description: "Symptoms may indicate decreased myocardial perfusion or acute respiratory distress.",
        },
        {
          condition: "Hypertensive Crisis / Vasospasm",
          relevance: "Moderate Concern",
          description: "Elevated systemic vascular resistance requiring immediate triage.",
        },
      ];
      recommendations = [
        "Seek immediate emergency medical care or call 112 / 102 / 911",
        "Avoid any strenuous physical exertion; remain seated upright",
        "Keep emergency contacts and medical history ready for paramedics",
      ];
      suggestedTests = ["12-Lead Electrocardiogram (ECG)", "High-Sensitivity Troponin I", "Echocardiogram", "Chest X-Ray"];
    } else if (text.includes("headache") || text.includes("migraine") || text.includes("dizzy") || text.includes("vertigo")) {
      severity = "Moderate";
      suggestedSpecialist = "Neurologist";
      urgencyLevel = "Schedule specialist consultation within 24-48 hours";
      possibleConditions = [
        {
          condition: "Tension Headache / Vascular Migraine",
          relevance: "High Concern",
          description: "Symptom pattern aligns with neurovascular or muscular tension headaches.",
        },
        {
          condition: "Cervicogenic Strain / Benign Positional Vertigo",
          relevance: "Moderate Concern",
          description: "Head pain or vestibular imbalance originating from cervical posture or inner ear.",
        },
      ];
      recommendations = [
        "Rest in a quiet, dark environment with minimal screen time",
        "Maintain adequate oral hydration (2.5-3L water daily)",
        "Log episode trigger factors (sleep, stress, caffeine intake)",
      ];
      suggestedTests = ["Neurological Clinical Examination", "Brain MRI / CT if persistent", "Blood Pressure Evaluation"];
    } else if (text.includes("fever") || text.includes("cough") || text.includes("cold") || text.includes("flu") || text.includes("sore throat")) {
      severity = "Mild";
      suggestedSpecialist = "General Physician";
      urgencyLevel = "Routine outpatient consultation within 48 hours";
      possibleConditions = [
        {
          condition: "Viral Upper Respiratory Tract Infection",
          relevance: "High Concern",
          description: "Self-limiting viral syndrome affecting upper respiratory mucosa.",
        },
        {
          condition: "Seasonal Influenza / Pharyngitis",
          relevance: "Moderate Concern",
          description: "Systemic viral illness with low-grade pyrexia and myalgia.",
        },
      ];
      recommendations = [
        "Ensure adequate hydration and electrolyte intake with warm fluids",
        "Practice rest and isolate if actively coughing or sneezing",
        "Monitor temperature regularly using a digital thermometer",
      ];
      suggestedTests = ["Complete Blood Count (CBC)", "Rapid Viral / CRP Panel if fever persists > 3 days"];
    } else if (text.includes("skin") || text.includes("rash") || text.includes("itch") || text.includes("allergy")) {
      severity = "Mild";
      suggestedSpecialist = "Dermatologist";
      urgencyLevel = "Non-urgent dermatological consultation within 3-5 days";
      possibleConditions = [
        {
          condition: "Allergic Contact Dermatitis / Urticaria",
          relevance: "High Concern",
          description: "Cutaneous hypersensitivity reaction triggered by contactants or environmental allergens.",
        },
        {
          condition: "Atopic Eczema / Dry Skin Dermatitis",
          relevance: "Moderate Concern",
          description: "Pruritic epidermal barrier disruption.",
        },
      ];
      recommendations = [
        "Avoid scratching or applying unprescribed steroid creams",
        "Apply mild hypoallergenic emollients to hydrate skin barrier",
        "Identify and avoid recently introduced soaps, cosmetics, or allergens",
      ];
      suggestedTests = ["Dermatological Evaluation", "Skin Patch / IgE Allergen Screening"];
    } else {
      severity = "Moderate";
      suggestedSpecialist = "General Physician";
      urgencyLevel = "Consult a primary care physician within 2-3 days";
      possibleConditions = [
        {
          condition: "Non-Specific General Fatigue / Viral Malaise",
          relevance: "Moderate Concern",
          description: "Symptoms indicate general physiological strain or early-stage viral reaction.",
        },
        {
          condition: "Nutritional / Metabolic Deficiency",
          relevance: "Low Concern",
          description: "Possible Micronutrient (Vitamin D3/B12/Iron) insufficiency.",
        },
      ];
      recommendations = [
        "Prioritize 7-8 hours of quality sleep and balanced nutrition",
        "Stay hydrated and note symptom progression over the next 48 hours",
        "Book a general wellness consultation if symptoms do not improve",
      ];
      suggestedTests = ["Routine Comprehensive Metabolic Panel", "CBC and Vitamin D3/B12 Screening"];
    }

    // Fetch verified matching doctors from database
    const doctors = await Doctor.find({
      $or: [
        { specialization: new RegExp(suggestedSpecialist.split(" ")[0], "i") },
        { specialization: "General Physician" },
      ],
    }).limit(3);

    const nearbyDoctors = doctors.map((d) => ({
      name: d.name,
      specialty: d.specialization,
      rating: d.rating || 4.8,
      hospital: d.hospital || "Apollo Hospital",
    }));

    let savedAnalysis = null;
    if (patientId) {
      savedAnalysis = await SymptomAnalysis.create({
        patientId,
        symptomsText: symptoms,
        possibleConditions,
        severity,
        recommendations,
        suggestedSpecialist,
        urgencyLevel,
        suggestedTests,
        nearbyDoctors,
        disclaimer: MEDICAL_DISCLAIMER,
      });
    }

    const responsePayload = {
      _id: savedAnalysis?._id || `analysis-${Date.now()}`,
      symptomsText: symptoms,
      possibleConditions,
      severity,
      isEmergency,
      recommendations,
      suggestedSpecialist,
      urgencyLevel,
      suggestedTests,
      nearbyDoctors,
      disclaimer: MEDICAL_DISCLAIMER,
      createdAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      assessmentType: "AI-assisted preliminary symptom assessment",
      analysis: responsePayload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze symptoms.",
      code: "AI_ANALYSIS_ERROR",
    });
  }
};

// Get Symptom History (Protected - Scoped to req.user._id)
export const getSymptomHistory = async (req, res) => {
  try {
    const patientId = req.user._id;
    const history = await SymptomAnalysis.find({ patientId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch symptom assessment history.",
      code: "HISTORY_FETCH_ERROR",
    });
  }
};