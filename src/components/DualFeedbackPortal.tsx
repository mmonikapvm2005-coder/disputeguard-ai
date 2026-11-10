'use client';

import React, { useState } from 'react';
import { PayPalDispute, AIAnalysisResult } from '../types/dispute';
import {
  Users,
  ShieldCheck,
  HeartHandshake,
  Send,
  Sparkles,
  Bot,
  User,
  Store,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';

interface DualFeedbackPortalProps {
  dispute: PayPalDispute;
  analysis: AIAnalysisResult;
  onStrategyUpdated?: (newStatement?: string) => void;
}

export const DualFeedbackPortal: React.FC<DualFeedbackPortalProps> = ({
  dispute,
  analysis,
  onStrategyUpdated,
}) => {
  const [role, setRole] = useState<'MERCHANT' | 'BUYER'>('MERCHANT');
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    sentiment: string;
    buyerSatisfactionScore: number;
    merchantProtectionScore: number;
    tailoredReply: string;
    adjustedStrategy: string;
  } | null>(null);

  const handleSendFeedback = async (textOverride?: string) => {
    const textToSend = textOverride || feedbackText;
    if (!textToSend.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/disputes/${dispute.dispute_id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          feedbackText: textToSend,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          sentiment: data.sentiment,
          buyerSatisfactionScore: data.buyerSatisfactionScore,
          merchantProtectionScore: data.merchantProtectionScore,
          tailoredReply: data.tailoredReply,
          adjustedStrategy: data.adjustedStrategy,
        });
        if (!textOverride) setFeedbackText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const merchantProtection = result ? result.merchantProtectionScore : analysis.winProbability;
  const buyerSatisfaction = result ? result.buyerSatisfactionScore : 72;

  return (
    <div className="space-y-6">
      {/* 1. Dual-Audience Graph / Balance Meters */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-sky-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Dual Win-Win Impact Graph (Merchant vs. Buyer)
            </h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Real-Time AI Sentiment Alignment
          </span>
        </div>

        {/* Dual Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Merchant Protection */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Merchant Capital Protection
              </span>
              <span className="text-emerald-400 font-bold">{merchantProtection}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${merchantProtection}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Evaluates revenue retention & Seller Protection adherence.
            </p>
          </div>

          {/* Buyer Satisfaction */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4 text-sky-400" />
                Buyer Trust & Retention
              </span>
              <span className="text-sky-400 font-bold">{buyerSatisfaction}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${buyerSatisfaction}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Measures customer fairness, transparency & repeat business likelihood.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Role Selector Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 block">
          Select Feedback Channel to Train & Instruct AI Agent:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setRole('MERCHANT')}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
              role === 'MERCHANT'
                ? 'border-brand-500 bg-brand-500/15 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400 shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs block">Merchant Feedback</span>
              <span className="text-[11px] opacity-80">Instruct AI on store policy, VIP status, or tolerance</span>
            </div>
          </button>

          <button
            onClick={() => setRole('BUYER')}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
              role === 'BUYER'
                ? 'border-sky-500 bg-sky-500/15 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs block">Buyer Perspective</span>
              <span className="text-[11px] opacity-80">Simulate customer statement, missing delivery, or inquiry</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Preset Scenarios for Quick 1-Click Testing */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          {role === 'MERCHANT' ? 'Quick Merchant Directives' : 'Quick Buyer Inquiries'}
        </span>
        <div className="flex flex-wrap gap-2">
          {role === 'MERCHANT' ? (
            <>
              <button
                onClick={() => handleSendFeedback('This buyer is a repeat VIP customer. Prioritize retention over fighting for the full amount.')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700 transition"
              >
                ⭐ "Buyer is a VIP customer (Prioritize retention)"
              </button>
              <button
                onClick={() => handleSendFeedback('We have airtight delivery proof. Zero concessions; maintain aggressive seller protection defense.')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700 transition"
              >
                🛡️ "Zero concessions (Full legal defense)"
              </button>
              <button
                onClick={() => handleSendFeedback('Propose a 30% partial refund compromise to close the dispute immediately.')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700 transition"
              >
                🤝 "Offer 30% partial settlement"
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSendFeedback('I never received this item. Can you provide carrier delivery proof or GPS location?')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700 transition"
              >
                📸 "Where is package? Need delivery proof"
              </button>
              <button
                onClick={() => handleSendFeedback('The package was stolen from my front porch after the carrier dropped it off.')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700 transition"
              >
                📦 "Package stolen from front porch"
              </button>
              <button
                onClick={() => handleSendFeedback('The package arrived but the item had damaged packaging and missing cable.')}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-200 border border-slate-700 transition"
              >
                ⚠️ "Item arrived damaged / missing pieces"
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4. Custom Feedback Input Box */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={
              role === 'MERCHANT'
                ? 'Type custom merchant feedback for the AI agent (e.g. "Offer free replacement")...'
                : 'Type buyer perspective or customer complaint...'
            }
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendFeedback()}
            className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            onClick={() => handleSendFeedback()}
            disabled={loading || !feedbackText.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
            {loading ? 'Analyzing...' : 'Send to Agent'}
          </button>
        </div>
      </div>

      {/* 5. AI Agent Live Feedback Response & Strategy Adjustment */}
      {result && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/60 to-purple-950/60 border border-sky-800/40 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <Bot className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-white">
                DisputeGuard AI Agent Analysis & Tailored Reply
              </h5>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Sentiment: {result.sentiment}
            </span>
          </div>

          {/* Tailored Communication */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1">
              {role === 'MERCHANT' ? 'AI Executive Guidance for Merchant:' : 'Tailored Message to Buyer (Sent via PayPal):'}
            </span>
            "{result.tailoredReply}"
          </div>

          {/* Adjusted PayPal Strategy */}
          <div className="flex items-start gap-2 text-xs text-slate-300">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px]">
              <strong className="text-emerald-300">Adjusted Strategy:</strong> {result.adjustedStrategy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
