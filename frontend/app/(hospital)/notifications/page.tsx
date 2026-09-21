"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import { 
  CheckCircle2, Activity, FileText, AlertTriangle, 
  FileWarning, BrainCircuit, Bell, MoreVertical, ArrowRight, Loader2
} from "lucide-react"

interface NotificationEvent {
  id: string
  type: "Analysis" | "Reports" | "Alerts" | "System"
  title: string
  message: string
  time: string
  unread: boolean
  actionType: string
  actionLabel: string
}

function timeAgo(dateString: string) {
  if (!dateString) return "Just now"
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "Yesterday"
  return `${diffInDays} days ago`
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [notifications, setNotifications] = useState<NotificationEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  const filters = ["All", "Analysis", "Reports", "Alerts", "System"]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resReports, resUploads, resAlerts, resIntegrations] = await Promise.all([
        fetch("/api/reports").catch(() => null),
        fetch("/api/lab/uploads").catch(() => null),
        fetch("/api/alerts").catch(() => null),
        fetch("/api/hospital/integrations").catch(() => null)
      ])

      const events: NotificationEvent[] = []
      
      // 1. Reports
      if (resReports && resReports.ok) {
        const data = await resReports.json()
        ;(data.reports || []).forEach((r: any) => {
          if (r.status === "completed") {
            events.push({
              id: `rpt-${r.id}`,
              type: "Reports",
              title: "Report Ready",
              message: `The analysis report for ${r.patient_name || 'a patient'} has been generated successfully.`,
              time: r.timestamp || new Date().toISOString(),
              unread: true, // mock unread
              actionType: "outline-blue",
              actionLabel: "View Report"
            })
          }
        })
      }

      // 2. Uploads (Analysis)
      if (resUploads && resUploads.ok) {
        const data = await resUploads.json()
        ;(data.uploads || []).forEach((u: any) => {
          if (u.status === "analyzed") {
            events.push({
              id: `upl-${u.id}`,
              type: "Analysis",
              title: "Analysis Completed",
              message: `${u.patient_name || 'Patient'}'s ${u.source || 'lab'} analysis is ready to review.`,
              time: u.timestamp || new Date().toISOString(),
              unread: true,
              actionType: "primary",
              actionLabel: "View Analysis"
            })
          } else if (u.status === "failed") {
            events.push({
              id: `upl-${u.id}`,
              type: "Analysis",
              title: "Analysis Failed",
              message: `The ${u.source || 'lab'} upload for ${u.patient_name || 'Patient'} could not be processed.`,
              time: u.timestamp || new Date().toISOString(),
              unread: true,
              actionType: "outline-red",
              actionLabel: "Review"
            })
          }
        })
      }

      // 3. Alerts
      if (resAlerts && resAlerts.ok) {
        const data = await resAlerts.json()
        ;(data.alerts || []).forEach((a: any, idx: number) => {
          events.push({
            id: `alt-${a.patient_id}-${idx}`,
            type: "Alerts",
            title: a.severity === 'critical' ? "Critical Alert" : "High Risk Alert",
            message: `${a.patient_name} has a high risk score (${a.risk_score}) for ${a.condition}.`,
            time: new Date(Date.now() - idx * 3600000).toISOString(), // mock recent times
            unread: true,
            actionType: "outline-red",
            actionLabel: "View Patient"
          })
        })
      }

      // 4. System Integrations
      if (resIntegrations && resIntegrations.ok) {
        const data = await resIntegrations.json()
        ;(data.integrations || []).forEach((i: any) => {
          if (i.health !== "healthy") {
            events.push({
              id: `sys-${i.system.replace(/\s/g,'')}`,
              type: "System",
              title: "System Alert",
              message: `The ${i.system} is currently ${i.health} (${i.status}).`,
              time: i.last_check || new Date().toISOString(),
              unread: true,
              actionType: "outline-amber",
              actionLabel: "View Details"
            })
          }
        })
      }

      // Sort by time desc
      events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      
      setNotifications(events)
    } catch (error) {
      console.error("Failed to load notifications", error)
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const filteredNotifications = activeFilter === "All" 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter)

  return (
    <HospitalLayout 
      title="Notifications" 
      subtitle="Stay updated on your patient analyses and reports."
    >
      <div className="max-w-[1400px] space-y-6 pb-12">
        
        {/* Filters and Actions */}
        <div className="bg-white rounded-[20px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                  activeFilter === filter 
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <button 
            onClick={markAllRead}
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-[13px] px-4 py-2 rounded-full hover:bg-blue-50 transition-colors"
          >
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-slate-400" size={24} />
              <p className="text-slate-500 font-medium">Aggregating notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Bell size={28} className="text-blue-500" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">No new notifications</h3>
              <p className="text-[14px] text-slate-500 font-medium">You're all caught up. Important updates will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredNotifications.map((notif) => {
                
                // Determine icon based on type and title
                let icon = <Bell size={20} className="text-blue-500" />
                let iconBg = "bg-blue-50"
                
                if (notif.type === "Analysis") {
                  if (notif.title.includes("Failed")) {
                    icon = <AlertTriangle size={20} className="text-red-500" />; iconBg = "bg-red-50"
                  } else {
                    icon = <Activity size={20} className="text-emerald-500" />; iconBg = "bg-emerald-50"
                  }
                } else if (notif.type === "Reports") {
                  icon = <FileText size={20} className="text-blue-500" />; iconBg = "bg-blue-50"
                } else if (notif.type === "Alerts") {
                  icon = <AlertTriangle size={20} className="text-red-500" />; iconBg = "bg-red-50"
                } else if (notif.type === "System") {
                  icon = <FileWarning size={20} className="text-amber-500" />; iconBg = "bg-amber-50"
                }

                return (
                  <NotificationRow 
                    key={notif.id}
                    icon={icon}
                    iconBg={iconBg}
                    title={notif.title}
                    unread={notif.unread}
                    message={notif.message}
                    time={timeAgo(notif.time)}
                    actionType={notif.actionType}
                    actionLabel={notif.actionLabel}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 pb-2 flex items-center justify-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span>ELVON • Clinical Intelligence</span>
          <span className="opacity-50">|</span>
          <span>Secure • Explainable • Reliable</span>
        </div>

      </div>
    </HospitalLayout>
  )
}

