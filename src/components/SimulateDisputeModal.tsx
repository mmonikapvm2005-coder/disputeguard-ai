'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { PayPalDispute } from '../types/dispute';

interface SimulateDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (dispute: PayPalDispute) => void;
}

export const SimulateDisputeModal: React.FC<SimulateDisputeModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [scenario, setScenario] = useState<'INR' | 'UNAUTH' | 'SNAD'>('INR');
  const [amount, setAmount] = useState('320.00');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSimulate = async () => {
    setSubmitting(true);
    const randomId = `PP-D-${Math.floor(10000 + Math.random() * 90000)}`;

    let newDispute: PayPalDispute;

    if (scenario === 'INR') {
      newDispute = {
        dispute_id: randomId,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        dispute_amount: { currency_code: 'USD', value: amount },
        reason: 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED',
        status: 'REQUIRED_ACTION',
        dispute_life_cycle_stage: 'CHARGEBACK',
        seller_response_due_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        buyer_notes: 'Tracking says delivered but nothing was left at my front door. Need full reimbursement.',
        messages: [{ postedBy: 'BUYER', time: new Date().toISOString(), content: 'Package missing upon arrival.' }],
        order: {
          orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}-SIM`,
          transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
          date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
          itemTitle: 'Bose QuietComfort 45 Wireless Noise-Cancelling Headphones',
          itemDescription: 'Triple Black, Over-Ear, Sealed Retail Packaging.',
          itemPrice: parseFloat(amount),
          currency: 'USD',
          buyerName: 'Taylor Morgan',
          buyerEmail: 'tmorgan.test@example.com',
          buyerIp: '192.0.2.14',
          shippingAddress: '1200 Grand Ave, Phoenix, AZ 85007, United States',
          tracking: {
            carrier: 'FedEx Ground',
            trackingNumber: '794820194821',
            shippedDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
            deliveredDate: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
            status: 'DELIVERED',
            deliveryAddress: '1200 Grand Ave, Phoenix, AZ 85007, United States',
            signedBy: 'T. MORGAN',
          },
          orderNotes: 'Dispatched via 2-Day Air with signature delivery confirmation.',
        },
        autoPilotEligible: true,
        autoPilotStatus: 'PENDING',
      };
    } else if (scenario === 'UNAUTH') {
      newDispute = {
        dispute_id: randomId,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        dispute_amount: { currency_code: 'USD', value: amount },
        reason: 'UNAUTHORISED',
        status: 'REQUIRED_ACTION',
        dispute_life_cycle_stage: 'CHARGEBACK',
        seller_response_due_date: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        buyer_notes: 'Cardholder claims unauthorized transaction initiated without permission.',
        messages: [{ postedBy: 'PAYPAL', time: new Date().toISOString(), content: 'Unauthorized chargeback inquiry initiated by bank.' }],
        order: {
          orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}-SIM`,
          transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
          date: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
          itemTitle: 'Apple iPad Air 11-inch M2 (128GB, Space Gray)',
          itemDescription: 'Factory sealed iPad Air with Liquid Retina display.',
          itemPrice: parseFloat(amount),
          currency: 'USD',
          buyerName: 'Jordan Lee',
          buyerEmail: 'jordan.l@example.com',
          buyerIp: '198.51.100.89',
          shippingAddress: '55 Wall Street, New York, NY 10005, United States',
          tracking: {
            carrier: 'UPS 2nd Day Air',
            trackingNumber: '1Z999AA10123456784',
            shippedDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
            deliveredDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            status: 'DELIVERED',
            deliveryAddress: '55 Wall Street, New York, NY 10005, United States',
            signedBy: 'J. LEE',
          },
          orderNotes: 'Shipped to PayPal Confirmed Address. 3D Secure verification passed.',
        },
        autoPilotEligible: true,
        autoPilotStatus: 'PENDING',
      };
    } else {
      newDispute = {
        dispute_id: randomId,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
        dispute_amount: { currency_code: 'USD', value: amount },
        reason: 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED',
        status: 'REQUIRED_ACTION',
        dispute_life_cycle_stage: 'INQUIRY',
        seller_response_due_date: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        buyer_notes: 'Color looks darker than what was depicted on store catalog photos.',
        messages: [{ postedBy: 'BUYER', time: new Date().toISOString(), content: 'Color shade looks different.' }],
        order: {
          orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}-SIM`,
          transactionId: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
          date: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
          itemTitle: 'Artisan Full-Grain Leather Briefcase - Cognac Brown',
          itemDescription: 'Handcrafted vegetable-tanned Italian leather with brass hardware.',
          itemPrice: parseFloat(amount),
          currency: 'USD',
          buyerName: 'Claire Robinson',
          buyerEmail: 'claire.r@example.com',
          buyerIp: '203.0.113.55',
          shippingAddress: '888 Brannan St, San Francisco, CA 94103, United States',
          tracking: {
            carrier: 'FedEx Home Delivery',
            trackingNumber: '891029384729',
            shippedDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
            deliveredDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
            status: 'DELIVERED',
            deliveryAddress: '888 Brannan St, San Francisco, CA 94103, United States',
          },
          orderNotes: 'Product listing includes natural patina variance disclosure.',
        },
        autoPilotEligible: false,
        autoPilotStatus: 'PENDING',
      };
    }

    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispute),
      });
      const data = await res.json();
      if (data.success) {
        onCreated(data.dispute);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulate PayPal Webhook Event
              </h3>
              <p className="text-xs text-slate-400">
                Trigger an incoming CUSTOMER_DISPUTE_CREATED event
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
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Dispute Reason / Claim Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScenario('INR')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                  scenario === 'INR'
                    ? 'border-sky-500 bg-sky-500/15 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Item Not Received
              </button>
              <button
                type="button"
                onClick={() => setScenario('UNAUTH')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                  scenario === 'UNAUTH'
                    ? 'border-sky-500 bg-sky-500/15 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Unauthorized
              </button>
              <button
                type="button"
                onClick={() => setScenario('SNAD')}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition ${
                  scenario === 'SNAD'
                    ? 'border-sky-500 bg-sky-500/15 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Not As Described
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Dispute Amount ($ USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSimulate}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition shadow-md shadow-brand-600/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {submitting ? 'Injecting Event...' : 'Trigger Dispute'}
          </button>
        </div>
      </div>
    </div>
  );
};
