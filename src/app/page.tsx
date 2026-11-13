'use client';

import React, { useState, useEffect } from 'react';
import { PayPalDispute } from '../types/dispute';
import { INITIAL_DISPUTES } from '../lib/mockDisputes';
import { Header } from '../components/Header';
import { KpiOverview } from '../components/KpiOverview';
import { RiskAnalytics } from '../components/RiskAnalytics';
import { DisputesGrid } from '../components/DisputesGrid';
import { ForensicDrawer } from '../components/ForensicDrawer';
import { SimulateDisputeModal } from '../components/SimulateDisputeModal';
import { AutoPilotModal } from '../components/AutoPilotModal';
import { ShieldCheck, Cpu, Code2, Database, ExternalLink } from 'lucide-react';

export default function Home() {
  const [disputes, setDisputes] = useState<PayPalDispute[]>(INITIAL_DISPUTES);
  const [loading, setLoading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<PayPalDispute | null>(null);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isAutoPilotOpen, setIsAutoPilotOpen] = useState(false);
  const [autoPilotActive, setAutoPilotActive] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const fetchAllDisputes = async () => {
    try {
      const res = await fetch('/api/disputes');
      const data = await res.json();
      if (data.success) {
        setDisputes(data.disputes);
      }
    } catch (err) {
      console.error('Failed to load disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDisputes();
  }, []);

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (data.success) {
        setDisputes(data.disputes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvidenceSubmitted = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.dispute_id === disputeId
          ? { ...d, status: 'UNDER_REVIEW', autoPilotStatus: 'SUBMITTED' }
          : d
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1e] text-slate-100">
      <Header
        onSimulateDispute={() => setIsSimulateOpen(true)}
        onResetData={handleReset}
        autoPilotEnabled={autoPilotActive}
        onToggleAutoPilot={() => setIsAutoPilotOpen(true)}
        isLiveMode={isLiveMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Top Banner / Announcement */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-brand-900/50 via-slate-900 to-sky-950/40 border border-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-sky-400 border border-brand-500/30">
              <Cpu className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                PayPal AI Hackathon 2026: Official Submission Prototype
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  AG Grid Sponsor Category Active
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                DisputeGuard AI autonomously defends merchant chargebacks using PayPal Disputes REST APIs + Forensic LLM Agents.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPilotOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
            >
              Configure Auto-Pilot
            </button>
          </div>
        </div>

        {/* Executive KPI Overview */}
        <KpiOverview disputes={disputes} />

        {/* Visual Risk Intelligence & Loss Prevention */}
        <RiskAnalytics disputes={disputes} />

        {/* AG Grid Disputes Table */}
        {loading ? (
          <div className="py-24 text-center rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="inline-block w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-400">
              Synchronizing with PayPal Disputes Sandbox API...
            </p>
          </div>
        ) : (
          <DisputesGrid
            disputes={disputes}
            onSelectDispute={(dispute) => setSelectedDispute(dispute)}
          />
        )}

        {/* Architecture & How It Works section for judges */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              1. PayPal Disputes & Tracking API
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Directly integrates with <code className="text-sky-300">/v1/customer/disputes</code> and <code className="text-sky-300">/provide-evidence</code> to poll claims, cross-reference confirmed shipping addresses, and submit legal defense dossiers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              2. Forensic AI Reasoning Agent
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspects carrier tracking logs, timestamps, 3D-Secure logs, and customer chat histories to calculate PayPal Seller Protection eligibility and Win Probability before drafting an airtight defense.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">
              3. AG Grid Enterprise Table
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built on sponsor partner <strong>AG Grid</strong> for virtualization, multi-column sorting, real-time status filtering, and visual win confidence meters across thousands of transactions.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 px-6 text-center text-xs text-slate-500">
        DisputeGuard AI — Built for the <em>Build What's Next with PayPal and AI</em> Hackathon 2026.
      </footer>

      {/* Forensic Drawer */}
      <ForensicDrawer
        dispute={selectedDispute}
        onClose={() => setSelectedDispute(null)}
        onEvidenceSubmitted={handleEvidenceSubmitted}
      />

      {/* Simulate Dispute Modal */}
      <SimulateDisputeModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onCreated={(newDispute) => {
          setDisputes((prev) => [newDispute, ...prev]);
        }}
      />

      {/* AutoPilot Modal */}
      <AutoPilotModal
        isOpen={isAutoPilotOpen}
        onClose={() => setIsAutoPilotOpen(false)}
        onSweepCompleted={() => {
          fetchAllDisputes();
        }}
      />
    </div>
  );
}
