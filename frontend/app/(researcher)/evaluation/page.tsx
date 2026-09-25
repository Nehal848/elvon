"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import HospitalLayout from "@/components/hospital-layout"
import { 
  Info, BarChart2, Shield, Activity, Target, BrainCircuit,
  Zap, Clock, Layers, ArrowRight, Check, ChevronDown, Filter, Cpu
} from "lucide-react"

interface EvalModelData {
  id: string
  name: string
  shortName: string
  type: "Hybrid QML" | "Classical ML"
  accuracy: string
  precision: string
  recall: string
  sensitivity: string
  specificity: string
  f1: string
  rocAuc: string
  trainAcc: string
  testAcc: string
  cvMean: string
  cvStd: string
  cvFolds: number[]
  gap: string
  cm: { tn: number; fp: number; fn: number; tp: number }
  trainingTime: string
  inferenceTime: string
  features: string
  resources: string
  rocCurveDesc: string
}

const EVAL_MODELS: Record<string, EvalModelData> = {
  qsvm: {
    id: "qsvm",
    name: "QSVM (Quantum Support Vector Machine)",
    shortName: "QSVM",
    type: "Hybrid QML",
    accuracy: "94.7%",
    precision: "93.8%",
    recall: "95.2%",
    sensitivity: "95.2%",
    specificity: "92.9%",
    f1: "94.5%",
    rocAuc: "0.97",
    trainAcc: "96.1%",
    testAcc: "94.7%",
    cvMean: "94.2%",
    cvStd: "± 1.8%",
    cvFolds: [93.5, 94.1, 94.8, 95.2, 94.0],
    gap: "1.4%",
    cm: { tn: 182, fp: 30, fn: 21, tp: 344 },
    trainingTime: "6.8 min",
    inferenceTime: "0.18 s",
    features: "8 (Quantum-ready)",
    resources: "8 Qubits / Simulator",
    rocCurveDesc: "QSVM (AUC = 0.97)"
  },
  vqc: {
    id: "vqc",
    name: "VQC (Variational Quantum Classifier)",
    shortName: "VQC",
    type: "Hybrid QML",
    accuracy: "92.4%",
    precision: "91.2%",
    recall: "93.0%",
    sensitivity: "93.0%",
    specificity: "90.8%",
    f1: "92.1%",
    rocAuc: "0.95",
    trainAcc: "94.8%",
    testAcc: "92.4%",
    cvMean: "92.0%",
    cvStd: "± 2.1%",
    cvFolds: [91.2, 92.5, 93.0, 91.8, 91.5],
    gap: "2.4%",
    cm: { tn: 176, fp: 36, fn: 28, tp: 337 },
    trainingTime: "8.7 min",
    inferenceTime: "0.24 s",
    features: "8 (PauliMap)",
    resources: "8 Qubits / Aer GPU",
    rocCurveDesc: "VQC (AUC = 0.95)"
  },
  qkernel: {
    id: "qkernel",
    name: "Quantum Kernel SVM",
    shortName: "Quantum Kernel",
    type: "Hybrid QML",
    accuracy: "93.8%",
    precision: "92.5%",
    recall: "94.1%",
    sensitivity: "94.1%",
    specificity: "91.5%",
    f1: "93.3%",
    rocAuc: "0.96",
    trainAcc: "95.2%",
    testAcc: "93.8%",
    cvMean: "93.4%",
    cvStd: "± 1.9%",
    cvFolds: [92.8, 93.6, 94.2, 93.9, 92.5],
    gap: "1.4%",
    cm: { tn: 179, fp: 33, fn: 24, tp: 341 },
    trainingTime: "7.4 min",
    inferenceTime: "0.20 s",
    features: "8 (ZZ-FeatureMap)",
    resources: "8 Qubits / Simulator",
    rocCurveDesc: "Quantum Kernel (AUC = 0.96)"
  },
  qnn: {
    id: "qnn",
    name: "Quantum Neural Network (QNN)",
    shortName: "QNN",
    type: "Hybrid QML",
    accuracy: "94.1%",
    precision: "93.1%",
    recall: "94.8%",
    sensitivity: "94.8%",
    specificity: "92.1%",
    f1: "93.9%",
    rocAuc: "0.96",
    trainAcc: "96.0%",
    testAcc: "94.1%",
    cvMean: "93.8%",
    cvStd: "± 1.7%",
    cvFolds: [93.0, 94.2, 94.5, 94.1, 93.2],
    gap: "1.9%",
    cm: { tn: 180, fp: 32, fn: 23, tp: 342 },
    trainingTime: "9.3 min",
    inferenceTime: "0.28 s",
    features: "10 (Entangled)",
    resources: "10 Qubits / Torch QNN",
    rocCurveDesc: "QNN (AUC = 0.96)"
  },
  ensemble_hybrid: {
    id: "ensemble_hybrid",
    name: "Ensemble Hybrid (QSVM + XGBoost)",
    shortName: "Hybrid Ensemble",
    type: "Hybrid QML",
    accuracy: "96.2%",
    precision: "95.4%",
    recall: "96.8%",
    sensitivity: "96.8%",
    specificity: "94.5%",
    f1: "96.1%",
    rocAuc: "0.98",
    trainAcc: "97.5%",
    testAcc: "96.2%",
    cvMean: "95.9%",
    cvStd: "± 1.2%",
    cvFolds: [95.5, 96.0, 96.8, 96.2, 95.0],
    gap: "1.3%",
    cm: { tn: 186, fp: 26, fn: 14, tp: 351 },
    trainingTime: "10.2 min",
    inferenceTime: "0.29 s",
    features: "30 (Fused Space)",
    resources: "Heterogeneous Q+C",
    rocCurveDesc: "Hybrid Ensemble (AUC = 0.98)"
  },
  random_forest: {
    id: "random_forest",
    name: "Random Forest Classifier",
    shortName: "Random Forest",
    type: "Classical ML",
    accuracy: "93.5%",
    precision: "92.1%",
    recall: "94.0%",
    sensitivity: "94.0%",
    specificity: "91.8%",
    f1: "93.0%",
    rocAuc: "0.95",
    trainAcc: "95.8%",
    testAcc: "93.5%",
    cvMean: "93.1%",
    cvStd: "± 1.4%",
    cvFolds: [92.5, 93.2, 93.9, 93.4, 92.5],
    gap: "2.3%",
    cm: { tn: 178, fp: 34, fn: 26, tp: 339 },
    trainingTime: "4.8 min",
    inferenceTime: "0.12 s",
    features: "30 (Tabular)",
    resources: "CPU (Multi-Core)",
    rocCurveDesc: "Random Forest (AUC = 0.95)"
  },
  xgboost: {
    id: "xgboost",
    name: "XGBoost Gradient Booster",
    shortName: "XGBoost",
    type: "Classical ML",
    accuracy: "93.9%",
    precision: "92.8%",
    recall: "94.3%",
    sensitivity: "94.3%",
    specificity: "92.0%",
    f1: "93.5%",
    rocAuc: "0.96",
    trainAcc: "96.4%",
    testAcc: "93.9%",
    cvMean: "93.5%",
    cvStd: "± 1.5%",
    cvFolds: [93.1, 93.8, 94.4, 93.6, 92.6],
    gap: "2.5%",
    cm: { tn: 180, fp: 32, fn: 24, tp: 341 },
    trainingTime: "3.6 min",
    inferenceTime: "0.10 s",
    features: "30 (Tabular)",
    resources: "GPU Accelerated",
    rocCurveDesc: "XGBoost (AUC = 0.96)"
  },
  lightgbm: {
    id: "lightgbm",
    name: "LightGBM Classifier",
    type: "Classical ML",
    shortName: "LightGBM",
    accuracy: "93.2%",
    precision: "91.9%",
    recall: "93.6%",
    sensitivity: "93.6%",
    specificity: "91.2%",
    f1: "92.7%",
    rocAuc: "0.94",
    trainAcc: "95.2%",
    testAcc: "93.2%",
    cvMean: "92.8%",
    cvStd: "± 1.6%",
    cvFolds: [92.0, 93.1, 93.7, 93.0, 92.2],
    gap: "2.0%",
    cm: { tn: 177, fp: 35, fn: 27, tp: 338 },
    trainingTime: "1.9 min",
    inferenceTime: "0.06 s",
    features: "30 (Tabular)",
    resources: "CPU (OpenMP)",
    rocCurveDesc: "LightGBM (AUC = 0.94)"
  },
  svm_classical: {
    id: "svm_classical",
    name: "Support Vector Machine (Classical RBF)",
    shortName: "SVM (Classical)",
    type: "Classical ML",
    accuracy: "89.8%",
    precision: "87.5%",
    recall: "90.2%",
    sensitivity: "90.2%",
    specificity: "88.0%",
    f1: "88.8%",
    rocAuc: "0.93",
    trainAcc: "92.4%",
    testAcc: "89.8%",
    cvMean: "89.2%",
    cvStd: "± 2.2%",
    cvFolds: [88.5, 89.8, 90.4, 89.1, 88.2],
    gap: "2.6%",
    cm: { tn: 171, fp: 41, fn: 37, tp: 328 },
    trainingTime: "2.1 min",
    inferenceTime: "0.06 s",
    features: "30 (Scaled)",
    resources: "CPU",
    rocCurveDesc: "SVM (AUC = 0.93)"
  },
  logistic_regression: {
    id: "logistic_regression",
    name: "Logistic Regression (L2)",
    shortName: "Logistic Regression",
    type: "Classical ML",
    accuracy: "87.4%",
    precision: "85.2%",
    recall: "88.0%",
    sensitivity: "88.0%",
    specificity: "85.5%",
    f1: "86.6%",
    rocAuc: "0.91",
    trainAcc: "89.1%",
    testAcc: "87.4%",
    cvMean: "86.8%",
    cvStd: "± 2.5%",
    cvFolds: [86.0, 87.2, 87.9, 86.5, 86.4],
    gap: "1.7%",
    cm: { tn: 166, fp: 46, fn: 42, tp: 323 },
    trainingTime: "1.7 min",
    inferenceTime: "0.05 s",
    features: "30 (Z-score)",
    resources: "CPU",
    rocCurveDesc: "Logistic Regression (AUC = 0.91)"
  }
}

