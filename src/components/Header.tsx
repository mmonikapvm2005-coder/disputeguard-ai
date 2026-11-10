'use client';

import React from 'react';
import { ShieldAlert, Zap, RefreshCw, PlusCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onSimulateDispute: () => void;
  onResetData: () => void;
  autoPilotEnabled: boolean;
  onToggleAutoPilot: () => void;
  isLiveMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSimulateDispute,
  onResetData,
  autoPilotEnabled,
  onToggleAutoPilot,
  isLiveMode,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Dispute<span className="text-sky-400">Guard</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  AI Agent
                </span>
              </h1>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                • Built for PayPal
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Chargeback Defense & Evidence Dossier Generator
            </p>
          </div>
        </div>

        {/* Center / Right Control Panel */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Mode Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-medium">
              {isLiveMode ? 'PayPal Sandbox (Live API)' : 'PayPal Sandbox (Simulator)'}
            </span>
          </div>

          {/* Auto-Pilot Toggle Button */}
          <button
            onClick={onToggleAutoPilot}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              autoPilotEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${autoPilotEnabled ? 'fill-emerald-400' : ''}`} />
            Auto-Pilot: {autoPilotEnabled ? 'ACTIVE (≥90% Win)' : 'PAUSED'}
          </button>

          {/* Simulate New Dispute */}
          <button
            onClick={onSimulateDispute}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md shadow-brand-600/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Simulate Dispute
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetData}
            title="Reset sandbox sample records"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
