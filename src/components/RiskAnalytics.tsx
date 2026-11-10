'use client';

import React from 'react';
import { PayPalDispute } from '../types/dispute';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Truck, PieChart, Lightbulb } from 'lucide-react';

interface RiskAnalyticsProps {
  disputes: PayPalDispute[];
}

export const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ disputes }) => {
  // Aggregate claim categories
  const categories = {
    INR: disputes.filter((d) => d.reason === 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED').length,
    UNAUTH: disputes.filter((d) => d.reason === 'UNAUTHORISED').length,
    SNAD: disputes.filter((d) => d.reason === 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED').length,
    SUBSCRIPTION: disputes.filter((d) => d.reason === 'CANCELED_RECURRING_BILLING').length,
  };

  const total = disputes.length || 1;
  const inrPct = Math.round((categories.INR / total) * 100);
  const unauthPct = Math.round((categories.UNAUTH / total) * 100);
  const snadPct = Math.round((categories.SNAD / total) * 100);
  const subPct = Math.round((categories.SUBSCRIPTION / total) * 100);

  // Carrier benchmark performance
  const carrierStats = [
    { name: 'FedEx Express', winRate: 97, count: 2, status: 'HIGH RELIABILITY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { name: 'DHL Express', winRate: 94, count: 1, status: 'HIGH RELIABILITY', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { name: 'UPS Ground', winRate: 88, count: 1, status: 'MODERATE', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { name: 'USPS Priority', winRate: 45, count: 1, status: 'TRANSIT RISK', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Dispute Reason Distribution */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Dispute Reason Distribution
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">{disputes.length} claims tracked</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 mb-4">
            <div style={{ width: `${inrPct}%` }} className="bg-sky-500" title={`Item Not Received: ${inrPct}%`} />
            <div style={{ width: `${unauthPct}%` }} className="bg-purple-500" title={`Unauthorized: ${unauthPct}%`} />
            <div style={{ width: `${snadPct}%` }} className="bg-amber-500" title={`Not As Described: ${snadPct}%`} />
            <div style={{ width: `${subPct}%` }} className="bg-emerald-500" title={`Subscription: ${subPct}%`} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
              <span className="text-slate-400 text-[11px]">Item Not Received:</span>
              <span className="font-semibold text-white ml-auto">{inrPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
              <span className="text-slate-400 text-[11px]">Unauthorized:</span>
              <span className="font-semibold text-white ml-auto">{unauthPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-400 text-[11px]">Not As Described:</span>
              <span className="font-semibold text-white ml-auto">{snadPct}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-400 text-[11px]">Subscription:</span>
              <span className="font-semibold text-white ml-auto">{subPct}%</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
          INR and Unauthorized claims are 100% eligible for full PayPal Seller Protection reimbursement.
        </p>
      </div>

      {/* 2. Carrier Reliability & Defense Win Benchmarks */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Carrier Win Rate Benchmarks
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">91% Avg Win</span>
          </div>

          <div className="space-y-2.5">
            {carrierStats.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-300">{c.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${c.color}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden hidden sm:block">
                    <div
                      className={`h-full rounded-full ${c.winRate >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${c.winRate}%` }}
                    />
                  </div>
                  <span className={`font-bold ${c.winRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {c.winRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-800/80">
          Signature confirmation on FedEx & DHL packages yields a near-perfect win rate against INR claims.
        </p>
      </div>

      {/* 3. Proactive AI Risk Insights */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-300 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Autonomous Risk Insights
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-medium">
              Live AI Monitor
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs text-amber-200/90 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-amber-300">Transit Alert:</strong> USPS Priority item (#ORD-33219-IL) stalled in Chicago. Auto-Pilot postponed filing to allow carrier trace investigation.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-200/90 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-emerald-300">Seller Protection Win:</strong> 100% of claims with carrier signature & verified address won within 48h of submission.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Total Net Saved This Month</span>
          <span className="text-emerald-400 font-bold text-sm">+$1,329.00</span>
        </div>
      </div>
    </div>
  );
};
