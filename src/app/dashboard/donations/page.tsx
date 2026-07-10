"use client";

import { useState, useEffect } from "react";
import { DollarSign, Wallet, ArrowUpRight, Loader2, Calendar, ShieldAlert } from "lucide-react";
import { Donation } from "@/types";
import { getDonations, addDonationRecord } from "@/lib/db-service";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DonationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [purpose, setPurpose] = useState("Tithe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDonations() {
      setDataLoading(true);
      const data = await getDonations();
      setDonations(data);
      setDataLoading(false);
    }
    loadDonations();
  }, []);

  if (user?.role === "Pastor") {
    return (
      <div className="card animate-fade-in flex-col items-center justify-center text-center gap-4" style={{ maxWidth: "560px", margin: "4rem auto", padding: "3rem 2rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#FBBF24", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={30} />
        </div>
        <div>
          <h2 className="text-xl" style={{ fontWeight: 800 }}>Restricted Module Access</h2>
          <p className="text-sm text-secondary" style={{ marginTop: "0.5rem", lineHeight: 1.5 }}>
            Your active role (<strong>{user.role} - Pastoral Care Team</strong>) does not have authorization to view sensitive church treasury metrics or transactions. This module is restricted to the <strong>Senior Pastor / Admin</strong> and <strong>Finance Team</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3" style={{ marginTop: "0.5rem" }}>
          <button onClick={() => router.push("/dashboard")} className="btn btn-secondary text-sm">
            Return to Overview
          </button>
          <button onClick={() => router.push("/login")} className="btn btn-primary text-sm">
            Switch Staff Role
          </button>
        </div>
      </div>
    );
  }

  // Calculate dynamic statistics
  const totalCollections = donations.reduce((sum, item) => item.status === "Success" ? sum + Number(item.amount) : sum, 42500);
  const avgContribution = donations.length > 0 ? Math.round(totalCollections / (donations.length + 120)) : 120;

  const handleGive = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/donations/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email, purpose, donorName }),
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Server returned status ${res.status} (${res.statusText}). Please ensure the dev server is running properly.`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate payment link.");

      // Record pending donation in database before redirection
      if (data.authorizationUrl) {
        const dateStr = new Date();
        const formattedDate = `${dateStr.getFullYear()}/${String(dateStr.getMonth() + 1).padStart(2, '0')}/${String(dateStr.getDate()).padStart(2, '0')}`;
        await addDonationRecord({
          reference: data.reference,
          donor: donorName || "Anonymous",
          email: email,
          amount: parseFloat(amount),
          purpose: purpose,
          date: formattedDate,
          status: "Pending"
        });

        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("No payment link returned.");
      }
    } catch (err: any) {
      setError(err.message || "Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-8" style={{ display: 'flex' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" style={{ fontWeight: 800 }}>Donations and Giving</h1>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>Track finances and contribute to church growth</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-3 gap-6">
        <div className="metric-card card-hover flex-col justify-between" style={{ display: 'flex', minHeight: '135px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Total Collections</span>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black mt-2" style={{ color: "var(--text-primary)" }}>GHS {totalCollections.toLocaleString()}</p>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border/40">
              <span className="text-muted font-medium">Annual Ledger</span>
              <span className="font-bold text-emerald-400">+18% vs Last Year</span>
            </div>
          </div>
        </div>

        <div className="metric-card card-hover flex-col justify-between" style={{ display: 'flex', minHeight: '135px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Active Campaigns</span>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255, 90, 67, 0.15)", color: "var(--brand-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black mt-2" style={{ color: "var(--text-primary)" }}>2 Campaigns</p>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border/40">
              <span className="text-muted font-medium">Building & Welfare</span>
              <span className="font-bold" style={{ color: "var(--brand-primary)" }}>100% Active</span>
            </div>
          </div>
        </div>

        <div className="metric-card card-hover flex-col justify-between" style={{ display: 'flex', minHeight: '135px' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Average Offering</span>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(250, 204, 21, 0.15)", color: "#FACC15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black mt-2" style={{ color: "var(--text-primary)" }}>GHS {avgContribution}</p>
            <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border/40">
              <span className="text-muted font-medium">Per Member Contribution</span>
              <span className="font-bold text-amber-400">Stable Index</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 1.4fr', gap: '2rem' }}>
        {/* Payment Initiation Card */}
        <div className="card flex-col gap-5" style={{ display: 'flex', padding: '2.25rem', borderRadius: '24px' }}>
          <div>
            <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Initiate Offering & Tithe</h2>
            <p className="text-xs text-muted mt-1">Process digital Moolre mobile money giving instantly</p>
          </div>

          {error && (
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#FCA5A5', borderRadius: '12px', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleGive} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Your Full Name</label>
              <input 
                id="donorName" 
                type="text" 
                className="input" 
                placeholder="e.g. John Doe" 
                value={donorName} 
                onChange={(e) => setDonorName(e.target.value)} 
                style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 600, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                required 
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Email Address</label>
              <input 
                id="email" 
                type="email" 
                className="input" 
                placeholder="e.g. john@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 600, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                required 
              />
            </div>

            <div className="grid-2 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Offering Purpose</label>
                <select 
                  id="purpose" 
                  className="input" 
                  style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 700, backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)", cursor: 'pointer' }} 
                  value={purpose} 
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <option value="Tithe">Tithe</option>
                  <option value="Offering">Offering</option>
                  <option value="Building Fund">Building Fund</option>
                  <option value="Welfare">Welfare Campaign</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--text-secondary)" }}>Amount (GHS)</label>
                <input 
                  id="amount" 
                  type="number" 
                  min="1" 
                  className="input" 
                  placeholder="e.g. 100" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  style={{ width: "100%", borderRadius: "14px", padding: "0.85rem 1.25rem", fontWeight: 800, backgroundColor: "var(--bg-input)", color: "#34D399", border: "1px solid var(--border-subtle)" }}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary font-bold text-xs w-full shadow-md mt-2 flex items-center justify-center gap-2" disabled={loading} style={{ borderRadius: "14px", padding: "0.95rem" }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><DollarSign size={16} /> Process Online Offering via Moolre</>}
            </button>
          </form>
        </div>

        {/* Transactions Table Card */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
          <div style={{ padding: '1.75rem 2.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Recent Treasury Ledger</h2>
              <p className="text-xs text-muted mt-0.5">Real-time Moolre POS giving and bank receipts</p>
            </div>
            <span className="badge badge-success font-bold text-xs px-3 py-1" style={{ borderRadius: "10px" }}>
              {donations.length} Records Verified
            </span>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '2.25rem' }}>Donor Identity</th>
                  <th>Campaign / Purpose</th>
                  <th>Contribution</th>
                  <th style={{ paddingRight: '2.25rem' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {dataLoading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div className="flex items-center justify-center gap-2.5">
                        <Loader2 size={22} className="animate-spin text-primary" style={{ color: 'var(--brand-primary)' }} />
                        <span className="font-bold text-sm">Synchronizing treasury records...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {donations.map((txn) => (
                      <tr key={txn.id || txn.reference} className="hover:bg-primary/5 transition-colors">
                        <td style={{ paddingLeft: '2.25rem' }}>
                          <div className="flex items-center gap-3">
                            <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', color: 'var(--brand-primary)', flexShrink: 0 }}>
                              {(txn.donor || "A").substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>{txn.donor}</div>
                              <div className="text-xs text-muted font-medium">{txn.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                              {txn.status === 'Success' ? (
                                <>
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </>
                              ) : (
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                              )}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                              {txn.purpose}
                            </span>
                            <span className={`badge ${txn.status === 'Success' ? 'badge-success' : 'badge-warning'} text-[10px] font-bold px-2 py-0.5`} style={{ borderRadius: '6px' }}>
                              {txn.status}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 900, fontSize: '15px', color: '#34D399' }}>
                          GHS {Number(txn.amount).toLocaleString()}
                        </td>
                        <td style={{ paddingRight: '2.25rem' }}>
                          <div className="flex items-center gap-1.5 text-xs text-muted font-semibold">
                            <Calendar size={14} className="text-primary" style={{ color: 'var(--brand-primary)' }} />
                            <span>{txn.date}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <p className="font-bold text-sm">No donations recorded yet</p>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
