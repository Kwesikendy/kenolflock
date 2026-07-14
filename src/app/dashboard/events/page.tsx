"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, Plus, Filter, Loader2, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { ChurchEvent, EventCategory } from "@/types";
import { getEvents, addEvent, subscribeToEvents } from "@/lib/db-service";
import { useAuth } from "@/context/AuthContext";

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00 AM");
  const [location, setLocation] = useState("Main Sanctuary");
  const [category, setCategory] = useState<EventCategory>("Service");
  const [expectedAttendance, setExpectedAttendance] = useState("500");

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToEvents((data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;
    setSubmitting(true);
    setError(null);

    try {
      const newEvent = await addEvent({
        title,
        description,
        date,
        time,
        location,
        category,
        expectedAttendance: Number(expectedAttendance) || 200,
        status: "Upcoming",
        createdAt: new Date().toISOString().slice(0, 10),
      });

      setEvents([newEvent, ...events]);
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setDate("");
    } catch (err: any) {
      setError("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvents = selectedCategory === "All" 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  const totalExpected = events.reduce((sum, evt) => sum + (Number(evt.expectedAttendance) || 0), 0);
  const canSchedule = user?.role === "Admin" || user?.role === "Pastor";

  return (
    <div className="animate-fade-in flex-col gap-8" style={{ display: "flex" }}>
      {/* Top Banner Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Church Events & Calendar Hub</h1>
          <p className="text-xs text-muted mt-1">Schedule worship services, coordinate youth conventions, and track attendance projections</p>
        </div>
        {canSchedule && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-primary flex items-center gap-2 font-bold shadow-md"
            style={{ borderRadius: "14px", padding: "0.8rem 1.6rem" }}
          >
            <Plus size={18} /> Schedule New Gathering
          </button>
        )}
      </div>

      {/* Exquisite Multi-Dimensional Summary Metric Widgets */}
      <div className="grid-3 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
        <div className="metric-card animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Total Scheduled Gatherings</span>
            <div className="icon-badge icon-badge-blue">
              <Calendar size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black leading-tight" style={{ fontSize: "2.35rem", color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
              {events.length} Events
            </p>
            <span className="text-xs text-muted font-medium mt-1 block">Active worship & ministry programs</span>
            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted mb-1.5">
                <span>Monthly Target (6 Gatherings)</span>
                <span style={{ color: "#60A5FA" }}>100% Active</span>
              </div>
              <div style={{ width: "100%", height: "6px", borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "10px", background: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card animate-fade-in" style={{ animationDelay: "60ms" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Projected Total Attendance</span>
            <div className="icon-badge icon-badge-green">
              <Users size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-black leading-tight" style={{ fontSize: "2.35rem", color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
              {totalExpected.toLocaleString()}
            </p>
            <span className="text-xs text-muted font-medium mt-1 block">Expected participants across events</span>
            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted mb-1.5">
                <span>Sanctuary & Online Goal (4,000)</span>
                <span style={{ color: "#34D399" }}>78% Filled</span>
              </div>
              <div style={{ width: "100%", height: "6px", borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                <div style={{ width: "78%", height: "100%", borderRadius: "10px", background: "linear-gradient(90deg, #10B981 0%, #34D399 100%)" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card animate-fade-in" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Next Major Gathering</span>
            <div className="icon-badge icon-badge-gold">
              <Sparkles size={20} />
            </div>
          </div>
          <div>
            <p className="text-lg font-black leading-tight truncate" style={{ fontSize: "1.45rem", color: "var(--text-primary)", marginTop: "0.4rem" }}>
              {events.length > 0 ? events[0].title : "Miracle Service"}
            </p>
            <span className="text-xs text-muted font-medium mt-1 block">{events.length > 0 ? `${events[0].date} @ ${events[0].time}` : "This Sunday"}</span>
            <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted mb-1.5">
                <span>Event Status Verification</span>
                <span style={{ color: "#FACC15" }}>Live Confirmed</span>
              </div>
              <div style={{ width: "100%", height: "6px", borderRadius: "10px", backgroundColor: "var(--bg-tertiary)", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "10px", background: "linear-gradient(90deg, #F59E0B 0%, #FACC15 100%)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacious Floating Glass Filter Toolbar */}
      <div className="card" style={{ padding: "1.25rem 1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem", borderRadius: "20px" }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted flex items-center gap-1.5 mr-3 font-bold uppercase tracking-wider">
            <Filter size={15} className="text-primary" /> Filter Ministry Group:
          </span>
          {["All", "Service", "Youth", "Outreach", "Conference"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn text-xs font-bold ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.5rem 1.1rem", borderRadius: "14px" }}
            >
              {cat === "All" ? "All Gatherings" : cat}
            </button>
          ))}
        </div>
        <span className="badge badge-info font-bold text-xs" style={{ padding: "0.45rem 0.95rem", borderRadius: "12px" }}>
          Showing {filteredEvents.length} of {events.length} Events
        </span>
      </div>

      {/* Wide Anti-Collision Horizontal Event Slabs */}
      {loading ? (
        <div className="card flex items-center justify-center py-20 text-muted gap-3">
          <Loader2 size={28} className="animate-spin text-primary" style={{ color: "var(--brand-primary)" }} />
          <span className="font-bold text-sm">Synchronizing church gatherings from cloud database...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card text-center py-16 flex-col items-center gap-4" style={{ display: "flex", borderRadius: "24px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "18px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <Calendar size={32} className="text-muted opacity-60" />
          </div>
          <p className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>No events scheduled in the "{selectedCategory}" category</p>
          <p className="text-xs text-muted max-w-md mx-auto">Click the schedule button at the top right to create a new worship service, convention, or community outreach.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "2rem" }}>
          {filteredEvents.map((evt, idx) => {
            const dateObj = new Date(evt.date);
            const monthStr = isNaN(dateObj.getTime()) ? "JUL" : dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
            const dayNum = isNaN(dateObj.getTime()) ? "12" : dateObj.getDate();
            const capacityPercent = Math.min(100, Math.round((Number(evt.expectedAttendance) / 2000) * 100)) || 65;

            return (
              <div key={evt.id} className="card card-hover flex-col justify-between animate-fade-in" style={{ display: "flex", padding: "1.75rem 2rem", borderRadius: "24px", animationDelay: `${idx * 50}ms` }}>
                {/* Top Section: Minimalist Date Box & Title */}
                <div className="flex items-start gap-4">
                  {/* Minimalist Date Pill */}
                  <div style={{
                    width: "60px",
                    height: "64px",
                    borderRadius: "16px",
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--brand-primary)" }}>{monthStr}</span>
                    <span className="text-xl font-black" style={{ color: "var(--text-primary)", lineHeight: "1.1" }}>{dayNum}</span>
                  </div>

                  {/* Clean Title & Single Metadata Line */}
                  <div className="flex-col gap-1" style={{ display: "flex", flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: "var(--brand-primary)" }}>{evt.category}</span>
                      <span className="badge badge-success text-[11px] font-bold px-2.5 py-0.5" style={{ borderRadius: "8px" }}>
                        {evt.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-black leading-snug" style={{ color: "var(--text-primary)" }}>
                      {evt.title}
                    </h3>
                    {/* Combined Time & Location on One Calm Line */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock size={13} style={{ color: "var(--brand-primary)" }} /> {evt.time}
                      </span>
                      <span className="opacity-40">•</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin size={13} style={{ color: "var(--brand-primary)" }} /> {evt.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Minimalist Description */}
                <p className="text-xs text-muted leading-relaxed mt-3 pl-[76px]" style={{ lineClamp: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {evt.description || "Join Rev. Kenol and leadership for this gathering of worship and biblical teaching."}
                </p>

                {/* Clean, Quiet Footer Bar */}
                <div className="flex items-center justify-between mt-4 pt-3 pl-[76px]" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Users size={14} style={{ color: "var(--brand-primary)" }} />
                    <strong style={{ color: "var(--text-primary)" }}>{Number(evt.expectedAttendance).toLocaleString()}</strong> expected
                  </span>
                  <button className="btn btn-secondary text-xs font-bold py-1.5 px-3.5" style={{ borderRadius: "10px" }}>
                    Manage →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Event Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1rem"
        }}>
          <div className="card animate-fade-in flex-col gap-5" style={{ width: "100%", maxWidth: "540px", padding: "2rem", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="text-primary" size={22} /> Schedule New Church Gathering
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-primary font-bold text-lg">
                &times;
              </button>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="flex-col gap-4" style={{ display: "flex" }}>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Miracle & Praise Convention"
                  className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="grid-2 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                    style={{ width: "100%" }}
                  >
                    <option value="Service">Worship Service</option>
                    <option value="Conference">Special Conference</option>
                    <option value="Outreach">Community Outreach</option>
                    <option value="Youth">Youth & Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className="grid-2 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Expected Attendance</label>
                  <input
                    type="number"
                    value={expectedAttendance}
                    onChange={(e) => setExpectedAttendance(e.target.value)}
                    placeholder="500"
                    className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Sanctuary / Online Stream"
                  className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                  style={{ width: "100%" }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Event Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize key speakers, schedule highlights, or special instructions..."
                  className="w-full p-2.5 rounded-lg text-sm bg-background border border-border focus:border-primary focus:outline-none"
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary text-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving Event...
                    </>
                  ) : (
                    "Schedule & Publish Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
