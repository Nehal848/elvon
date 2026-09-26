import { NextRequest, NextResponse } from "next/server"

// --- Mock Data Store ---
const MOCK_EXPERIMENTS = [
  {
    id: "EXP-2026-WDBC-01",
    dataset_name: "Breast Cancer Diagnostic (WDBC)",
    target_column: "diagnosis",
    n_pca_components: 8,
    quantum_backend: "simulator_ideal",
    qml_model_type: "QSVM + VQC + QNN",
    status: "COMPLETED",
    created_at: "2026-03-24T10:15:30Z"
  },
  {
    id: "EXP-2026-HEART-02",
    dataset_name: "Heart Disease Cleveland",
    target_column: "target",
    n_pca_components: 6,
    quantum_backend: "simulator_noisy",
    qml_model_type: "Variational Quantum Classifier (VQC)",
    status: "COMPLETED",
    created_at: "2026-03-25T14:40:00Z"
  },
  {
    id: "EXP-2026-DIAB-03",
    dataset_name: "Diabetes Early Risk",
    target_column: "Outcome",
    n_pca_components: 8,
    quantum_backend: "simulator_ideal",
    qml_model_type: "Quantum Neural Network (QNN)",
    status: "COMPLETED",
    created_at: "2026-03-26T08:20:15Z"
  },
  {
    id: "EXP-2026-NEURO-04",
    dataset_name: "Parkinsons Disease Biomarkers",
    target_column: "status",
    n_pca_components: 8,
    quantum_backend: "simulator_ideal",
    qml_model_type: "QSVM (ZZFeatureMap)",
    status: "COMPLETED",
    created_at: "2026-03-26T06:10:00Z"
  },
  {
    id: "EXP-2026-NISQ-05",
    dataset_name: "Genomic Expression Profiling",
    target_column: "subtype",
    n_pca_components: 10,
    quantum_backend: "hardware_ibm_falcon",
    qml_model_type: "Hybrid Quantum Kernel",
    status: "RUNNING",
    created_at: "2026-03-26T07:15:00Z"
  }
]

const MOCK_EXPERIMENT_DETAILS: Record<string, any> = {
  "EXP-2026-WDBC-01": {
    experiment_id: "EXP-2026-WDBC-01",
    dataset_name: "Breast Cancer Diagnostic (WDBC)",
    target_col: "diagnosis",
    pipeline_summary: {
      n_qubits: 8,
      selected_features: ["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean", "compactness_mean", "concavity_mean", "concave_points_mean"],
      leakage_audit: { passed: true, split_leakage_detected: false, feature_leakage_detected: false }
    },
    benchmark: {
      outcome: "Completed: Evaluated Classical vs Hybrid QML algorithms",
      classical_champion: { name: "Random Forest", accuracy: 96.5, precision: 0.96, recall: 0.97, f1_score: 0.965, roc_auc: 0.991, latency_ms: 8.2, category: "Classical ML" },
      quantum_champion: { name: "Quantum Support Vector Machine (QSVM)", accuracy: 95.8, precision: 0.95, recall: 0.96, f1_score: 0.955, roc_auc: 0.985, latency_ms: 36.4, category: "Hybrid QML" },
      models: [
        { name: "QSVM (Quantum Kernel)", category: "Hybrid QML", accuracy: 95.8, precision: 0.95, recall: 0.96, f1_score: 0.955, roc_auc: 0.985, latency_ms: 36.4 },
        { name: "Variational Quantum Classifier (VQC)", category: "Hybrid QML", accuracy: 94.2, precision: 0.93, recall: 0.95, f1_score: 0.940, roc_auc: 0.978, latency_ms: 48.1 },
        { name: "Quantum Neural Network (QNN)", category: "Hybrid QML", accuracy: 95.1, precision: 0.94, recall: 0.96, f1_score: 0.950, roc_auc: 0.982, latency_ms: 52.0 },
        { name: "Random Forest", category: "Classical ML", accuracy: 96.5, precision: 0.96, recall: 0.97, f1_score: 0.965, roc_auc: 0.991, latency_ms: 8.2 },
        { name: "Support Vector Machine (RBF)", category: "Classical ML", accuracy: 93.9, precision: 0.93, recall: 0.94, f1_score: 0.935, roc_auc: 0.972, latency_ms: 4.1 },
        { name: "Logistic Regression", category: "Classical ML", accuracy: 92.1, precision: 0.91, recall: 0.93, f1_score: 0.920, roc_auc: 0.960, latency_ms: 2.3 }
      ]
    },
    quantum_resources: { depth: 16, total_gates: 52, cnot_count: 26, shots: 1000 },
    created_at: "2026-03-24T10:15:30Z"
  }
}

