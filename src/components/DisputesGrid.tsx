'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { PayPalDispute } from '../types/dispute';
import { Sparkles, ArrowRight, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface DisputesGridProps {
  disputes: PayPalDispute[];
  onSelectDispute: (dispute: PayPalDispute) => void;
}

export const DisputesGrid: React.FC<DisputesGridProps> = ({
  disputes,
  onSelectDispute,
}) => {
  // Format reason code to human readable
  const formatReason = (reason: string) => {
    switch (reason) {
      case 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED':
        return 'Item Not Received (INR)';
      case 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED':
        return 'Not As Described (SNAD)';
      case 'UNAUTHORISED':
        return 'Unauthorized Account Use';
      case 'CANCELED_RECURRING_BILLING':
        return 'Canceled Subscription';
      default:
        return reason.replace(/_/g, ' ');
    }
  };

  const columnDefs = useMemo<ColDef<PayPalDispute>[]>(() => {
    return [
      {
        headerName: 'Dispute & Claim',
        field: 'dispute_id',
        minWidth: 220,
        flex: 1.2,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          return (
            <div className="flex flex-col justify-center h-full py-1">
              <span className="font-semibold text-white tracking-wide text-xs">
                {params.data.dispute_id}
              </span>
              <span className="text-[11px] text-sky-400 font-medium truncate">
                {formatReason(params.data.reason)}
              </span>
            </div>
          );
        },
      },
      {
        headerName: 'Item / Transaction',
        field: 'order.itemTitle',
        minWidth: 220,
        flex: 1.3,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          return (
            <div className="flex flex-col justify-center h-full py-1">
              <span className="text-slate-200 text-xs font-medium truncate">
                {params.data.order.itemTitle}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {params.data.order.buyerName} • {params.data.order.transactionId}
              </span>
            </div>
          );
        },
      },
      {
        headerName: 'Amount',
        field: 'dispute_amount.value',
        width: 130,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          const val = parseFloat(params.data.dispute_amount.value).toFixed(2);
          return (
            <div className="flex items-center h-full">
              <span className="font-bold text-white text-sm">
                ${val}
              </span>
              <span className="ml-1 text-[10px] text-slate-400 uppercase">
                {params.data.dispute_amount.currency_code}
              </span>
            </div>
          );
        },
      },
      {
        headerName: 'Stage',
        field: 'dispute_life_cycle_stage',
        width: 140,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          const stage = params.data.dispute_life_cycle_stage;
          const colors: Record<string, string> = {
            INQUIRY: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            CHARGEBACK: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            PRE_ARBITRATION: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          };
          return (
            <div className="flex items-center h-full">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  colors[stage] || 'bg-slate-700 text-slate-300'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        },
      },
      {
        headerName: 'PayPal Status',
        field: 'status',
        width: 170,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          const status = params.data.status;
          if (status === 'REQUIRED_ACTION') {
            return (
              <div className="flex items-center gap-1.5 h-full text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Action Required
              </div>
            );
          }
          if (status === 'UNDER_REVIEW') {
            return (
              <div className="flex items-center gap-1.5 h-full text-sky-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                Under Adjudication
              </div>
            );
          }
          return (
            <div className="flex items-center gap-1.5 h-full text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Resolved (Seller Won)
            </div>
          );
        },
      },
      {
        headerName: 'AI Defense Strategy',
        width: 170,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          const hasTracking = params.data.order.tracking?.status === 'DELIVERED';
          const winRate = hasTracking ? 96 : params.data.reason === 'UNAUTHORISED' ? 94 : 45;
          return (
            <div className="flex flex-col justify-center h-full py-1">
              <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                <span className="text-slate-300">Win Confidence</span>
                <span className={winRate >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                  {winRate}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    winRate >= 80 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        headerName: 'Actions',
        width: 150,
        cellRenderer: (params: ICellRendererParams<PayPalDispute>) => {
          if (!params.data) return null;
          return (
            <div className="flex items-center h-full">
              <button
                onClick={() => onSelectDispute(params.data!)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-sky-600 text-white rounded-lg transition border border-slate-700 hover:border-sky-500 group"
              >
                <Sparkles className="w-3 h-3 text-sky-400 group-hover:text-white" />
                Inspect AI
                <ArrowRight className="w-3 h-3 ml-0.5 opacity-60 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          );
        },
      },
    ];
  }, [onSelectDispute]);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl">
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Live PayPal Disputes War Room
          </h2>
          <p className="text-xs text-slate-400">
            Powered by AG Grid enterprise-grade data virtualization & PayPal Disputes API
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{disputes.length}</span> active disputes
        </div>
      </div>
      <div className="ag-theme-quartz-dark w-full" style={{ height: '420px' }}>
        <AgGridReact
          rowData={disputes}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          rowHeight={62}
          headerHeight={42}
          animateRows={true}
        />
      </div>
    </div>
  );
};
