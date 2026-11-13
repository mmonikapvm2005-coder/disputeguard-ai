'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PayPalDispute, AIAnalysisResult } from '../types/dispute';
import { runForensicAnalysis } from '../lib/aiForensicEngine';
import { EvidencePacketPrint } from './EvidencePacketPrint';
import { DualFeedbackPortal } from './DualFeedbackPortal';
import {
  X,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Send,
  FileText,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  Bot,
  User,
  ArrowRight,
  Printer,
  HeartHandshake,
} from 'lucide-react';

interface ForensicDrawerProps {
  dispute: PayPalDispute | null;
  onClose: () => void;
  onEvidenceSubmitted: (disputeId: string) => void;
}

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
}

export const ForensicDrawer: React.FC<ForensicDrawerProps> = ({
  dispute,
  onClose,
  onEvidenceSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'chat' | 'feedback'>('dossier');
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [defenseStatement, setDefenseStatement] = useState('');
  const [submissionReceipt, setSubmissionReceipt] = useState<string | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dispute) {
      setAnalysis(null);
      setSubmissionReceipt(null);
      setChatMessages([]);
      return;
    }

    setSubmissionReceipt(null);
    setActiveTab('dossier');

    // Instant local calculation so UI never hangs or errors
    try {
      const instant = runForensicAnalysis(dispute);
      setAnalysis(instant);
      setDefenseStatement(instant.generatedDefenseStatement);
      setChatMessages([
        {
          sender: 'agent',
          text: `Hello! I have audited Dispute ${dispute.dispute_id} (${dispute.reason}). Calculated win probability is ${instant.winProbability}%. Ask me anything about PayPal Seller Protection or ask me to modify the defense dossier.`,
        },
      ]);
      setLoading(false);
    } catch (e) {
      setLoading(true);
    }

    fetch(`/api/disputes/${dispute.dispute_id}/analyze`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalysis(data.analysis);
          setDefenseStatement(data.analysis.generatedDefenseStatement);
          setChatMessages([
            {
              sender: 'agent',
              text: `Hello! I have audited Dispute ${dispute.dispute_id} (${dispute.reason}). Calculated win probability is ${data.analysis.winProbability}%. Ask me anything about PayPal Seller Protection or ask me to modify the defense dossier.`,
            },
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, [dispute]);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  if (!dispute) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(defenseStatement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || chatLoading) return;

    const newMsgs: ChatMessage[] = [...chatMessages, { sender: 'user', text: textToSend }];
    setChatMessages(newMsgs);
    if (!customText) setInputMessage('');
    setChatLoading(true);

    try {
      const res = await fetch(`/api/disputes/${dispute.dispute_id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages([...newMsgs, { sender: 'agent', text: data.reply }]);
        if (data.updatedStatement) {
          setDefenseStatement(data.updatedStatement);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
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

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'dossier'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Evidence Dossier & Checklist
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Ask Agent (Copilot Chat)
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'feedback'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Buyer & Merchant Feedback
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
          ) : activeTab === 'dossier' && analysis ? (
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPrintOpen(true)}
                      className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition mr-2"
                      title="Open printable official evidence dossier"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Export / Print Dossier
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy Text'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={defenseStatement}
                  onChange={(e) => setDefenseStatement(e.target.value)}
                  rows={9}
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
          ) : activeTab === 'chat' ? (
            /* Interactive Copilot Chat */
            <div className="space-y-4">
              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendMessage('Why did you give this win probability?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition"
                >
                  💡 Why is win rate this score?
                </button>
                <button
                  onClick={() => handleSendMessage('Rewrite the statement in a more assertive legal tone')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition"
                >
                  ⚖️ Rewrite with assertive legal tone
                </button>
                <button
                  onClick={() => handleSendMessage('Rewrite the statement to be more concise')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition"
                >
                  ✂️ Make statement concise
                </button>
                <button
                  onClick={() => handleSendMessage('Explain how PayPal Seller Protection applies here')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition"
                >
                  📜 Explain Seller Protection policy
                </button>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 min-h-[280px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'agent' && (
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce delay-150" />
                    <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce delay-300" />
                    <span>Agent is analyzing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Ask a question or request a change to the defense dossier..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={chatLoading || !inputMessage.trim()}
                  className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition disabled:opacity-40"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : activeTab === 'feedback' && analysis ? (
            /* Dual Feedback Portal */
            <DualFeedbackPortal
              dispute={dispute}
              analysis={analysis}
            />
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

      {/* Official Printable Evidence Dossier Modal */}
      <EvidencePacketPrint
        dispute={dispute}
        analysis={analysis}
        defenseStatement={defenseStatement}
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
      />
    </div>
  );
};