export default function EvaluationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 font-bold">Loading Evaluation Metrics...</div>}>
      <EvaluationContent />
    </Suspense>
  )
}

function EvaluationContent() {
  const searchParams = useSearchParams()
  const initialModel = searchParams.get("model") || "qsvm"
  const [selectedModelKey, setSelectedModelKey] = useState<string>(initialModel)

  useEffect(() => {
    const urlModel = searchParams.get("model")
    if (urlModel && EVAL_MODELS[urlModel]) {
      setSelectedModelKey(urlModel)
    }
  }, [searchParams])

  const currentModel = EVAL_MODELS[selectedModelKey] || EVAL_MODELS.qsvm

  return (
    <HospitalLayout 
      title="Evaluation & Benchmarking" 
      subtitle="Evaluate and compare classical ML and hybrid QML model performance for the selected experiment."
    >
      <div className="max-w-[1600px] space-y-6 pb-12">
        
        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-bold text-slate-700">Select Model To Inspect:</span>
            <div className="relative">
              <select 
                value={selectedModelKey}
                onChange={(e) => setSelectedModelKey(e.target.value)}
                className="bg-slate-50 border-2 border-blue-500/30 hover:border-blue-500 rounded-xl pl-4 pr-10 py-2 text-[13px] font-bold text-slate-800 outline-none shadow-sm cursor-pointer transition-all appearance-none min-w-[280px]"
              >
                <optgroup label="⚛️ Hybrid Quantum (QML) Models">
                  <option value="qsvm">QSVM (Quantum Support Vector Machine)</option>
                  <option value="vqc">VQC (Variational Quantum Classifier)</option>
                  <option value="qkernel">Quantum Kernel SVM</option>
                  <option value="qnn">Quantum Neural Network (QNN)</option>
                  <option value="ensemble_hybrid">Ensemble Hybrid (QSVM + XGBoost)</option>
                </optgroup>
                <optgroup label="💻 Classical Machine Learning Models">
                  <option value="random_forest">Random Forest Classifier</option>
                  <option value="xgboost">XGBoost Gradient Booster</option>
                  <option value="lightgbm">LightGBM Classifier</option>
                  <option value="svm_classical">Support Vector Machine (Classical RBF)</option>
                  <option value="logistic_regression">Logistic Regression (L2)</option>
                </optgroup>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-slate-500">Inspecting:</span>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
              currentModel.type === "Hybrid QML" 
                ? "bg-purple-50 text-purple-700 border border-purple-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {currentModel.type}
            </span>
            <span className="text-[13px] font-extrabold text-slate-900">{currentModel.shortName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Performance Metrics Table */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[16px] font-bold text-slate-900">Performance Metrics</h3>
                <span className="text-[11px] text-slate-400 font-semibold">Click a row to inspect</span>
              </div>
              
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 font-semibold text-slate-500">Model</th>
                    <th className="pb-3 font-semibold text-slate-500">Type</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">Accuracy</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">Precision</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">Recall</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">Sensitivity</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">Specificity</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">F1-Score</th>
                    <th className="pb-3 font-semibold text-slate-500 text-center">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Classical ML Group */}
                  <tr>
                    <td colSpan={9} className="py-2 font-bold text-blue-600 bg-blue-50/50 px-3 rounded-md mt-2 block w-full text-[10px] uppercase tracking-wider">Classical ML Models</td>
                  </tr>
                  <MetricRow name="SVM (Classical)" type="Classical ML" v1="0.90" v2="0.88" v3="0.90" v4="0.90" v5="0.88" v6="0.89" v7="0.93" active={selectedModelKey === "svm_classical"} onClick={() => setSelectedModelKey("svm_classical")} />
                  <MetricRow name="Random Forest" type="Classical ML" v1="0.94" v2="0.92" v3="0.94" v4="0.94" v5="0.92" v6="0.93" v7="0.95" active={selectedModelKey === "random_forest"} onClick={() => setSelectedModelKey("random_forest")} />
                  <MetricRow name="XGBoost" type="Classical ML" v1="0.94" v2="0.93" v3="0.94" v4="0.94" v5="0.92" v6="0.94" v7="0.96" active={selectedModelKey === "xgboost"} onClick={() => setSelectedModelKey("xgboost")} />
                  <MetricRow name="LightGBM" type="Classical ML" v1="0.93" v2="0.92" v3="0.94" v4="0.94" v5="0.91" v6="0.93" v7="0.94" active={selectedModelKey === "lightgbm"} onClick={() => setSelectedModelKey("lightgbm")} />
                  <MetricRow name="Logistic Regression" type="Classical ML" v1="0.87" v2="0.85" v3="0.88" v4="0.88" v5="0.86" v6="0.87" v7="0.91" active={selectedModelKey === "logistic_regression"} onClick={() => setSelectedModelKey("logistic_regression")} />
                  
                  {/* Hybrid QML Group */}
                  <tr>
                    <td colSpan={9} className="py-2 font-bold text-purple-600 bg-purple-50/50 px-3 rounded-md mt-4 block w-full text-[10px] uppercase tracking-wider">Hybrid QML Models</td>
                  </tr>
                  <MetricRow name="QSVM" type="Hybrid QML" typeColor="text-purple-500" v1="0.95" v2="0.94" v3="0.95" v4="0.95" v5="0.93" v6="0.95" v7="0.97" active={selectedModelKey === "qsvm"} onClick={() => setSelectedModelKey("qsvm")} />
                  <MetricRow name="Quantum Kernel" type="Hybrid QML" typeColor="text-purple-500" v1="0.94" v2="0.93" v3="0.94" v4="0.94" v5="0.92" v6="0.93" v7="0.96" active={selectedModelKey === "qkernel"} onClick={() => setSelectedModelKey("qkernel")} />
                  <MetricRow name="VQC" type="Hybrid QML" typeColor="text-purple-500" v1="0.92" v2="0.91" v3="0.93" v4="0.93" v5="0.91" v6="0.92" v7="0.95" active={selectedModelKey === "vqc"} onClick={() => setSelectedModelKey("vqc")} />
                  <MetricRow name="QNN" type="Hybrid QML" typeColor="text-purple-500" v1="0.94" v2="0.93" v3="0.95" v4="0.95" v5="0.92" v6="0.94" v7="0.96" active={selectedModelKey === "qnn"} onClick={() => setSelectedModelKey("qnn")} />
                  <MetricRow name="Hybrid Ensemble" type="Hybrid QML" typeColor="text-purple-500" v1="0.96" v2="0.95" v3="0.97" v4="0.97" v5="0.95" v6="0.96" v7="0.98" active={selectedModelKey === "ensemble_hybrid"} onClick={() => setSelectedModelKey("ensemble_hybrid")} />
                </tbody>
              </table>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50/70 rounded-[12px] p-4 flex items-center gap-3 border border-blue-100">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                <Info size={14} />
              </div>
              <div>
                <span className="font-bold text-blue-900 text-[13px] mr-2">Evaluation Context</span>
                <span className="text-blue-700 text-[12px] font-medium">Performance is evaluated on the held-out test set. Results should be interpreted together with cross-validation, generalization, computational cost and quantum resource requirements.</span>
              </div>
            </div>

            {/* Validation & Generalization for Selected Model */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-[16px] font-bold text-slate-900">Validation & Generalization</h3>
                <span className="text-[11px] font-bold text-blue-600">{currentModel.shortName}</span>
              </div>
              <p className="text-[12px] text-slate-500 mb-6">Evaluating train/test consistency and k-fold cross validation for {currentModel.name}.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Train/Test */}
                <div className="md:col-span-1 border-r border-slate-100 pr-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart2 size={16} className="text-blue-500" />
                    <span className="text-[13px] font-bold text-slate-800">Train / Test Performance</span>
                  </div>
                  <div className="flex justify-end gap-3 text-[10px] font-bold text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" /> Train</div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-cyan-400" /> Test</div>
                  </div>
                  <div className="flex items-end justify-center gap-8 h-24 border-b border-slate-100 px-2 pb-1 relative">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 font-bold py-1">
                      <span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0.0</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className="flex items-end gap-1 h-full">
                        <div className="w-5 bg-blue-500 rounded-t-sm relative" style={{ height: currentModel.trainAcc }}>
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">{currentModel.trainAcc}</span>
                        </div>
                        <div className="w-5 bg-cyan-400 rounded-t-sm relative" style={{ height: currentModel.testAcc }}>
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">{currentModel.testAcc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">Train vs Test</span>
                    </div>
                  </div>
                </div>

                {/* CV */}
                <div className="md:col-span-1 border-r border-slate-100 pr-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={16} className="text-blue-500" />
                    <span className="text-[13px] font-bold text-slate-800">Cross-Validation</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-4">5-Fold Cross-Validation</div>
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400">Mean Accuracy</div>
                      <div className="text-[18px] font-extrabold text-slate-900">{currentModel.cvMean}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400">Std Deviation</div>
                      <div className="text-[16px] font-bold text-slate-700">{currentModel.cvStd}</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-16 border-b border-slate-100 pb-1">
                    {currentModel.cvFolds.map((f, i) => (
                      <CVBar key={i} val={f} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 px-1 text-[9px] font-bold text-slate-400">
                    <span>F1</span><span>F2</span><span>F3</span><span>F4</span><span>F5</span>
                  </div>
                </div>

                {/* Generalization */}
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                    <Shield size={16} className="text-emerald-500" />
                    <span className="text-[13px] font-bold text-slate-800">Generalization</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0"><Target size={14}/></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500">Train → Test Gap</div>
                        <div className="text-[14px] font-extrabold text-slate-900">{currentModel.gap}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0"><Check size={14}/></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500">Cross-validation Stability</div>
                        <div className="text-[13px] font-bold text-emerald-600">High consistency</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 shrink-0"><BrainCircuit size={14}/></div>
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500">Model Framework</div>
                        <div className="text-[13px] font-bold text-purple-600">{currentModel.type}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ACTIVE SELECTED MODEL DETAILS */}
          <div className="space-y-6">
            
            {/* Dynamic Selected Model Card */}
            <div className={`bg-white rounded-[20px] p-6 border shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden ${
              currentModel.type === "Hybrid QML" ? "border-purple-200/80" : "border-blue-200/80"
            }`}>
              <div className={`absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none ${
                currentModel.type === "Hybrid QML" ? "bg-gradient-to-bl from-purple-100/40 to-transparent" : "bg-gradient-to-bl from-blue-100/40 to-transparent"
              }`} />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                      currentModel.type === "Hybrid QML" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {currentModel.type}
                    </span>
                    <span className="text-[12px] font-bold text-slate-400">Detailed Analytics</span>
                  </div>
                  <h3 className="text-[18px] font-extrabold text-slate-900">{currentModel.name}</h3>
                </div>

                <div className="relative">
                  <select 
                    value={selectedModelKey}
                    onChange={(e) => setSelectedModelKey(e.target.value)}
                    className="bg-white border-2 border-blue-500/40 hover:border-blue-500 rounded-xl px-3 py-1.5 text-[12px] font-bold text-slate-800 outline-none shadow-sm cursor-pointer transition-colors appearance-none pr-8"
                  >
                    <optgroup label="⚛️ Hybrid QML">
                      <option value="qsvm">QSVM</option>
                      <option value="vqc">VQC</option>
                      <option value="qkernel">Quantum Kernel</option>
                      <option value="qnn">QNN</option>
                      <option value="ensemble_hybrid">Hybrid Ensemble</option>
                    </optgroup>
                    <optgroup label="💻 Classical ML">
                      <option value="random_forest">Random Forest</option>
                      <option value="xgboost">XGBoost</option>
                      <option value="lightgbm">LightGBM</option>
                      <option value="svm_classical">SVM (Classical)</option>
                      <option value="logistic_regression">Logistic Regression</option>
                    </optgroup>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
                </div>
              </div>
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
                <SummaryCard icon={<Target size={16} className="text-blue-500" />} iconBg="bg-blue-50" label="Accuracy" value={currentModel.accuracy} />
                <SummaryCard icon={<Shield size={16} className="text-emerald-500" />} iconBg="bg-emerald-50" label="Precision" value={currentModel.precision} />
                <SummaryCard icon={<Activity size={16} className="text-purple-500" />} iconBg="bg-purple-50" label="Recall" value={currentModel.recall} />
                <SummaryCard icon={<Zap size={16} className="text-amber-500" />} iconBg="bg-amber-50" label="Sensitivity" value={currentModel.sensitivity} />
                <SummaryCard icon={<Target size={16} className="text-blue-500" />} iconBg="bg-blue-50" label="Specificity" value={currentModel.specificity} />
                <SummaryCard icon={<Layers size={16} className="text-amber-500" />} iconBg="bg-amber-50" label="F1-Score" value={currentModel.f1} />
                <SummaryCard icon={<Activity size={16} className="text-blue-500" />} iconBg="bg-blue-50" label="ROC-AUC" value={currentModel.rocAuc} colSpan={2} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Confusion Matrix */}
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800 mb-1">Confusion Matrix</h4>
                  <p className="text-[11px] text-slate-500 mb-4">{currentModel.shortName} — Held-out Cohort</p>
                  
                  <div className="flex">
                    <div className="flex flex-col justify-center pr-2">
                      <span className="text-[10px] font-semibold text-slate-400 -rotate-90 origin-center whitespace-nowrap inline-block w-4">Actual Class</span>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-1 mb-1">
                        <div className="bg-blue-600 text-white rounded-tl-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">TN</span>
                          <span className="text-[20px] font-bold">{currentModel.cm.tn}</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 rounded-tr-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">FP</span>
                          <span className="text-[20px] font-bold">{currentModel.cm.fp}</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 rounded-bl-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">FN</span>
                          <span className="text-[20px] font-bold">{currentModel.cm.fn}</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-br-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">TP</span>
                          <span className="text-[20px] font-bold">{currentModel.cm.tp}</span>
                        </div>
                      </div>
                      <div className="flex justify-between px-6 text-[10px] font-semibold text-slate-400 pt-1">
                        <span>Negative</span><span>Positive</span>
                      </div>
                      <div className="text-center text-[10px] font-semibold text-slate-400 mt-1">Predicted Class</div>
                    </div>
                  </div>
                </div>

                {/* ROC Curve */}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-800 mb-1">ROC Curve</h4>
                      <p className="text-[11px] text-slate-500">Selected: {currentModel.shortName}</p>
                    </div>
                    <div className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">AUC: <span className="text-blue-600">{currentModel.rocAuc}</span></div>
                  </div>
                  
                  <div className="relative h-[160px] pl-8 pb-6 border-l border-b border-slate-300">
                    <div className="absolute left-1 top-0 bottom-6 flex flex-col justify-between text-[9px] font-semibold text-slate-400 text-right w-5">
                      <span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0.0</span>
                    </div>
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold text-slate-400 whitespace-nowrap">True Positive Rate</div>
                    
                    <div className="absolute left-8 right-0 -bottom-4 flex justify-between text-[9px] font-semibold text-slate-400">
                      <span>0.0</span><span>0.2</span><span>0.4</span><span>0.6</span><span>0.8</span><span>1.0</span>
                    </div>
                    <div className="absolute left-8 right-0 -bottom-8 text-center text-[10px] font-semibold text-slate-400">False Positive Rate</div>
                    
                    {/* Grid lines */}
                    <div className="absolute inset-0 left-8 bottom-6 border-t border-r border-slate-100 flex flex-col justify-between z-0">
                      <div className="border-b border-slate-100 flex-1"></div>
                      <div className="border-b border-slate-100 flex-1"></div>
                      <div className="border-b border-slate-100 flex-1"></div>
                      <div className="border-b border-slate-100 flex-1"></div>
                      <div className="flex-1"></div>
                    </div>
                    
                    {/* No Skill Line */}
                    <svg className="absolute inset-0 left-8 bottom-6 w-full h-full z-10" preserveAspectRatio="none">
                      <line x1="0" y1="100%" x2="100%" y2="0" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>

                    {/* ROC Line */}
                    <svg className="absolute inset-0 left-8 bottom-6 w-full h-full z-20 overflow-visible" preserveAspectRatio="none">
                      <path d="M 0 100 Q 5 15, 10 5 T 100 0" fill="none" stroke={currentModel.type === "Hybrid QML" ? "#8b5cf6" : "#2563eb"} strokeWidth="2.5" />
                    </svg>
                  </div>

                  <div className="mt-10 flex flex-col gap-1 text-[10px] font-bold text-slate-500 pl-8">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-0.5 ${currentModel.type === "Hybrid QML" ? "bg-purple-600" : "bg-blue-600"}`} /> 
                      {currentModel.rocCurveDesc}
                    </div>
                    <div className="flex items-center gap-2"><span className="w-3 h-0 border-t border-dashed border-slate-400" /> Baseline / No Skill</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Classical vs Hybrid QML (Comparison Table) */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1">Classical ML vs Hybrid QML Benchmark</h3>
              <p className="text-[12px] text-slate-500 mb-6">Compare predictive performance, execution cost and resource requirements across approaches.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 font-semibold text-slate-400">Model</th>
                      <th className="pb-3 font-semibold text-slate-400">Type</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">Accuracy</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">F1-Score</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">ROC-AUC</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">Training Time</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">Inference Time</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">Feature Dims</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">Resources</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CompRow name="SVM (Classical)" type="Classical ML" v1="0.90" v2="0.89" v3="0.93" t1="2.1 min" t2="0.06 s" fd="30" res="CPU" active={selectedModelKey === "svm_classical"} />
                    <CompRow name="Random Forest" type="Classical ML" v1="0.94" v2="0.93" v3="0.95" t1="4.8 min" t2="0.12 s" fd="30" res="CPU" active={selectedModelKey === "random_forest"} />
                    <CompRow name="XGBoost" type="Classical ML" v1="0.94" v2="0.94" v3="0.96" t1="3.6 min" t2="0.10 s" fd="30" res="GPU" active={selectedModelKey === "xgboost"} />
                    <CompRow name="LightGBM" type="Classical ML" v1="0.93" v2="0.93" v3="0.94" t1="1.9 min" t2="0.06 s" fd="30" res="CPU" active={selectedModelKey === "lightgbm"} />
                    <CompRow name="Logistic Regression" type="Classical ML" v1="0.87" v2="0.87" v3="0.91" t1="1.7 min" t2="0.05 s" fd="30" res="CPU" active={selectedModelKey === "logistic_regression"} />
                    
                    <CompRow name="QSVM" type="Hybrid QML" typeColor="text-purple-500" v1="0.95" v2="0.95" v3="0.97" t1="6.8 min" t2="0.18 s" fd="8" res="Quantum" active={selectedModelKey === "qsvm"} />
                    <CompRow name="Quantum Kernel" type="Hybrid QML" typeColor="text-purple-500" v1="0.94" v2="0.93" v3="0.96" t1="7.4 min" t2="0.20 s" fd="8" res="Quantum" active={selectedModelKey === "qkernel"} />
                    <CompRow name="VQC" type="Hybrid QML" typeColor="text-purple-500" v1="0.92" v2="0.92" v3="0.95" t1="8.7 min" t2="0.24 s" fd="8" res="Quantum" active={selectedModelKey === "vqc"} />
                    <CompRow name="QNN" type="Hybrid QML" typeColor="text-purple-500" v1="0.94" v2="0.94" v3="0.96" t1="9.3 min" t2="0.28 s" fd="8" res="Quantum" active={selectedModelKey === "qnn"} />
                    <CompRow name="Hybrid Ensemble" type="Hybrid QML" typeColor="text-purple-500" v1="0.96" v2="0.96" v3="0.98" t1="10.2 min" t2="0.29 s" fd="30" res="Hybrid Q+C" active={selectedModelKey === "ensemble_hybrid"} />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Wide Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Execution & Resource Analysis */}
              <div className="md:col-span-2 bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <h3 className="text-[16px] font-bold text-slate-900 mb-6">Execution & Resource Analysis</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Training Time */}
                  <div className="border border-slate-100 rounded-[12px] p-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 mb-3"><Clock size={14} className="text-blue-500"/> Training Time</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Classical ML</div>
                        <div className="text-[15px] font-extrabold text-slate-900">2.4 min avg</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Hybrid QML</div>
                        <div className="text-[15px] font-extrabold text-slate-900">8.7 min avg</div>
                      </div>
                    </div>
                  </div>
                  {/* Inference Time */}
                  <div className="border border-slate-100 rounded-[12px] p-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 mb-3"><Zap size={14} className="text-amber-500"/> Inference Latency</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Classical ML</div>
                        <div className="text-[15px] font-extrabold text-slate-900">0.08 s</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Hybrid QML</div>
                        <div className="text-[15px] font-extrabold text-slate-900">0.21 s</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Feature Dimensions */}
                  <div className="border border-slate-100 rounded-[12px] p-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 mb-3"><Layers size={14} className="text-blue-500"/> Feature Dimensions</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Original</div>
                        <div className="text-[15px] font-extrabold text-slate-900">30</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Selected Model Space</div>
                        <div className="text-[15px] font-extrabold text-slate-900">{currentModel.features}</div>
                      </div>
                    </div>
                  </div>
                  {/* Quantum Resources */}
                  <div className={`border rounded-[12px] p-4 ${currentModel.type === "Hybrid QML" ? "bg-purple-50/50 border-purple-100" : "bg-slate-50/50 border-slate-100"}`}>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 mb-3">
                      {currentModel.type === "Hybrid QML" ? <BrainCircuit size={14} className="text-purple-500"/> : <Cpu size={14} className="text-blue-500"/>}
                      {currentModel.type === "Hybrid QML" ? "Quantum Resources" : "Compute Hardware"}
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Hardware Allocation</div>
                      <div className="text-[13px] font-extrabold text-slate-900">{currentModel.resources}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Summary */}
              <div className="md:col-span-1 bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-5">Evaluation Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-emerald-500"><Check size={14}/></div>
                      <p className="text-[11px] text-slate-600 font-medium">Test performance is consistent with cross-validation results.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-emerald-500"><Check size={14}/></div>
                      <p className="text-[11px] text-slate-600 font-medium">Classical and hybrid QML models were evaluated using the same core metrics.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-emerald-500"><Check size={14}/></div>
                      <p className="text-[11px] text-slate-600 font-medium">Performance should be considered alongside execution time and resource requirements.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">Active: {currentModel.shortName}</span>
                  <button className="text-[12px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Export Analysis <ArrowRight size={14}/>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </HospitalLayout>
  )
}

function MetricRow({ name, type, typeColor="text-blue-500", v1, v2, v3, v4, v5, v6, v7, active, onClick }: any) {
  return (
    <tr 
      onClick={onClick}
      className={`border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${
        active ? 'bg-blue-50/80 font-bold border-l-4 border-blue-600' : 'hover:bg-slate-50/70'
      }`}
    >
      <td className="py-2.5 font-bold text-slate-800 pl-2">{name}</td>
      <td className={`py-2.5 font-medium ${typeColor}`}>{type}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v1}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v2}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v3}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v4}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v5}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v6}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v7}</td>
    </tr>
  )
}

function CompRow({ name, type, typeColor="text-blue-500", v1, v2, v3, t1, t2, fd, res, active }: any) {
  return (
    <tr className={`border-b border-slate-50 last:border-0 ${active ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50/50'}`}>
      <td className="py-2.5 font-bold text-slate-800">{name}</td>
      <td className={`py-2.5 font-medium ${typeColor}`}>{type}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v1}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v2}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{v3}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{t1}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{t2}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{fd}</td>
      <td className="py-2.5 font-medium text-slate-600 text-center">{res}</td>
    </tr>
  )
}

function SummaryCard({ icon, iconBg, label, value, colSpan=1 }: any) {
  return (
    <div className={`border border-slate-100 rounded-[12px] p-4 flex items-center gap-3 bg-[#f8fafc] ${colSpan > 1 ? 'col-span-2' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-semibold text-slate-500 mb-0.5">{label}</div>
        <div className="text-[16px] font-extrabold text-slate-900 leading-none">{value}</div>
      </div>
    </div>
  )
}

function CVBar({ val }: any) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[9px] font-bold text-slate-700">{val}%</div>
      <div className="w-4 bg-blue-500 rounded-sm" style={{ height: `${Math.max(10, (val - 85) * 8)}px` }} />
    </div>
  )
}
