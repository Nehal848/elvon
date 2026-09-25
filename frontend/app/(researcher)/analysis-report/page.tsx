"use client"

import React from "react"
import HospitalLayout from "@/components/hospital-layout"
import { 
  BarChart2, Shield, Activity, Target, BrainCircuit,
  Zap, Clock, Layers, ArrowRight, Check, FileText,
  AlertTriangle, CheckCircle2, ChevronDown, Database,
  Settings, ScatterChart, ShieldAlert, Cpu
} from "lucide-react"

export default function AnalysisReportPage() {
  return (
    <HospitalLayout 
      title="AI Interpretability" 
      subtitle="Understand experiment behavior, analyze features, and generate research-ready insights."
    >
      <div className="max-w-[1600px] space-y-6 pb-12">
        
        {/* Top Controls */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[13px] font-bold text-slate-700">Experiment</span>
          <div className="relative">
            <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-[13px] font-bold text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors appearance-none min-w-[280px]">
              <option>Breast Cancer — Classical vs QML</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[12px] font-bold border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Completed
          </div>
        </div>

        {/* Section 1: Model Analysis */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BarChart2 size={16} />
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">Model Analysis</h2>
          </div>
          <p className="text-[13px] text-slate-500 mb-6 pl-11">Interpret model behavior and investigate prediction errors.</p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pl-11">
            
            {/* Feature Importance */}
            <div className="border border-slate-100 rounded-[16px] p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2"><BarChart2 size={16} className="text-blue-500"/> Feature Importance <InfoIcon /></h3>
                  
                  <div className="relative">
                    <select className="bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-[11px] font-semibold text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors appearance-none">
                      <option>Selected Model: QSVM</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="space-y-3">
                <FeatureBar label="mean radius" val={80} valText="0.23" />
                <FeatureBar label="worst perimeter" val={68} valText="0.19" />
                <FeatureBar label="mean texture" val={50} valText="0.14" />
                <FeatureBar label="worst radius" val={42} valText="0.12" />
                <FeatureBar label="mean concavity" val={32} valText="0.09" />
                <FeatureBar label="radius error" val={25} valText="0.07" />
              </div>
              
              {/* X Axis */}
              <div className="flex justify-between mt-3 pl-[120px] pr-8 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2 mb-6">
                <span>0.00</span><span>0.05</span><span>0.10</span><span>0.15</span><span>0.20</span><span>0.25</span>
              </div>
              <div className="text-center text-[9px] font-bold text-slate-400 mb-6 pl-[120px]">Feature Importance</div>
              
              {/* Info Box */}
              <div className="bg-blue-50/70 rounded-[8px] p-3 flex items-start gap-2 border border-blue-100/50">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <InfoIcon />
                </div>
                <div>
                  <div className="font-bold text-blue-900 text-[11px] mb-0.5">Model-specific explanation</div>
                  <div className="text-slate-500 text-[10px] font-medium leading-tight">Feature importance values are model-specific and may vary based on the algorithm used (e.g., SHAP for tree models).</div>
                </div>
              </div>
            </div>

            {/* Prediction Error Analysis */}
            <div className="border border-slate-100 rounded-[16px] p-5">
              <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2 mb-6"><Activity size={16} className="text-blue-500"/> Prediction Error Analysis</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-500 flex items-center justify-center"><AlertTriangle size={12}/></div>
                    <span className="text-[12px] font-bold text-slate-600">False Positives</span>
                  </div>
                  <div className="text-[28px] font-extrabold text-slate-900 pl-8">8</div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center"><AlertTriangle size={12}/></div>
                    <span className="text-[12px] font-bold text-slate-600">False Negatives</span>
                  </div>
                  <div className="text-[28px] font-extrabold text-slate-900 pl-8">5</div>
                </div>
                <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-center bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={12} strokeWidth={3}/></div>
                    <span className="text-[12px] font-bold text-slate-600">Correct Predictions</span>
                  </div>
                  <div className="text-[28px] font-extrabold text-slate-900 pl-8">527</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 bg-rose-50/50 border border-rose-100/50 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-rose-600"><AlertTriangle size={14}/> False Positives</div>
                  <div className="text-[12px] font-bold text-slate-700">8 <span className="text-slate-400 font-medium">samples</span></div>
                </div>
                <div className="flex-1 bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-amber-600"><AlertTriangle size={14}/> False Negatives</div>
                  <div className="text-[12px] font-bold text-slate-700">5 <span className="text-slate-400 font-medium">samples</span></div>
                </div>
                <button className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 text-[12px] font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shrink-0">
                  View Samples <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Section 2: Data & Feature Analysis */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Database size={16} />
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">Data & Feature Analysis</h2>
          </div>
          <p className="text-[13px] text-slate-500 mb-6 pl-11">Explore data characteristics and the transformation of features used by the models.</p>

          <div className="pl-11 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            
            {/* Class Distribution */}
            <div className="lg:col-span-3">
              <h3 className="text-[13px] font-bold text-slate-900 mb-6">Class Distribution</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="93.7" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[16px] font-extrabold text-slate-900 leading-none">569</span>
                    <span className="text-[9px] font-bold text-slate-500">Samples</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between gap-4 items-center text-[11px] font-bold w-full">
                    <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"/> <span className="text-slate-700">Benign (357)</span></div>
                    <span className="text-slate-500">62.7%</span>
                  </div>
                  <div className="flex justify-between gap-4 items-center text-[11px] font-bold w-full">
                    <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"/> <span className="text-slate-700">Malignant (212)</span></div>
                    <span className="text-slate-500">37.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Transformation */}
            <div className="lg:col-span-5 px-6 border-x border-slate-100">
              <h3 className="text-[13px] font-bold text-slate-900 mb-6">Feature Transformation</h3>
              <div className="flex items-center justify-between h-24">
                <div className="flex-1 bg-[#f8fafc] border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[18px] font-extrabold text-slate-900">30</div>
                  <div className="text-[10px] font-bold text-slate-500">Original Features</div>
                </div>
                <div className="text-slate-300 mx-3"><ArrowRight size={16}/></div>
                <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[18px] font-extrabold text-slate-900">15</div>
                  <div className="text-[10px] font-bold text-blue-600">Selected Features</div>
                </div>
                <div className="text-slate-300 mx-3"><ArrowRight size={16}/></div>
                <div className="flex-1 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[18px] font-extrabold text-slate-900">8</div>
                  <div className="text-[10px] font-bold text-emerald-600 text-center leading-tight">Quantum-Ready<br/>Features</div>
                </div>
              </div>
            </div>

            {/* Dimensionality Reduction */}
            <div className="lg:col-span-4 pl-2">
              <h3 className="text-[13px] font-bold text-slate-900 mb-4">Dimensionality Reduction</h3>
              <div className="flex items-center gap-6">
                
                {/* Simulated Scatter Plot */}
                <div className="flex-1 h-32 relative border-l border-b border-slate-200">
                  <div className="absolute inset-0 flex flex-col justify-between py-1 text-[8px] font-semibold text-slate-400 -left-4">
                    <span>3</span><span>2</span><span>1</span><span>0</span><span>-1</span><span>-2</span><span>-3</span>
                  </div>
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-semibold text-slate-400">PCA 2</div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] font-semibold text-slate-400 -mb-4">
                    <span>-3</span><span>-2</span><span>-1</span><span>0</span><span>1</span><span>2</span><span>3</span>
                  </div>
                  <div className="absolute -bottom-8 left-0 right-0 text-center text-[9px] font-semibold text-slate-400">PCA 1</div>
                  
                  {/* Dots */}
                  <div className="absolute inset-0 overflow-hidden opacity-80">
                    <ScatterDots color="#3b82f6" count={80} cx={35} cy={40} spread={15} />
                    <ScatterDots color="#a855f7" count={60} cx={75} cy={50} spread={15} />
                  </div>
                </div>

                <div className="w-32 space-y-4">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6]"/> Benign
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#a855f7]"/> Malignant
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">PCA Components</div>
                    <div className="text-[16px] font-extrabold text-slate-900">8</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Variance Retained</div>
                    <div className="text-[16px] font-extrabold text-slate-900">92.4%</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pl-11 flex items-center gap-4 mt-10">
            <div className="flex items-center gap-8 bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-100">
              <button className="flex items-center gap-2 text-[12px] font-bold text-blue-600"><Settings size={14}/> Feature selection</button>
              <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800"><Activity size={14}/> Correlation analysis</button>
              <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800"><ScatterChart size={14} className="scale-x-[-1]"/> PCA</button>
              <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800"><BarChart2 size={14}/> Class distribution</button>
            </div>
          </div>

        </div>

        {/* Sections 3 & 4 Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Section 3: Quantum Analysis */}
          <div className="xl:col-span-8 bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <AtomIcon />
              </div>
              <h2 className="text-[18px] font-bold text-slate-900">Quantum Analysis</h2>
            </div>
            <p className="text-[13px] text-slate-500 mb-8 pl-11">Review the quantum configuration and computational resources used in the experiment.</p>
            
            <div className="pl-11 grid grid-cols-6 gap-4 mb-8">
              <div>
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Quantum Model</div>
                <div className="text-[14px] font-extrabold text-slate-900">QSVM</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Encoding</div>
                <div className="text-[14px] font-extrabold text-slate-900">Angle Encoding</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Qubits</div>
                <div className="text-[14px] font-extrabold text-slate-900">8</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Circuit Depth</div>
                <div className="text-[14px] font-extrabold text-slate-900">6</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Gate Count</div>
                <div className="text-[14px] font-extrabold text-slate-900">42</div>
              </div>
              <div>
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Shots</div>
                <div className="text-[14px] font-extrabold text-slate-900">1024</div>
              </div>
              <div className="col-span-2 mt-2">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Backend</div>
                <div className="text-[14px] font-extrabold text-slate-900">Simulator</div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5">Simulator-based</div>
              </div>
            </div>

            <div className="pl-11 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PipeCard icon={<Layers size={14} className="text-emerald-500"/>} bg="bg-emerald-50" label="Feature Dimensions" val="30" />
                <ArrowRight size={14} className="text-slate-300" />
                <PipeCard icon={<AtomIcon small />} bg="bg-blue-50" label="Qubits" val="8" />
                <ArrowRight size={14} className="text-slate-300" />
                <PipeCard icon={<Cpu size={14} className="text-purple-500"/>} bg="bg-purple-50" label="Circuit Depth" val="6" />
                <ArrowRight size={14} className="text-slate-300" />
                <PipeCard icon={<Zap size={14} className="text-blue-500"/>} bg="bg-blue-50" label="Shots" val="1024" />
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 w-48">
                <div className="text-[10px] font-semibold text-slate-500 mb-0.5">Noise / Error Analysis</div>
                <div className="text-[11px] font-bold text-slate-700">Not available — <span className="font-medium text-slate-400">simulator execution</span></div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Research Findings */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-blue-500"><LightbulbIcon /></div>
                  <h3 className="text-[15px] font-bold text-slate-900">Research Findings</h3>
                </div>
                <span className="text-[9px] font-bold text-slate-400">Generated from experiment results</span>
              </div>
              <div className="space-y-4">
                <Finding icon={<Database size={14}/>} text="Feature selection reduced the input space from 30 to 15 features before quantum encoding." />
                <Finding icon={<ScatterChart size={14}/>} text="PCA further reduced the representation to 8 quantum-ready dimensions." />
                <Finding icon={<Activity size={14}/>} text="QSVM performance remained consistent across the held-out test set and cross-validation." />
                <Finding icon={<AtomIcon small />} text="Quantum execution was performed using a simulator with 8 qubits and 1024 shots." />
              </div>
            </div>

            {/* Evaluation Summary */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-500"><FileText size={16}/></div>
                <h3 className="text-[15px] font-bold text-slate-900">Evaluation Summary</h3>
              </div>
              <div className="space-y-3">
                <EvalCheck text="Model performance was evaluated on a held-out test set." />
                <EvalCheck text="Cross-validation was used to assess performance consistency." />
                <EvalCheck text="Classical ML and hybrid QML approaches were benchmarked using common criteria." />
                <EvalCheck text="Computational cost and resource requirements are reported alongside predictive performance." />
                <EvalCheck text="Quantum experiments currently use a simulator-based backend." />
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: Research Report */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <h2 className="text-[18px] font-bold text-slate-900">Research Report</h2>
            </div>
            <p className="text-[13px] text-slate-500 mb-6 pl-11">Generate a structured research report from this experiment.</p>
            
            <div className="pl-11 mb-2 text-[12px] font-bold text-slate-900">Report Outline</div>
            <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3">
              <OutlineItem num="01" text="Experiment Overview" />
              <OutlineItem num="04" text="Classical & Quantum Methods" />
              <OutlineItem num="07" text="Model & Quantum Analysis" />
              <OutlineItem num="02" text="Dataset & Methodology" />
              <OutlineItem num="05" text="Evaluation & Validation" />
              <OutlineItem num="08" text="Limitations & Future Work" />
              <OutlineItem num="03" text="Preprocessing & Feature Analysis" />
              <OutlineItem num="06" text="Benchmark Findings" />
              <OutlineItem num="09" text="Conclusion" />
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] py-3 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors">
              <PlusSquareIcon /> Generate Report
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border border-blue-200 text-blue-600 font-bold text-[11px] py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
                <FileIcon /> Save Analysis
              </button>
              <button className="bg-white border border-blue-200 text-blue-600 font-bold text-[11px] py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
                <FilePdfIcon /> Export PDF
              </button>
            </div>
          </div>
        </div>

      </div>
      </div>
    </HospitalLayout>
  )
}