const MOCK_PATIENTS = [
  { id: "P-1048", name: "Rahul Verma", age: 54, gender: "Male", admission_date: "2026-09-21", status: "Admitted", condition: "Acute Coronary Syndrome", risk_level: "High", risk_score: 88, doctor: "Dr. Ananya Sharma", ward: "ICU-3" },
  { id: "P-1047", name: "Priya Nair", age: 42, gender: "Female", admission_date: "2026-09-22", status: "Admitted", condition: "Type 2 Diabetes Mellitus", risk_level: "Medium", risk_score: 64, doctor: "Dr. Rajesh K.", ward: "General-4B" },
  { id: "P-1046", name: "Suresh Menon", age: 67, gender: "Male", admission_date: "2026-09-23", status: "Under Observation", condition: "Chronic Renal Failure Stage 3", risk_level: "High", risk_score: 82, doctor: "Dr. Sunita Sen", ward: "Nephro-1A" },
  { id: "P-1045", name: "Kavita Reddy", age: 36, gender: "Female", admission_date: "2026-09-24", status: "Admitted", condition: "Hepatic Steatosis (NASH)", risk_level: "Low", risk_score: 35, doctor: "Dr. Rajesh K.", ward: "General-2A" },
  { id: "P-1044", name: "Amitabh Sen", age: 61, gender: "Male", admission_date: "2026-09-24", status: "Discharged", condition: "Post-CABG Recovery", risk_level: "Low", risk_score: 22, doctor: "Dr. Ananya Sharma", ward: "Cardio-West" },
  { id: "P-1043", name: "Meera Joshi", age: 49, gender: "Female", admission_date: "2026-09-25", status: "Admitted", condition: "Pulmonary Embolism Risk", risk_level: "High", risk_score: 91, doctor: "Dr. Priya Roy", ward: "ICU-1" }
]

const MOCK_REPORTS = [
  { id: "REP-901", patient_id: "P-1048", patient_name: "Rahul Verma", data_source: "DICOM Angiogram + ECG", model_used: "Quantum-Enhanced VQC Heart Classifier", models_skipped: [], confidence: 96.4, status: "Verified", key_finding: "Significant ST-elevation and proximal LAD lesion detected.", evidence: "Q-kernel amplitude shift indicates 92% ischaemia probability in anterior myocardial wall.", reasoning: "Synthesized multi-lead ECG with coronary angiogram series.", timestamp: "2026-09-24 14:20:00", analysis_time_sec: 1.8 },
  { id: "REP-902", patient_id: "P-1047", patient_name: "Priya Nair", data_source: "FHIR EHR Lab Series", model_used: "DeepGlycemia Predictor v1.8", models_skipped: [], confidence: 91.8, status: "Verified", key_finding: "Elevated HbA1c (8.9%) with glycemic fluctuation pattern.", evidence: "Fasting plasma glucose continuous trend indicates insulin resistance progression.", reasoning: "Analyzed 12-month longitudinal lab metrics via MLP ensemble.", timestamp: "2026-09-24 11:15:00", analysis_time_sec: 1.2 },
  { id: "REP-903", patient_id: "P-1046", patient_name: "Suresh Menon", data_source: "Renal Panel + eGFR", model_used: "RenalInsight AI v3.0", models_skipped: [], confidence: 93.5, status: "Pending", key_finding: "Declining eGFR (38 mL/min/1.73m2) with moderate proteinuria.", evidence: "Serum creatinine trajectory crossed critical threshold of 2.1 mg/dL.", reasoning: "Gradient boosted decision forest evaluated 14 metabolic biomarkers.", timestamp: "2026-09-25 09:40:00", analysis_time_sec: 2.1 }
]

