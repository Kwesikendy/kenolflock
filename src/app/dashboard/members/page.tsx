"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, MoreVertical, Filter, Mail, Phone as PhoneIcon, Calendar, Loader2, Users, Sparkles, Shield, UserCheck, User } from "lucide-react";
import { Member } from "@/types";
import { getMembers, subscribeToMembers } from "@/lib/db-service";
import { useAuth } from "@/context/AuthContext";

export default function MembersPage() {
  const { user } = useAuth();
  const currentRole = user?.role || "Admin";
  const canAddMember = currentRole === "Admin" || currentRole === "Pastor" || currentRole === "Finance";

  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToMembers((data) => {
      setMembers(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredMembers = members.filter(member => 
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone?.includes(searchTerm) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: "flex" }}>
      {/* Top Section Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-info text-xs font-bold px-2.5 py-0.5" style={{ borderRadius: "8px" }}>
              <Shield size={13} className="text-primary" /> Role Access: {currentRole}
            </span>
          </div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>Congregation Directory & Onboarding</h1>
          <p className="text-xs text-muted mt-1">Search records, filter ministry groups, and onboard new church members in real time.</p>
        </div>
        {canAddMember && (
          <Link href="/dashboard/members/new" className="btn btn-primary gap-2 font-bold shadow-md" style={{ borderRadius: "14px", padding: "0.8rem 1.5rem" }}>
            <Plus size={18} />
            <span>Add New Member</span>
          </Link>
        )}
      </div>

      {/* Main Directory Table Glass Slab Card */}
      <div className="card" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--border-subtle)", borderRadius: "24px" }}>
        {/* Search & Filter Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ padding: "1.75rem", backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "460px", minWidth: "260px" }}>
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", pointerEvents: "none", color: "var(--text-muted)" }}>
              <Search size={17} />
            </div>
            <input 
              type="text" 
              className="input" 
              style={{ paddingLeft: "2.85rem", borderRadius: "14px", backgroundColor: "var(--bg-input)", color: "var(--text-primary)", fontWeight: 500 }} 
              placeholder="Search by name, email, telephone number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="badge badge-info font-bold text-xs" style={{ padding: "0.45rem 0.9rem", borderRadius: "12px" }}>
              <Users size={14} /> {filteredMembers.length} Members Active
            </span>
            <button className="btn btn-secondary gap-2 text-xs font-bold" style={{ borderRadius: "14px", padding: "0.65rem 1.25rem" }}>
              <Filter size={15} />
              <span>Filter Group</span>
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="table-container" style={{ border: "none", borderRadius: "0" }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Congregation Member</th>
                <th>Contact & Communications</th>
                <th>Membership & Role Status</th>
                <th>Join Date</th>
                <th style={{ width: "60px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "5rem", textAlign: "center" }}>
                    <div className="flex items-center justify-center gap-3 text-muted">
                      <Loader2 size={26} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
                      <span className="font-bold text-sm">Synchronizing congregation database...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredMembers.map((member, idx) => {
                    const isStaff = member.status === "Staff";
                    const isMember = member.status === "Member";
                    
                    return (
                      <tr key={member.id} className="animate-fade-in hover:bg-tertiary/60 transition-all" style={{ animationDelay: `${idx * 35}ms` }}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "1.1rem" }}>
                            <div className="icon-badge icon-badge-blue font-black text-xs shrink-0 shadow-sm" style={{ width: "46px", height: "46px", borderRadius: "14px" }}>
                              {member.firstName?.[0] || "?"}{member.lastName?.[0] || "?"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>
                                {member.firstName} {member.lastName}
                              </div>
                              <span className="text-[11px] font-semibold text-muted">ID: #{(member.id || "MEM001").slice(-6).toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1.5">
                            {member.email && (
                              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                                <Mail size={13} className="text-muted shrink-0" />
                                <span>{member.email}</span>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-2 text-xs text-muted font-medium">
                                <PhoneIcon size={13} className="text-muted shrink-0" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.4rem 0.95rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                            backgroundColor: isStaff ? "rgba(255, 90, 67, 0.14)" : 
                                           isMember ? "rgba(16, 185, 129, 0.14)" : "rgba(148, 163, 184, 0.14)",
                            color: isStaff ? "var(--brand-primary)" : 
                                   isMember ? "#34D399" : "var(--text-secondary)",
                            border: isStaff ? "1px solid rgba(255, 90, 67, 0.35)" :
                                    isMember ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid var(--border-subtle)"
                          }}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "currentColor" }}></span>
                            <span>{member.status} {isStaff ? "Admin" : isMember ? "Congregation" : "Guest"}</span>
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                            <Calendar size={13} className="text-muted shrink-0" />
                            <span>{member.joinDate || "2026-07-10"}</span>
                          </div>
                        </td>
                        <td>
                          <button 
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.5rem", borderRadius: "10px" }} 
                            className="hover:bg-background transition-colors"
                            title="More member options"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "4.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                        <div className="flex-col items-center gap-2.5" style={{ display: "flex" }}>
                          <div style={{ width: "54px", height: "54px", borderRadius: "16px", backgroundColor: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                            <Users size={26} className="text-muted opacity-60" />
                          </div>
                          <p className="font-extrabold text-base" style={{ color: "var(--text-primary)" }}>No members found matching "{searchTerm}"</p>
                          <p className="text-xs max-w-md mx-auto">Try searching by a different name, telephone number, or email address, or add a new member directly to your database.</p>
                        </div>
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
  );
}