function NotificationRow({ icon, iconBg, title, unread, message, time, actionType, actionLabel }: any) {
  
  const getActionStyle = () => {
    switch (actionType) {
      case "primary":
        return "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/20 border-transparent hover:from-blue-600 hover:to-cyan-500"
      case "outline-blue":
        return "bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
      case "outline-red":
        return "bg-white border-red-200 text-red-500 hover:bg-red-50"
      case "outline-amber":
        return "bg-white border-amber-300 text-amber-600 hover:bg-amber-50"
      default:
        return "bg-white border-slate-200 text-slate-600"
    }
  }

  const getTargetHref = () => {
    if (actionLabel.toLowerCase().includes("report")) return "/reports"
    if (actionLabel.toLowerCase().includes("analysis")) return "/analysis"
    if (actionLabel.toLowerCase().includes("alert")) return "/patients"
    return "/version"
  }

  return (
    <div className={`p-5 flex flex-col md:flex-row md:items-center gap-5 hover:bg-slate-50/50 transition-colors ${unread ? 'bg-[#fcfdff]' : ''}`}>
      
      {/* Icon */}
      <div className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center flex-shrink-0 ${iconBg}`}>
        {icon}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className={`md:hidden w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            {React.cloneElement(icon, { size: 14 })}
          </div>
          <h4 className="text-[15px] font-bold text-slate-900">{title}</h4>
          {unread && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Unread</span>
            </div>
          )}
        </div>
        <p className="text-[13px] font-medium text-slate-500 md:truncate">{message}</p>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-4 flex-shrink-0 justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">
        <span className="text-[12px] font-semibold text-slate-400">{time}</span>
        
        <div className="flex items-center gap-2">
          <Link
            href={getTargetHref()}
            className={`px-4 py-2 md:px-5 md:py-2 rounded-full text-[12px] font-bold border transition-all flex items-center gap-1.5 no-underline ${getActionStyle()}`}
          >
            {actionLabel} <ArrowRight size={14} />
          </Link>
          
          <button className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 hidden md:flex">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
      
    </div>
  )
}
