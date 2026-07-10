"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, User, Mail, Phone, Calendar, MapPin, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { MembershipStatus } from "@/types";
import { addMember } from "@/lib/db-service";

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "Guest" as MembershipStatus,
    dateOfBirth: "",
    address: "",
    pastoralNotes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dateStr = new Date();
      const formattedJoinDate = `${dateStr.getFullYear()}/${String(dateStr.getMonth() + 1).padStart(2, '0')}/${String(dateStr.getDate()).padStart(2, '0')}`;
      
      await addMember({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        pastoralNotes: formData.pastoralNotes,
        joinDate: formattedJoinDate,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error saving member:", err);
    } finally {
      setLoading(false);
      router.push("/dashboard/members");
    }
  };

  return (
    <div className="animate-fade-in flex-col gap-6" style={{ display: 'flex', maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/members" className="btn btn-secondary" style={{ padding: '0.625rem' }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl" style={{ fontWeight: 800 }}>Add New Member</h1>
          <p className="text-muted" style={{ marginTop: '0.15rem' }}>Create a new congregation profile in the directory.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Personal Details Card */}
        <div className="card">
          <div className="flex items-center gap-2" style={{ marginBottom: '1.75rem' }}>
            <User size={18} style={{ color: 'var(--brand-primary)' }} />
            <h2 className="text-lg" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Personal Information</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label className="label" htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" required type="text" className="input" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" required type="text" className="input" value={formData.lastName} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label className="label" htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="email" name="email" type="email" className="input" style={{ paddingLeft: '2.5rem' }} value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <div className="input-group">
              <label className="label" htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="phone" name="phone" type="tel" className="input" style={{ paddingLeft: '2.5rem' }} placeholder="e.g. 233 541 234 567" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            
            <div className="input-group">
              <label className="label" htmlFor="dateOfBirth">Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="dateOfBirth" name="dateOfBirth" type="date" className="input" style={{ paddingLeft: '2.5rem' }} value={formData.dateOfBirth} onChange={handleChange} />
              </div>
            </div>
            <div className="input-group">
              <label className="label" htmlFor="status">Membership Status</label>
              <select 
                id="status" 
                name="status" 
                className="input" 
                style={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.6)', 
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
                value={formData.status} 
                onChange={handleChange}
              >
                <option value="Guest">Guest</option>
                <option value="Regular">Regular Attendee</option>
                <option value="Member">Official Member</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '1.5rem' }}>
            <label className="label" htmlFor="address">Home Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input id="address" name="address" type="text" className="input" style={{ paddingLeft: '2.5rem' }} placeholder="123 Main St, City, State, ZIP" value={formData.address} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Administrative Notes Card */}
        <div className="card">
          <div className="flex items-center gap-2" style={{ marginBottom: '1.75rem' }}>
            <ShieldAlert size={18} style={{ color: 'var(--brand-primary)' }} />
            <h2 className="text-lg" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Pastoral Notes</h2>
          </div>
          <div className="input-group">
            <label className="label" htmlFor="pastoralNotes">Secure Administrative Notes</label>
            <textarea 
              id="pastoralNotes" 
              name="pastoralNotes" 
              className="input" 
              style={{ minHeight: '140px', resize: 'vertical' }}
              placeholder="Private notes visible only to admins and pastoral staff"
              value={formData.pastoralNotes} 
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4" style={{ marginTop: '0.5rem' }}>
          <Link href="/dashboard/members" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary gap-2" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{loading ? "Saving..." : "Save Member"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
