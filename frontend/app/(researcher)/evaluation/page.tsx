"use client"

import React from "react"
import HospitalLayout from "@/components/hospital-layout"
import { 
  Info, BarChart2, Shield, Activity, Target, BrainCircuit,
  Zap, Clock, Layers, ArrowRight, Check
} from "lucide-react"

export default function EvaluationPage() {
  return (
    <HospitalLayout 
      title="Evaluation & Benchmarking" 
      subtitle="Evaluate and compare classical ML and hybrid QML model performance for the selected experiment."
    >
      <div className="max-w-[1600px] space-y-6 pb-12">
        
        {/* Filter Row */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[13px] font-bold text-slate-700">Evaluation View:</span>
          <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-[13px] font-bold text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors appearance-none pr-10 relative">
            <option>Compare Models</option>
          </select>
          {/* Custom chevron for select */}
          <div className="relative -ml-8 pointer-events-none text-slate-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Performance Metrics Table */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h3 className="text-[16px] font-bold text-slate-900 mb-5">Performance Metrics</h3>
              
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
                    <td colSpan={9} className="py-2.5 font-bold text-blue-600 bg-blue-50/50 px-3 rounded-md mt-2 block w-full text-[11px] uppercase tracking-wider">Classical ML</td>
                  </tr>
                  <MetricRow name="SVM" type="Classical ML" v1="0.89" v2="0.86" v3="0.88" v4="0.88" v5="0.90" v6="0.87" v7="0.93" />
                  <MetricRow name="Random Forest" type="Classical ML" v1="0.91" v2="0.89" v3="0.91" v4="0.90" v5="0.92" v6="0.90" v7="0.95" />
                  <MetricRow name="Logistic Regression" type="Classical ML" v1="0.87" v2="0.84" v3="0.86" v4="0.85" v5="0.88" v6="0.85" v7="0.91" />
                  <MetricRow name="XGBoost" type="Classical ML" v1="0.90" v2="0.88" v3="0.89" v4="0.88" v5="0.91" v6="0.88" v7="0.94" />
                  
                  {/* Hybrid QML Group */}
                  <tr>
                    <td colSpan={9} className="py-2.5 font-bold text-purple-600 bg-purple-50/50 px-3 rounded-md mt-4 block w-full text-[11px] uppercase tracking-wider">Hybrid QML</td>
                  </tr>
                  <MetricRow name="QSVM" type="Hybrid QML" typeColor="text-purple-500" v1="0.92" v2="0.90" v3="0.93" v4="0.92" v5="0.91" v6="0.91" v7="0.97" highlight />
                  <MetricRow name="Quantum Kernel" type="Hybrid QML" typeColor="text-purple-500" v1="0.90" v2="0.87" v3="0.90" v4="0.89" v5="0.90" v6="0.88" v7="0.94" />
                  <MetricRow name="VQC" type="Hybrid QML" typeColor="text-purple-500" v1="0.88" v2="0.85" v3="0.87" v4="0.86" v5="0.89" v6="0.86" v7="0.92" />
                  <MetricRow name="QNN" type="Hybrid QML" typeColor="text-purple-500" v1="0.91" v2="0.88" v3="0.90" v4="0.89" v5="0.91" v6="0.89" v7="0.95" />
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

            {/* Validation & Generalization */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1">Validation & Generalization</h3>
              <p className="text-[12px] text-slate-500 mb-6">Check whether model performance remains consistent beyond the training data.</p>
              
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
                    {/* Y Axis markings */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 font-bold py-1">
                      <span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0.0</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className="flex items-end gap-1 h-full">
                        <div className="w-5 bg-blue-500 rounded-t-sm relative" style={{ height: '96%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">96.1%</span></div>
                        <div className="w-5 bg-cyan-400 rounded-t-sm relative" style={{ height: '94%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">94.7%</span></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">Training Accuracy</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className="flex items-end gap-1 h-full">
                        <div className="w-5 bg-blue-500 rounded-t-sm relative" style={{ height: '94%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">94.7%</span></div>
                        <div className="w-5 bg-cyan-400 rounded-t-sm relative" style={{ height: '94%' }}><span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">94.7%</span></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">Test Accuracy</span>
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
                      <div className="text-[18px] font-extrabold text-slate-900">94.2%</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400">Standard Deviation</div>
                      <div className="text-[16px] font-bold text-slate-700">± 1.8%</div>
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-16 border-b border-slate-100 pb-1">
                    <CVBar val={93.5} />
                    <CVBar val={94.1} />
                    <CVBar val={94.8} />
                    <CVBar val={95.2} />
                    <CVBar val={94.0} />
                  </div>
                  <div className="flex justify-between mt-2 px-1 text-[9px] font-bold text-slate-400">
                    <span>Fold 1</span><span>Fold 2</span><span>Fold 3</span><span>Fold 4</span><span>Fold 5</span>
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
                        <div className="text-[14px] font-extrabold text-slate-900">1.4%</div>
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
                        <div className="text-[11px] font-semibold text-slate-500">Overfitting Indicator</div>
                        <div className="text-[13px] font-bold text-purple-600">Low</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Comparison (Bar Chart) */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-bold text-slate-900">Performance Comparison</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#1e3a8a]"/> Accuracy</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#06b6d4]"/> Precision</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#8b5cf6]"/> Recall</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#f59e0b]"/> F1-Score</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#3b82f6]"/> ROC-AUC</div>
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-[200px] flex items-end justify-around px-8 pb-4 relative">
                {/* Y Axis */}
                <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                  <span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0.0</span>
                </div>
                
                <ChartGroup name="SVM" v1={60} v2={55} v3={58} v4={59} v5={62} />
                <ChartGroup name="Random Forest" v1={72} v2={70} v3={68} v4={69} v5={75} />
                <ChartGroup name="QSVM" v1={88} v2={86} v3={89} v4={87} v5={92} />
                <ChartGroup name="Quantum Kernel" v1={78} v2={75} v3={79} v4={76} v5={82} />
              </div>
              
              <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <Info size={14} className="text-blue-500 shrink-0" />
                Results shown are experiment-specific and should be interpreted alongside validation, computational cost and resource requirements.
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* QSVM Hybrid QML Details */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-[16px] font-bold text-slate-900">QSVM - Hybrid QML</h3>
                <div className="text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Selected Model: QSVM</div>
              </div>
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
                <SummaryCard icon={<Target size={16} className="text-blue-500" />} iconBg="bg-blue-50" label="Accuracy" value="94.7%" />
                <SummaryCard icon={<Shield size={16} className="text-emerald-500" />} iconBg="bg-emerald-50" label="Precision" value="93.8%" />
                <SummaryCard icon={<Activity size={16} className="text-purple-500" />} iconBg="bg-purple-50" label="Recall" value="95.2%" />
                <SummaryCard icon={<Zap size={16} className="text-amber-500" />} iconBg="bg-amber-50" label="Sensitivity" value="95.2%" />
                <SummaryCard icon={<Target size={16} className="text-blue-500" />} iconBg="bg-blue-50" label="Specificity" value="92.9%" />
                <SummaryCard icon={<Layers size={16} className="text-amber-500" />} iconBg="bg-amber-50" label="F1-Score" value="94.5%" />
                <SummaryCard icon={<Activity size={16} className="text-blue-500" />} iconBg="bg-blue-50" label="ROC-AUC" value="0.97" colSpan={2} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Confusion Matrix */}
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800 mb-1">Confusion Matrix</h4>
                  <p className="text-[11px] text-slate-500 mb-4">QSVM — Test Set</p>
                  
                  <div className="flex">
                    <div className="flex flex-col justify-center pr-2">
                      <span className="text-[10px] font-semibold text-slate-400 -rotate-90 origin-center whitespace-nowrap inline-block w-4">Actual Class</span>
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-1 mb-1">
                        <div className="bg-blue-600 text-white rounded-tl-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">TN</span>
                          <span className="text-[20px] font-bold">182</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 rounded-tr-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">FP</span>
                          <span className="text-[20px] font-bold">30</span>
                        </div>
                        <div className="bg-blue-100 text-blue-800 rounded-bl-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">FN</span>
                          <span className="text-[20px] font-bold">21</span>
                        </div>
                        <div className="bg-blue-600 text-white rounded-br-lg flex flex-col items-center justify-center py-4">
                          <span className="text-[11px] font-semibold opacity-80">TP</span>
                          <span className="text-[20px] font-bold">344</span>
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
                      <p className="text-[11px] text-slate-500">Selected Model: QSVM</p>
                    </div>
                    <div className="text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded">Model: <span className="text-blue-600">QSVM ▾</span></div>
                  </div>
                  
                  <div className="relative h-[160px] pl-8 pb-6 border-l border-b border-slate-300">
                    {/* Y Axis labels */}
                    <div className="absolute left-1 top-0 bottom-6 flex flex-col justify-between text-[9px] font-semibold text-slate-400 text-right w-5">
                      <span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0.0</span>
                    </div>
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-semibold text-slate-400 whitespace-nowrap">True Positive Rate</div>
                    
                    {/* X Axis labels */}
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

                    {/* ROC Line (QSVM) */}
                    <svg className="absolute inset-0 left-8 bottom-6 w-full h-full z-20 overflow-visible" preserveAspectRatio="none">
                      <path d="M 0 100 Q 5 15, 10 5 T 100 0" fill="none" stroke="#2563eb" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="mt-10 flex flex-col gap-1 text-[10px] font-bold text-slate-500 pl-8">
                    <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-blue-600" /> QSVM (AUC = 0.97)</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-0 border-t border-dashed border-slate-400" /> No Skill</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Classical vs Hybrid QML (Table) */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h3 className="text-[16px] font-bold text-slate-900 mb-1">Classical ML vs Hybrid QML</h3>
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
                      <th className="pb-3 font-semibold text-slate-400 text-center">Feature Dimensions</th>
                      <th className="pb-3 font-semibold text-slate-400 text-center">Resources</th>
                    </tr>
                  </thead>
                  <tbody>
                    <CompRow name="SVM" type="Classical ML" v1="0.89" v2="0.87" v3="0.93" t1="2.1 min" t2="0.06 s" fd="30" res="CPU" />
                    <CompRow name="Random Forest" type="Classical ML" v1="0.91" v2="0.90" v3="0.95" t1="4.8 min" t2="0.12 s" fd="30" res="CPU" />
                    <CompRow name="Logistic Regression" type="Classical ML" v1="0.87" v2="0.85" v3="0.91" t1="1.7 min" t2="0.05 s" fd="30" res="CPU" />
                    <CompRow name="XGBoost" type="Classical ML" v1="0.90" v2="0.88" v3="0.94" t1="3.6 min" t2="0.10 s" fd="30" res="CPU" />
                    
                    <CompRow name="QSVM" type="Hybrid QML" typeColor="text-purple-500" v1="0.92" v2="0.91" v3="0.97" t1="6.8 min" t2="0.18 s" fd="8" res="Quantum" />
                    <CompRow name="Quantum Kernel" type="Hybrid QML" typeColor="text-purple-500" v1="0.90" v2="0.88" v3="0.94" t1="7.4 min" t2="0.20 s" fd="8" res="Quantum" />
                    <CompRow name="VQC" type="Hybrid QML" typeColor="text-purple-500" v1="0.88" v2="0.86" v3="0.92" t1="8.7 min" t2="0.24 s" fd="8" res="Quantum" />
                    <CompRow name="QNN" type="Hybrid QML" typeColor="text-purple-500" v1="0.91" v2="0.89" v3="0.95" t1="9.3 min" t2="0.28 s" fd="8" res="Quantum" />
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
                        <div className="text-[15px] font-extrabold text-slate-900">2.4 min</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Hybrid QML</div>
                        <div className="text-[15px] font-extrabold text-slate-900">8.7 min</div>
                      </div>
                    </div>
                  </div>
                  {/* Inference Time */}
                  <div className="border border-slate-100 rounded-[12px] p-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 mb-3"><Zap size={14} className="text-amber-500"/> Inference Time</div>
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
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">After Optimization</div>
                        <div className="text-[15px] font-extrabold text-slate-900">8</div>
                      </div>
                    </div>
                  </div>
                  {/* Quantum Resources */}
                  <div className="border border-slate-100 rounded-[12px] p-4 bg-purple-50/50 border-purple-100">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800 mb-3"><BrainCircuit size={14} className="text-purple-500"/> Quantum Resources</div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Qubits</div>
                        <div className="text-[14px] font-extrabold text-slate-900">8</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Circuit Depth</div>
                        <div className="text-[14px] font-extrabold text-slate-900">6</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Shots</div>
                        <div className="text-[14px] font-extrabold text-slate-900">1024</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold mb-0.5">Backend</div>
                        <div className="text-[12px] font-extrabold text-slate-900 mt-0.5">Simulator</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Summary */}
              <div className="md:col-span-1 bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col">
                <h3 className="text-[16px] font-bold text-slate-900 mb-5">Evaluation Summary</h3>
                <div className="space-y-4 flex-1">
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
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 text-emerald-500"><Check size={14}/></div>
                    <p className="text-[11px] text-slate-600 font-medium">Current experiment uses a simulator-based quantum backend.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="text-[12px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View Full Benchmark <ArrowRight size={14}/>
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

function MetricRow({ name, type, typeColor="text-blue-500", v1, v2, v3, v4, v5, v6, v7, highlight }: any) {
  return (
    <tr className={`border-b border-slate-50 last:border-0 ${highlight ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
      <td className="py-2.5 font-bold text-slate-800">{name}</td>
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

function CompRow({ name, type, typeColor="text-blue-500", v1, v2, v3, t1, t2, fd, res }: any) {
  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
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
      <div className="w-4 bg-blue-500 rounded-sm" style={{ height: `${(val - 90) * 10}px` }} />
    </div>
  )
}

function ChartGroup({ name, v1, v2, v3, v4 }: any) {
  return (
    <div className="flex flex-col items-center gap-2 relative z-10 w-full pl-6">
      <div className="flex items-end gap-1 h-[140px] w-full justify-center">
        <div className="w-4 bg-[#1e3a8a] rounded-t-sm relative group" style={{ height: `${v1}%` }} />
        <div className="w-4 bg-[#06b6d4] rounded-t-sm relative group" style={{ height: `${v2}%` }} />
        <div className="w-4 bg-[#8b5cf6] rounded-t-sm relative group" style={{ height: `${v3}%` }} />
        <div className="w-4 bg-[#f59e0b] rounded-t-sm relative group" style={{ height: `${v4}%` }} />
      </div>
      <div className="text-[10px] font-bold text-slate-500">{name}</div>
    </div>
  )
}