const MOCK_USERS = [
  { id: "usr-01", full_name: "Dr. Arvind Swaminathan", email: "arvind.s@elvonhealth.org", role: "doctor", designation: "Chief of Cardiology", institution: "CityCare Multi-Speciality Hospital", status: "Active", created_at: "2026-01-15T09:00:00Z" },
  { id: "usr-02", full_name: "Dr. Eleanor Vance", email: "e.vance@elvonhealth.org", role: "researcher", designation: "Principal Quantum AI Scientist", institution: "CityCare Quantum Research Center", status: "Active", created_at: "2026-02-01T10:30:00Z" },
  { id: "usr-03", full_name: "Dr. Sunita Sen", email: "sunita.sen@elvonhealth.org", role: "doctor", designation: "Consultant Nephrologist", institution: "CityCare Multi-Speciality Hospital", status: "Active", created_at: "2026-02-10T14:15:00Z" },
  { id: "usr-04", full_name: "Vikram Malhotra", email: "v.malhotra@elvonhealth.org", role: "admin", designation: "Hospital IT & PACS Director", institution: "CityCare Multi-Speciality Hospital", status: "Active", created_at: "2026-01-10T08:00:00Z" }
]

const MOCK_VERSIONS = [
  { id: "v-3.2.0", model_id: "qsvm-oncology", model_name: "QSVM-Oncology-v3.2", version: "3.2.0", status: "Production", accuracy: "95.8%", f1_score: "0.955", date: "2026-03-24", author: "Dr. Eleanor Vance", changelog: "Integrated 8-qubit ZZFeatureMap ansatz with real-time error mitigation." },
  { id: "v-2.1.0", model_id: "vqc-cardio", model_name: "VQC-Cardio-v2.1", version: "2.1.0", status: "Staging", accuracy: "94.2%", f1_score: "0.940", date: "2026-03-20", author: "Research Lab", changelog: "Added noise-resilient cost Hamiltonian and adaptive Adam optimizer." },
  { id: "v-1.4.0", model_id: "qnn-metabolic", model_name: "QNN-Metabolic-v1.4", version: "1.4.0", status: "Production", accuracy: "95.1%", f1_score: "0.950", date: "2026-03-15", author: "Dr. Arvind Swaminathan", changelog: "Expanded continuous glucose monitor embedding layers." }
]

