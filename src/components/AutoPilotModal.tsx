'use client';

import React, { useState } from 'react';
import { X, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AutoPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSweepCompleted: () => void;
}

export const AutoPilotModal: React.FC<AutoPilotModalProps> = ({
  isOpen,
  onClose,
  onSweepCompleted,
}) => {
  const [maxAmount, setMaxAmount] = useState(250);
  const [minConfidence, setMinConfidence] = useState(85);
  const [running, setRunning] = useState(false);
  const [sweepResult, setSweepResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunSweep = async () => {
    setRunning(true);
    setSweepResult(null);

    try {
      const res = await fetch('/api/autopilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxAmount, minConfidence }),
      });
      const data = await res.json();
      if (data.success) {
        setSweepResult(data);
        onSweepCompleted();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                DisputeGuard AI Auto-Pilot Engine
              </h3>
              <p className="text-xs text-slate-400">
                Autonomous adjudication of qualified PayPal Seller Protection claims
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Autonomous Safeguards
            </div>
            <p>
              When enabled, DisputeGuard AI inspects carrier tracking and fulfillment records against PayPal's Seller Protection rules. If confidence meets your threshold, it programmatically drafts and submits the defense packet via the PayPal Disputes API automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Max Value per Claim ($)
              </label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Higher amounts require manual review
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Min Win Confidence (%)
              </label>
              <input
                type="number"
                value={minConfidence}
                onChange={(e) => setMinConfidence(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Suggested: ≥ 85%
              </span>
            </div>
          </div>

          {sweepResult && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {sweepResult.message}
              </div>
              <p className="text-[11px] text-emerald-400/80">
                Processed {sweepResult.count} dispute(s). Status moved to UNDER_REVIEW in PayPal.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={handleRunSweep}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-600/30"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            {running ? 'Executing Auto-Pilot...' : 'Run Autonomous Sweep'}
          </button>
        </div>
      </div>
    </div>
  );
};
