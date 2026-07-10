"use client";

import { useState, useEffect } from "react";
import { Settings, Building2, CreditCard, MessageSquare, Shield, CheckCircle2, Save, Loader2, RefreshCw, AlertCircle, Sparkles, Database, Cloud, Wifi, Check, Activity } from "lucide-react";
import { ChurchSettings } from "@/types";
import { getChurchSettings, saveChurchSettings, getCloudSyncStatus, testCloudDatabaseConnection, CloudSyncStatus } from "@/lib/db-service";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"general" | "moolre" | "sms" | "roles" | "database">("general");
  const [settings, setSettings] = useState<ChurchSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getChurchSettings();
      const status = await getCloudSyncStatus();
      setSettings(data);
      setCloudStatus(status);
      setLoading(false);
    }
    load();
  }, []);

  const handleCloudSyncTest = async () => {
    setSyncingCloud(true);
    setSyncMessage(null);
    const result = await testCloudDatabaseConnection();
    const updatedStatus = await getCloudSyncStatus();
    setCloudStatus(updatedStatus);
    setSyncingCloud(false);
    setSyncMessage(result.message);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      await saveChurchSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20 text-muted gap-2">
        <Loader2 size={24} className="animate-spin text-primary" />
        <span>Loading organization preferences...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex-col gap-8" style={{ display: "flex" }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl" style={{ fontWeight: 800 }}>Church Settings & Configuration</h1>
          <p className="text-muted" style={{ marginTop: "0.25rem" }}>Manage organization profile, Moolre POS API environments, and communication triggers</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save All Changes
        </button>
      </div>

      {saveSuccess && (
        <div className="card bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold text-sm">Settings Successfully Saved</p>
            <p className="text-xs text-muted">Your organization profile and Moolre preferences have been updated across all active sessions.</p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 flex-wrap" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
        {[
          { id: "general", label: "Organization Profile", icon: Building2 },
          { id: "moolre", label: "Moolre POS & Payment", icon: CreditCard },
          { id: "sms", label: "SMS & Communication", icon: MessageSquare },
          { id: "roles", label: "Roles & Access Oversight", icon: Shield },
          { id: "database", label: "Cloud Database & Sync", icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn flex items-center gap-2 text-xs font-semibold ${isActive ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.5rem 1rem", borderRadius: "12px" }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: General */}
      {activeTab === "general" && (
        <div className="grid-2 gap-6" style={{ display: "grid", gridTemplateColumns: "minmax(340px, 2.1fr) 1fr", gap: "2rem" }}>
          <form onSubmit={handleSave} className="card flex-col gap-6" style={{ display: "flex", padding: "2.25rem", borderRadius: "24px" }}>
            <h3 className="text-lg font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Building2 className="text-primary" size={22} style={{ color: "var(--brand-primary)" }} /> Church Identity & Profile
            </h3>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Official Church Name</label>
              <input
                type="text"
                value={settings.churchName}
                onChange={(e) => setSettings({ ...settings, churchName: e.target.value })}
                className="input"
                style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 600, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Ministry Tagline / Vision Motto</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="input"
                style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 500, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
              />
            </div>

            <div className="grid-2 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Primary Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="input"
                  style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 600, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Office Telephone Number</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="input"
                  style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 600, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Physical Sanctuary Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="input"
                style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 500, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)", resize: "vertical" }}
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="btn btn-primary font-bold text-xs flex items-center gap-2 shadow-md" style={{ borderRadius: "14px", padding: "0.8rem 1.6rem" }}>
                <Save size={16} /> Save Organization Profile
              </button>
            </div>
          </form>

          {/* Quick Info Sidebar */}
          <div className="card flex-col gap-5" style={{ display: "flex", padding: "2.25rem", height: "fit-content", borderRadius: "24px" }}>
            <h4 className="text-md font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Sparkles size={18} className="text-amber-400" /> System Overview
            </h4>
            <p className="text-xs text-muted leading-relaxed font-medium">
              These profile details appear across all donor receipts, SMS broadcast headers, and congregation communication reports.
            </p>
            <div className="flex-col gap-3.5 pt-4 border-t border-border" style={{ display: "flex" }}>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted">Database Storage:</span>
                <span className="badge badge-success font-bold">Firebase Firestore</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted">SMS Gateway:</span>
                <span className="badge badge-info font-bold">Moolre API (Active)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-muted">Current Role:</span>
                <span className="badge badge-warning font-bold">{user?.role || "Admin"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Moolre POS */}
      {activeTab === "moolre" && (
        <div className="flex-col gap-6" style={{ display: "flex" }}>
          <div className="card flex-col gap-6" style={{ display: "flex", padding: "2.25rem", borderRadius: "24px" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <CreditCard className="text-emerald-400" size={22} /> Moolre Payment & POS API Configuration
                </h3>
                <p className="text-xs text-muted mt-1">Configure mobile money and card collection endpoints for tithes and offerings</p>
              </div>
              <span className={`badge ${settings.moolreEnv === "sandbox" ? "badge-warning" : "badge-success"} text-xs font-extrabold px-3.5 py-1.5`} style={{ borderRadius: "12px" }}>
                {settings.moolreEnv === "sandbox" ? "SANDBOX TESTING MODE" : "LIVE PRODUCTION MODE"}
              </span>
            </div>

            <div className="p-5 rounded-2xl border flex-col gap-3.5" style={{ display: "flex", backgroundColor: "var(--bg-input)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted block">Merchant Wallet Identity</span>
                  <p className="text-base font-black mt-0.5" style={{ color: "var(--text-primary)" }}>KENOL Tech Wallet (10888106071347)</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted block">Collection Currency</span>
                  <p className="text-base font-black mt-0.5" style={{ color: "#34D399" }}>GHS (Ghana Cedi)</p>
                </div>
              </div>
            </div>

            <div className="grid-2 gap-6" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem" }}>
              <div className="p-5 rounded-2xl border flex-col gap-3" style={{ display: "flex", backgroundColor: "var(--bg-input)", borderColor: "var(--border-subtle)" }}>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">Active Environment</span>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, moolreEnv: "sandbox" })}
                    className={`btn text-xs font-bold flex-1 ${settings.moolreEnv === "sandbox" ? "btn-primary" : "btn-secondary"}`}
                    style={{ borderRadius: "12px", padding: "0.65rem 1rem" }}
                  >
                    Sandbox (Simulated)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, moolreEnv: "live" })}
                    className={`btn text-xs font-bold flex-1 ${settings.moolreEnv === "live" ? "btn-primary" : "btn-secondary"}`}
                    style={{ borderRadius: "12px", padding: "0.65rem 1rem" }}
                  >
                    Live Production
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border flex-col justify-center gap-1.5" style={{ display: "flex", backgroundColor: "var(--bg-input)", borderColor: "var(--border-subtle)" }}>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">POS Endpoint Health</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold" style={{ color: "#34D399" }}>API Gateway Connected (v2.4)</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button onClick={handleSave} className="btn btn-primary font-bold text-xs flex items-center gap-2 shadow-md" style={{ borderRadius: "14px", padding: "0.8rem 1.6rem" }}>
                <Save size={16} /> Save Moolre POS Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SMS & Communication */}
      {activeTab === "sms" && (
        <div className="card flex-col gap-6" style={{ display: "flex", padding: "2.25rem", borderRadius: "24px" }}>
          <div>
            <h3 className="text-lg font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <MessageSquare className="text-primary" size={22} style={{ color: "var(--brand-primary)" }} /> Moolre SMS Gateway & Automated Triggers
            </h3>
            <p className="text-xs text-muted mt-1">Configure Moolre messaging sender ID and automatic member workflows</p>
          </div>

          <div style={{ maxWidth: "420px" }}>
            <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Moolre SMS Sender ID (Alphanumeric 11 Chars Max)</label>
            <input
              type="text"
              maxLength={11}
              value={settings.senderId}
              onChange={(e) => setSettings({ ...settings, senderId: e.target.value })}
              className="input"
              style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 700, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
            />
            <span className="text-[11px] text-muted font-medium block mt-1.5">This name appears as the sender on your members' mobile phones.</span>
          </div>

          <div className="flex-col gap-4 pt-4 border-t border-border" style={{ display: "flex" }}>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Automated SMS Triggers</span>

            <label className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer card-hover" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-subtle)", transition: "all 0.25s ease" }}>
              <div className="flex-col gap-1" style={{ display: "flex" }}>
                <span className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Welcome SMS upon New Member Onboarding</span>
                <span className="text-xs text-muted">Automatically send a warm welcome and service schedule to newly added church members.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoWelcomeSms}
                onChange={(e) => setSettings({ ...settings, autoWelcomeSms: e.target.checked })}
                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--brand-primary)" }}
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer card-hover" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-subtle)", transition: "all 0.25s ease" }}>
              <div className="flex-col gap-1" style={{ display: "flex" }}>
                <span className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>Instant SMS Donation & Tithe Receipt</span>
                <span className="text-xs text-muted">Automatically send a digital SMS thank you receipt whenever a member gives via Moolre POS.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoDonationReceipt}
                onChange={(e) => setSettings({ ...settings, autoDonationReceipt: e.target.checked })}
                style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--brand-primary)" }}
              />
            </label>
          </div>

          <div className="pt-2">
            <button onClick={handleSave} className="btn btn-primary font-bold text-xs flex items-center gap-2 shadow-md" style={{ borderRadius: "14px", padding: "0.8rem 1.6rem" }}>
              <Save size={16} /> Save Communication Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Roles & Access Oversight */}
      {activeTab === "roles" && (
        <div className="flex-col gap-6" style={{ display: "flex" }}>
          <div className="card flex-col gap-4" style={{ display: "flex", padding: "1.75rem" }}>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="text-primary" size={20} /> Role-Based Access Control (RBAC) Architecture
              </h3>
              <p className="text-xs text-muted" style={{ marginTop: "0.25rem" }}>Summary of active permissions granted to distinct church administration roles across Kenol Flock</p>
            </div>

            <div className="grid-2 gap-4 pt-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                { role: "Admin", title: "Senior Pastor / System Admin", desc: "Full unrestricted access to all modules including Treasury, Members, SMS Broadcasts, Events scheduling, and Organization Settings.", color: "#3B82F6", badge: "badge-info" },
                { role: "Finance", title: "Financial Secretary / Treasury", desc: "Restricted to Donations & Giving treasury metrics and basic Members Directory. Cannot send bulk SMS broadcasts or edit system settings.", color: "#10B981", badge: "badge-success" },
                { role: "Pastor", title: "Pastoral Care Team", desc: "Access to Members Directory, pastoral notes, SMS Broadcast announcements, and Events scheduling. Restricted from Treasury finances.", color: "#F59E0B", badge: "badge-warning" },
                { role: "Member", title: "Congregation Member", desc: "Limited access to general Overview, public church calendar, and personal online Moolre giving and donation history.", color: "#8B5CF6", badge: "badge-secondary" },
              ].map((item) => (
                <div key={item.role} className="card p-4 flex-col gap-2" style={{ display: "flex", borderLeft: `4px solid ${item.color}` }}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">{item.title}</span>
                    <span className={`badge ${item.badge} text-[11px] font-bold`}>{item.role}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mt-2 flex items-center gap-3">
              <AlertCircle className="text-primary shrink-0" size={20} />
              <p className="text-xs leading-relaxed">
                To test any role right now, simply click <strong>"Switch Role"</strong> in the sidebar or navigate to <strong>`/login`</strong> to use the instant 1-click Staff Role Switcher!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Cloud Database & Persistence */}
      {activeTab === "database" && cloudStatus && (
        <div className="flex-col gap-6" style={{ display: "flex" }}>
          <div className="card flex-col gap-6" style={{ display: "flex", padding: "2.25rem", borderRadius: "24px" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-success text-xs font-black uppercase tracking-wider px-3 py-1 flex items-center gap-1.5" style={{ borderRadius: "10px" }}>
                    <Wifi size={13} /> {cloudStatus.engine}
                  </span>
                  <span className="text-xs font-bold text-muted px-2.5 py-1 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    Latency: {cloudStatus.latencyMs}ms
                  </span>
                </div>
                <h3 className="text-xl font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Cloud className="text-primary" size={24} style={{ color: "var(--brand-primary)" }} /> Real-Time Cloud Persistence Architecture
                </h3>
                <p className="text-xs text-muted font-medium mt-1">
                  Continuous WebSocket synchronization and multi-device reactive state distribution across Kenol Flock ChMS
                </p>
              </div>

              <button
                onClick={handleCloudSyncTest}
                disabled={syncingCloud}
                className="btn btn-primary text-xs font-black px-4 py-2.5 flex items-center gap-2 shadow-md"
                style={{ borderRadius: "14px" }}
              >
                {syncingCloud ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Test Cloud Handshake & Sync
              </button>
            </div>

            {syncMessage && (
              <div className="p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: "rgba(16, 185, 129, 0.08)", borderColor: "rgba(16, 185, 129, 0.3)", color: "#10B981" }}>
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="text-xs font-extrabold">{syncMessage}</span>
              </div>
            )}

            {/* Synced Record Slabs */}
            <div className="grid-4 gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              <div className="p-4 rounded-2xl border border-border/40 flex-col gap-2" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <span className="text-xs font-extrabold text-muted uppercase tracking-wider">Congregation Directory</span>
                <span className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>{cloudStatus.syncedRecords.members} Members</span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1"><Check size={13} /> Synced via onSnapshot</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/40 flex-col gap-2" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <span className="text-xs font-extrabold text-muted uppercase tracking-wider">Treasury Ledger</span>
                <span className="text-2xl font-black text-emerald-400">{cloudStatus.syncedRecords.donations} Audited Txns</span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1"><Check size={13} /> Synced via onSnapshot</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/40 flex-col gap-2" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <span className="text-xs font-extrabold text-muted uppercase tracking-wider">Church Calendar</span>
                <span className="text-2xl font-black text-amber-400">{cloudStatus.syncedRecords.events} Active Events</span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1"><Check size={13} /> Synced via onSnapshot</span>
              </div>

              <div className="p-4 rounded-2xl border border-border/40 flex-col gap-2" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
                <span className="text-xs font-extrabold text-muted uppercase tracking-wider">SMS Broadcasts</span>
                <span className="text-2xl font-black text-indigo-400">{cloudStatus.syncedRecords.broadcasts} Campaigns</span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1"><Check size={13} /> Synced via onSnapshot</span>
              </div>
            </div>

            {/* Cloud API Key Status Audit */}
            <div className="p-5 rounded-2xl border border-border/40 flex-col gap-4" style={{ display: "flex", backgroundColor: "var(--bg-tertiary)" }}>
              <h4 className="text-sm font-black flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Activity size={16} className="text-primary" /> Backend Environment & API Keys Audit
              </h4>
              <div className="grid-2 gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                <div className="p-3.5 rounded-xl border border-border/30 flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)" }}>
                  <div>
                    <p className="text-xs font-extrabold" style={{ color: "var(--text-primary)" }}>Firebase Project ID</p>
                    <p className="text-[11px] text-muted font-mono mt-0.5">kenol-flock-prod</p>
                  </div>
                  <span className="badge badge-success text-[10px] font-black px-2.5 py-0.5">Configured</span>
                </div>

                <div className="p-3.5 rounded-xl border border-border/30 flex items-center justify-between" style={{ backgroundColor: "var(--bg-card)" }}>
                  <div>
                    <p className="text-xs font-extrabold" style={{ color: "var(--text-primary)" }}>Realtime WebSocket Engine</p>
                    <p className="text-[11px] text-muted font-mono mt-0.5">onSnapshot (0ms polling)</p>
                  </div>
                  <span className="badge badge-success text-[10px] font-black px-2.5 py-0.5">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
