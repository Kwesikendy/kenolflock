"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShieldCheck, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { updateDonationStatusRecord } from "@/lib/db-service";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "Unknown Reference";
  const amount = searchParams.get("amount") || "0";

  useEffect(() => {
    if (reference && reference !== "Unknown Reference") {
      updateDonationStatusRecord(reference, "Success");
    }
  }, [reference]);

  // Current date formatted with slashes '/' instead of dashes '-'
  const date = new Date();
  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

  return (
    <main className="flex items-center justify-center min-h-screen" style={{ padding: '1rem' }}>
      <div className="card animate-fade-in flex-col gap-6" style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#34D399', marginBottom: '0.5rem'
        }}>
          <CheckCircle size={36} />
        </div>

        <div>
          <h1 className="text-2xl" style={{ fontWeight: 800 }}>Donation Confirmed</h1>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>Thank you for your generous contribution to Kenol Flock</p>
        </div>

        <div className="w-full flex-col gap-3" style={{ 
          display: 'flex', 
          backgroundColor: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted">Amount Contributed</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>GHS {amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <span className="text-muted">Transaction Reference</span>
            <span className="text-xs" style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{reference}</span>
          </div>
          <div className="flex justify-between items-center text-sm" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <span className="text-muted">Transaction Date</span>
            <span style={{ fontWeight: 500 }} className="flex items-center gap-1">
              <Calendar size={14} className="text-muted" />
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck size={16} className="text-muted" />
          <span>Secured by Moolre Payments</span>
        </div>

        <Link href="/dashboard/donations" className="btn btn-primary w-full gap-2">
          <span>Return to Dashboard</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-muted" size={32} />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
