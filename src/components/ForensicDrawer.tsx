'use client';

import React, { useState, useEffect } from 'react';
import { PayPalDispute, AIAnalysisResult } from '../types/dispute';
import {
  X,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Send,
  FileText,
  Copy,
  Check,
  Package,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ForensicDrawerProps {
  dispute: PayPalDispute | null;
  onClose: () => void;
  onEvidenceSubmitted: (disputeId: string) => void;
}

export const ForensicDrawer: React.FC<ForensicDrawerProps> = ({
  dispute,
  onClose,
  onEvidenceSubmitted,
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [defenseStatement, setDefenseStatement] = useState('');
  const [submissionReceipt, setSubmissionReceipt] = useState<string | null>(null);

  useEffect(() => {
    if (!dispute) {
      setAnalysis(null);
      setSubmissionReceipt(null);
      return;
    }

    setLoading(true);
    setSubmissionReceipt(null);

    fetch(`/api/disputes/${dispute.dispute_id}/analyze`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalysis(data.analysis);
          setDefenseStatement(data.analysis.generatedDefenseStatement);
        }
      })
      .finally(() => setLoading(false));
  }, [dispute]);

  if (!dispute) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(defenseStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitToPayPal = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/disputes/${dispute.dispute_id}/submit-evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statement: defenseStatement,
          evidenceType: 'PROOF_OF_DELIVERY',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissionReceipt(data.receiptId);
        onEvidenceSubmitted(dispute.dispute_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Forensic Defense Dossier
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {dispute.dispute_id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI Agent verification against PayPal Seller Protection Protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Dispute Quick Summary Card */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Transaction & Buyer
                </span>
                <h4 className="text-sm font-semibold text-white mt-0.5">
                  {dispute.order.itemTitle}
                </h4>
                <p className="text-xs text-slate-400">
                  Buyer: <span className="text-slate-300">{dispute.order.buyerName}</span> ({dispute.order.buyerEmail})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Claim Amount</span>
                <div className="text-lg font-bold text-white">
                  ${parseFloat(dispute.dispute_amount.value).toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    {dispute.dispute_amount.currency_code}
                  </span>
                </div>
              </div>
            </div>

            {/* Buyer Claim Note */}
            {dispute.buyer_notes && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-rose-400 block mb-1">
                  Customer Claim:
                </span>
                "{dispute.buyer_notes}"
              </div>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">
                AI Agent cross-referencing carrier scans & PayPal Seller Protection rules...
              </p>
            </div>
          ) : analysis ? (
            <>
              {/* Score Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 to-emerald-950/60 border border-sky-800/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Seller Protection: {analysis.sellerProtectionEligibility} ELIGIBLE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    {analysis.executiveSummary}
                  </p>
                </div>
                <div className="text-right pl-4">
                  <div className="text-3xl font-extrabold text-emerald-400">
                    {analysis.winProbability}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Win Probability
                  </span>
                </div>
              </div>

              {/* Evidence Verification Checklist */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                  Automated Evidence Verification Checklist
                </h4>
                <div className="space-y-2">
                  {analysis.evidenceChecklist.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.verified ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className="font-medium text-slate-200">{item.item}</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {item.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Strengths & Vulnerabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                    Key Legal Strengths
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {analysis.keyStrengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                    Audit Nuances
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {analysis.vulnerabilities.map((vul, i) => (
                      <li key={i}>{vul}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Generated Defense Dossier */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      PayPal Formal Defense Dossier (Formatted for API)
                    </h4>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                </div>
                <textarea
                  value={defenseStatement}
                  onChange={(e) => setDefenseStatement(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-sky-500 custom-scrollbar"
                />
              </div>

              {/* Submission Receipt Alert */}
              {submissionReceipt && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-300">
                      Dispatched to PayPal Adjudication API
                    </h5>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      Receipt ID: <span className="font-mono font-bold text-white">{submissionReceipt}</span>. The dispute status has shifted to UNDER_REVIEW.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Close
          </button>

          <button
            onClick={handleSubmitToPayPal}
            disabled={submitting || !analysis || !!submissionReceipt}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
              submissionReceipt
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
            }`}
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting to PayPal...
              </>
            ) : submissionReceipt ? (
              <>
                <Check className="w-4 h-4" />
                Evidence Packet Submitted
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Defense to PayPal (Sandbox)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