function FeatureBar({ label, val, valText }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[120px] text-[11px] font-bold text-slate-500 text-right truncate">{label}</div>
      <div className="flex-1 h-3 rounded-full bg-slate-100 flex items-center">
        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${val}%` }} />
      </div>
      <div className="w-8 text-[11px] font-bold text-slate-700">{valText}</div>
    </div>
  )
}

function ScatterDots({ color, count, cx, cy, spread }: any) {
  const dots = []
  for (let i = 0; i < count; i++) {
    // Basic normal distribution approx
    const r1 = Math.random()
    const r2 = Math.random()
    const x = cx + (Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2)) * spread
    const y = cy + (Math.sqrt(-2 * Math.log(r1)) * Math.sin(2 * Math.PI * r2)) * spread
    
    // Keep in bounds 0-100
    if (x > 0 && x < 100 && y > 0 && y < 100) {
      dots.push(<circle key={i} cx={`${x}%`} cy={`${y}%`} r="1.5" fill={color} opacity="0.7" />)
    }
  }
  return <svg className="absolute inset-0 w-full h-full">{dots}</svg>
}

function PipeCard({ icon, bg, label, val }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-[12px] p-3 flex items-center gap-3 w-40 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[9px] font-bold text-slate-500 mb-0.5">{label}</div>
        <div className="text-[14px] font-extrabold text-slate-900 leading-none">{val}</div>
      </div>
    </div>
  )
}

function Finding({ icon, text }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-[12px] font-medium text-slate-600 leading-relaxed pt-1.5">{text}</p>
    </div>
  )
}

function EvalCheck({ text }: any) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-emerald-500"><Check size={14}/></div>
      <p className="text-[11px] text-slate-600 font-medium">{text}</p>
    </div>
  )
}

function OutlineItem({ num, text }: any) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">
        {num}
      </div>
      <span className="text-[12px] font-medium text-slate-600">{text}</span>
    </div>
  )
}

// Custom Icons
function InfoIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
}
function AtomIcon({ small = false }: { small?: boolean }) {
  const sz = small ? 14 : 16
  return <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .11 1.89 1.18 1.18 0 0 1-.14 1.74 1.65 1.65 0 0 0-.9 1.92 1.18 1.18 0 0 1-1.28 1.28 1.65 1.65 0 0 0-1.92.9 1.18 1.18 0 0 1-1.74.14 1.65 1.65 0 0 0-1.89-.11 1.18 1.18 0 0 1-1.89.11 1.65 1.65 0 0 0-1.74-.14 1.18 1.18 0 0 1-1.92-.9 1.65 1.65 0 0 0-1.28-1.28 1.18 1.18 0 0 1-.14-1.74 1.65 1.65 0 0 0 .11-1.89 1.18 1.18 0 0 1 .14-1.74 1.65 1.65 0 0 0 .9-1.92 1.18 1.18 0 0 1 1.28-1.28 1.65 1.65 0 0 0 1.92-.9 1.18 1.18 0 0 1 1.74-.14 1.65 1.65 0 0 0 1.89.11 1.18 1.18 0 0 1 1.89-.11 1.65 1.65 0 0 0 1.74.14 1.18 1.18 0 0 1 1.92.9 1.65 1.65 0 0 0 1.28 1.28 1.18 1.18 0 0 1 .14 1.74 1.65 1.65 0 0 0-.11 1.89z"></path></svg>
}
function LightbulbIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
}
function PlusSquareIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
}
function FileIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
}
function FilePdfIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
}