const MOCK_AUDIT_LOGS = [
  { id: "AUD-8091", timestamp: "2026-09-26 11:42:18", user: "Dr. Arvind Swaminathan", role: "doctor", action: "Inference Executed", resource: "Patient P-1048 (Rahul Verma)", category: "Inference", status: "Success", ip: "10.14.2.88", details: "Ran Quantum VQC Heart Classifier on DICOM Angiogram" },
  { id: "AUD-8090", timestamp: "2026-09-26 11:15:04", user: "Dr. Eleanor Vance", role: "researcher", action: "Experiment Completed", resource: "EXP-2026-WDBC-01", category: "Model", status: "Success", ip: "10.14.3.12", details: "Executed ZZFeatureMap QSVM kernel benchmark on 569 samples" },
  { id: "AUD-8089", timestamp: "2026-09-26 10:50:33", user: "Vikram Malhotra", role: "admin", action: "EHR Sync Verified", resource: "HL7 FHIR Gateway", category: "Access", status: "Success", ip: "10.14.1.5", details: "Synchronized 140 telemetry observations from ICU Ward" }
]

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = (params.path || []).join("/")
  
  if (path === "qml/experiments/history") {
    return NextResponse.json(MOCK_EXPERIMENTS)
  }

  if (path.startsWith("qml/experiment/")) {
    const id = path.replace("qml/experiment/", "")
    const detail = MOCK_EXPERIMENT_DETAILS[id] || {
      ...MOCK_EXPERIMENT_DETAILS["EXP-2026-WDBC-01"],
      experiment_id: id
    }
    return NextResponse.json(detail)
  }

  if (path === "qml/hardware/status") {
    return NextResponse.json({
      status: "ONLINE",
      active_backend: "Aer Simulator (Ideal / Noiseless)",
      available_backends: [
        { name: "Aer Simulator (Ideal)", qubits: 32, type: "simulator", status: "ready" },
        { name: "Noisy QPU Simulator (Thermal Relaxation)", qubits: 16, type: "simulator", status: "ready" },
        { name: "IBM Falcon (Eagle r3 Hardware Gateway)", qubits: 127, type: "hardware", status: "available" }
      ],
      noise_mitigation: "Zero-Noise Extrapolation (ZNE) Active",
      system_load: "18%"
    })
  }

  if (path === "patients") {
    return NextResponse.json({ patients: MOCK_PATIENTS })
  }

  if (path.startsWith("patients/") && path.endsWith("/reports")) {
    const patientId = path.split("/")[1]
    const matched = MOCK_REPORTS.filter(r => r.patient_id === patientId)
    return NextResponse.json({ reports: matched.length > 0 ? matched : MOCK_REPORTS })
  }

  if (path === "reports") {
    return NextResponse.json({ reports: MOCK_REPORTS })
  }

  if (path === "hospital/users") {
    return NextResponse.json({ users: MOCK_USERS })
  }

  if (path === "hospital/versions") {
    return NextResponse.json({ versions: MOCK_VERSIONS })
  }

  if (path === "hospital/audit") {
    return NextResponse.json({
      logs: MOCK_AUDIT_LOGS,
      summary: {
        total_events: 1428,
        security_incidents: 0,
        model_inferences: 842,
        data_access_events: 586
      }
    })
  }

  if (path === "hospital/integrations") {
    return NextResponse.json({
      integrations: [
        { id: "epic-ehr", name: "Epic Systems EHR", type: "HL7 FHIR R4", status: "Connected", latency_ms: 18, last_sync: "1 min ago" },
        { id: "orthanc-pacs", name: "Orthanc PACS Server", type: "DICOM C-STORE", status: "Connected", latency_ms: 24, last_sync: "Just now" },
        { id: "roche-lims", name: "Roche Diagnostics LIMS", type: "REST API", status: "Connected", latency_ms: 32, last_sync: "5 mins ago" }
      ]
    })
  }

  if (path === "alerts") {
    return NextResponse.json({
      alerts: [
        { id: "alt-1", type: "Critical", patient: "Rahul Verma", message: "Elevated ST Elevation & Ischaemia Score 92%", time: "5m ago" },
        { id: "alt-2", type: "Warning", patient: "Suresh Menon", message: "Declining eGFR trajectory (38 mL/min)", time: "25m ago" }
      ]
    })
  }

  if (path === "lab/sources") {
    return NextResponse.json({
      sources: [
        { id: "src-1", name: "Roche Cobas 8000 Clinical Analyzer", type: "Biochemistry", status: "Online", records_today: 1420 },
        { id: "src-2", name: "Siemens Magnetom 3T MRI", type: "Radiology PACS", status: "Online", records_today: 48 },
        { id: "src-3", name: "Philips IntelliSpace ECG Archiver", type: "Cardiology", status: "Online", records_today: 310 }
      ]
    })
  }

  if (path === "lab/uploads") {
    return NextResponse.json({
      uploads: [
        { id: "upl-1", filename: "ECG_Patient_1048_12Lead.xml", source: "Philips ECG", status: "analyzed", timestamp: "2026-09-26 11:30" },
        { id: "upl-2", filename: "MRI_Renal_Series_1046.dcm", source: "Siemens MRI", status: "analyzed", timestamp: "2026-09-26 10:45" }
      ]
    })
  }

  if (path === "lab/pacs/studies") {
    return NextResponse.json({
      studies: [
        { id: "STU-9901", patient_id: "P-1048", patient_name: "Rahul Verma", modality: "ECG/Angio", study_description: "Coronary Angiography + 12-Lead Rhythm", num_series: 4, num_instances: 120, study_date: "2026-09-25", status: "Ready" },
        { id: "STU-9902", patient_id: "P-1046", patient_name: "Suresh Menon", modality: "MR", study_description: "Renal Dynamic MRI Perfusion", num_series: 6, num_instances: 240, study_date: "2026-09-24", status: "Ready" },
        { id: "STU-9903", patient_id: "P-1043", patient_name: "Meera Joshi", modality: "CT", study_description: "Pulmonary Angiogram Protocol", num_series: 3, num_instances: 380, study_date: "2026-09-25", status: "Ready" }
      ]
    })
  }

  if (path === "lab/fhir/bundles") {
    return NextResponse.json({
      resourceType: "Bundle",
      type: "collection",
      timestamp: "2026-09-26T10:30:00Z",
      total: 6,
      entry: [
        { resource: { resourceType: "Observation", status: "final", code: { coding: [{ system: "http://loinc.org", code: "8867-4", display: "Heart rate" }], text: "Continuous Pulse Telemetry" }, valueQuantity: { value: 78, unit: "bpm" } } },
        { resource: { resourceType: "Observation", status: "final", code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic Blood Pressure" }], text: "Arterial Line Blood Pressure" }, valueQuantity: { value: 124, unit: "mmHg" } } },
        { resource: { resourceType: "Observation", status: "final", code: { coding: [{ system: "http://loinc.org", code: "2339-0", display: "Glucose [Mass/volume] in Blood" }], text: "Bedside Capillary Glucose" }, valueQuantity: { value: 112, unit: "mg/dL" } } }
      ]
    })
  }

  if (path.startsWith("automl/review/")) {
    return NextResponse.json({
      status: "reviewed",
      passed_audits: 8,
      total_audits: 8,
      leakage_free: true,
      class_balance: "Optimized via SMOTE",
      features_selected: 12
    })
  }

  if (path.startsWith("automl/explainability/")) {
    return NextResponse.json({
      feature_importance: [
        { feature: "radius_mean", importance: 0.35 },
        { feature: "concave_points_mean", importance: 0.26 },
        { feature: "texture_mean", importance: 0.18 },
        { feature: "area_mean", importance: 0.12 },
        { feature: "smoothness_mean", importance: 0.09 }
      ],
      summary: "Predictive power driven by cytological nuclear radius and concave points measurements."
    })
  }

  // Fallback GET
  return NextResponse.json({ status: "success", message: "Mock endpoint active", path })
}

export async function POST(req: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = (params.path || []).join("/")
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  if (path === "auth/login" || path === "auth/login/quick") {
    return NextResponse.json({
      token: "demo_jwt_token_2026",
      full_name: body.identifier?.includes("admin") ? "Vikram Malhotra" : body.identifier?.includes("research") ? "Dr. Eleanor Vance" : "Dr. Arvind Swaminathan",
      email: body.identifier?.includes("@") ? body.identifier : "clinician@elvonhealth.org",
      role: body.identifier?.includes("admin") ? "institution" : body.identifier?.includes("research") ? "researcher" : "doctor",
      designation: body.identifier?.includes("research") ? "Principal Quantum AI Scientist" : "Chief Clinician",
      institution: "CityCare Multi-Speciality Hospital",
      requires_otp: false
    })
  }

  if (path === "auth/verify-otp") {
    return NextResponse.json({
      token: "demo_jwt_token_2026",
      full_name: "Dr. Eleanor Vance",
      email: body.email || "e.vance@elvonhealth.org",
      role: "researcher",
      designation: "Principal Quantum AI Scientist",
      institution: "CityCare Quantum Research Center"
    })
  }

  if (path.startsWith("auth/register/")) {
    return NextResponse.json({
      success: true,
      message: "Registration initiated. Verification OTP sent.",
      otp_display: "849201"
    })
  }

  if (path === "qml/datasets/profile") {
    const name = body.dataset_name || "breast_cancer"
    return NextResponse.json({
      dataset_name: name,
      n_samples: name === "breast_cancer" ? 569 : name === "heart_disease" ? 303 : name === "diabetes" ? 768 : 195,
      n_features: name === "breast_cancer" ? 30 : name === "heart_disease" ? 13 : name === "diabetes" ? 8 : 22,
      class_balance: { "0": 0.627, "1": 0.373 },
      numeric_features: ["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean", "compactness_mean", "concavity_mean"],
      categorical_features: [],
      missing_values_count: 0,
      data_quality_score: 99.4
    })
  }

  if (path === "qml/experiment/run") {
    const ds = body.dataset_name || "breast_cancer"
    const expId = `EXP-2026-${ds.toUpperCase().slice(0, 5)}-${Math.floor(100 + Math.random() * 900)}`
    return NextResponse.json({
      experiment_id: expId,
      total_runtime_sec: 1.84,
      benchmark: {
        outcome: "Evaluated Classical vs Quantum models on isolated 5-fold cross validation split.",
        classical_champion: { name: "Random Forest", accuracy: 96.5, precision: 0.96, recall: 0.97, f1_score: 0.965, roc_auc: 0.991, latency_ms: 8.2, category: "Classical ML" },
        quantum_champion: { name: "Quantum Support Vector Machine (QSVM)", accuracy: 95.8, precision: 0.95, recall: 0.96, f1_score: 0.955, roc_auc: 0.985, latency_ms: 36.4, category: "Hybrid QML" },
        models: [
          { name: "QSVM (Quantum Kernel)", category: "Hybrid QML", accuracy: 95.8, precision: 0.95, recall: 0.96, f1_score: 0.955 },
          { name: "Variational Quantum Classifier (VQC)", category: "Hybrid QML", accuracy: 94.2, precision: 0.93, recall: 0.95, f1_score: 0.940 },
          { name: "Quantum Neural Network (QNN)", category: "Hybrid QML", accuracy: 95.1, precision: 0.94, recall: 0.96, f1_score: 0.950 },
          { name: "Random Forest", category: "Classical ML", accuracy: 96.5, precision: 0.96, recall: 0.97, f1_score: 0.965 },
          { name: "Support Vector Machine (RBF)", category: "Classical ML", accuracy: 93.9, precision: 0.93, recall: 0.94, f1_score: 0.935 }
        ]
      },
      pipeline_summary: {
        n_qubits: body.n_pca_components || 8,
        selected_features: ["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean", "compactness_mean"],
        leakage_audit: { passed: true, split_leakage_detected: false, feature_leakage_detected: false }
      },
      quantum_resources: { depth: 16, total_gates: 52, cnot_count: 26, shots: body.shots || 1024 }
    })
  }

  if (path === "qml/predict") {
    return NextResponse.json({
      prediction: 1,
      prediction_label: "Malignant / High Risk",
      probability: 0.892,
      confidence_interval: [0.84, 0.94],
      model_used: body.model_name || "Quantum Support Vector Machine",
      inference_time_ms: 38.4
    })
  }

  if (path === "qml/explain") {
    return NextResponse.json({
      model_name: body.model_name || "QSVM",
      feature_importance: [
        { feature: "radius_mean", importance: 0.36 },
        { feature: "concave_points_mean", importance: 0.27 },
        { feature: "texture_mean", importance: 0.17 },
        { feature: "area_mean", importance: 0.12 },
        { feature: "smoothness_mean", importance: 0.08 }
      ],
      method: "Kernel SHAP Explanation",
      summary: "Prediction driven primarily by high mean radius and elevated concave points measurements."
    })
  }

  if (path === "patients") {
    const newPat = {
      id: `P-${Math.floor(1050 + Math.random() * 50)}`,
      name: body.name || "New Patient",
      age: Number(body.age) || 45,
      gender: body.gender || "Male",
      admission_date: new Date().toISOString().split("T")[0],
      status: "Admitted",
      condition: body.condition || "Clinical Observation",
      risk_level: "Medium",
      risk_score: 55,
      doctor: "Dr. Arvind Swaminathan",
      ward: body.ward || "General"
    }
    return NextResponse.json({ patient: newPat })
  }

  if (path.startsWith("patients/") && path.endsWith("/generate-report")) {
    const rep = {
      id: `REP-${Math.floor(910 + Math.random() * 90)}`,
      patient_id: path.split("/")[1],
      patient_name: "Patient " + path.split("/")[1],
      data_source: body.source || "Clinical Telemetry",
      model_used: body.model || "Quantum VQC Diagnostic Model",
      models_skipped: [],
      confidence: 95.8,
      status: "Verified",
      key_finding: "AI Analysis indicates elevated risk markers requiring standard targeted protocol.",
      evidence: "Multi-parameter classification completed with zero-leakage pipeline validation.",
      reasoning: "Synthesized laboratory trends and longitudinal telemetry.",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      analysis_time_sec: 1.4
    }
    return NextResponse.json(rep)
  }

  if (path === "hospital/users") {
    const newUser = {
      id: `usr-${Math.floor(10 + Math.random() * 90)}`,
      full_name: body.full_name || "New Staff Member",
      email: body.email || "staff@elvonhealth.org",
      role: body.role || "doctor",
      designation: body.designation || "Clinician",
      institution: body.institution || "CityCare Multi-Speciality Hospital",
      status: "Active",
      created_at: new Date().toISOString()
    }
    return NextResponse.json({ user: newUser })
  }

  // AutoML Studio POST endpoints
  if (path === "automl/upload") {
    return NextResponse.json({
      job_id: `job-${Date.now()}`,
      suggested_target: "outcome",
      filename: "heart_disease_uci.csv",
      rows: 120,
      columns: ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "outcome"],
      status: "uploaded"
    })
  }

  if (path.startsWith("automl/profile/")) {
    return NextResponse.json({
      status: "approved",
      rows: 120,
      columns: ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "outcome"],
      missing_count: 0,
      quality_score: 96,
      distribution: { positive: 64, negative: 56 }
    })
  }

  if (path.startsWith("automl/configure/")) {
    return NextResponse.json({
      status: "configured",
      target_column: body.target_column || "outcome",
      excluded_columns: body.remove_columns || []
    })
  }

  if (path.startsWith("automl/clean/")) {
    return NextResponse.json({
      status: "cleaned",
      cleaning_actions: [
        "Identified 0 missing cells across 14 clinical attributes",
        "Applied RobustScaler to continuous biomarkers (chol, trestbps, thalach)",
        "One-hot encoded categorical risk factors (chest pain type, ECG slope, thalassemia)",
        "Zero HIPAA/GDPR identifying data leaks detected; privacy verified",
        "Synthesized 2 risk ratio features: cardiac_workload_index and cholesterol_age_ratio"
      ],
      final_shape: { rows: 120, columns: 16 }
    })
  }

  if (path.startsWith("automl/detect-problem/")) {
    return NextResponse.json({
      problem_type: "classification",
      sub_type: "binary_classification",
      n_classes: 2,
      metric_recommended: "ROC-AUC / F1-Score",
      suitable_algorithms: ["Random Forest", "XGBoost", "LightGBM", "Logistic Regression", "Support Vector Classifier"]
    })
  }

  if (path.startsWith("automl/train/")) {
    return NextResponse.json({
      status: "trained",
      results: {
        champion: {
          name: "Random Forest Classifier (Ensemble)",
          accuracy: 94.2,
          f1: 93.8,
          precision: 94.0,
          recall: 93.6,
          auc_roc: 0.962
        },
        all_algorithms: [
          { name: "Random Forest Classifier", accuracy: 94.2, f1: 93.8, time_sec: 1.2, auc_roc: 0.962 },
          { name: "XGBoost Gradient Boost", accuracy: 92.5, f1: 91.9, time_sec: 1.8, auc_roc: 0.945 },
          { name: "LightGBM Classifier", accuracy: 91.8, f1: 91.2, time_sec: 0.7, auc_roc: 0.938 },
          { name: "Logistic Regression (L2)", accuracy: 86.4, f1: 85.7, time_sec: 0.3, auc_roc: 0.892 },
          { name: "Support Vector Classifier (RBF)", accuracy: 84.1, f1: 83.2, time_sec: 0.5, auc_roc: 0.871 }
        ]
      }
    })
  }

  if (path.startsWith("automl/explainability/")) {
    return NextResponse.json({
      explainability: {
        champion_model: "Random Forest Classifier",
        accuracy: 94.2,
        f1_score: 93.8,
        precision: 94.0,
        recall: 93.6,
        auc_roc: 0.962,
        why_selected: "Selected as champion because it achieved 93.6% sensitivity on cardiovascular risk cases with sub-5% false positive rates.",
        dataset_info: { disease: "Cardiovascular Disease", features: 16, samples: 120 },
        top_features: [
          { name: "Max Heart Rate (thalach)", impact: 28, direction: "protective", desc: "Higher peak exercise HR strongly correlates with normal cardiac function." },
          { name: "ST Depression (oldpeak)", impact: 24, direction: "risk", desc: "Exercise-induced ST depression indicates subendocardial ischemia." },
          { name: "Chest Pain Type (cp)", impact: 20, direction: "risk", desc: "Typical angina presentation is a strong predictive indicator." },
          { name: "Major Fluoroscopy Vessels (ca)", impact: 16, direction: "risk", desc: "Number of colored coronary vessels indicates stenosis severity." },
          { name: "Serum Cholesterol (chol)", impact: 12, direction: "risk", desc: "Elevated lipid biomarker contributing to long-term arterial plaque." }
        ]
      }
    })
  }

  if (path.startsWith("automl/approve/")) {
    return NextResponse.json({ status: "approved", approved_by: "Administrator", timestamp: new Date().toISOString() })
  }

  if (path.startsWith("automl/deploy/")) {
    return NextResponse.json({
      status: "deployed",
      deployed_model: {
        name: "Elvon-CardioGuard-RF-v1",
        type: "Random Forest (AutoML Champion)",
        accuracy: 94.2,
        disease: "Cardiovascular Disease"
      },
      endpoint_url: "https://api.elvonhealth.org/v1/models/cardio-guard/predict",
      latency_p99: "18ms",
      replicas: 2
    })
  }

  return NextResponse.json({ status: "success", message: "Mock POST endpoint active", path, body })
}
