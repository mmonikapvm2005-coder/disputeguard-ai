import { NextResponse } from 'next/server';
import { fetchDisputes, submitEvidenceToPayPal } from '@/lib/paypalClient';
import { runForensicAnalysis } from '@/lib/aiForensicEngine';

export async function POST(req: Request) {
  try {
    const { maxAmount = 200, minConfidence = 85 } = await req.json();
    const disputes = await fetchDisputes();

    const actionable = disputes.filter((d) => d.status === 'REQUIRED_ACTION');
    const processed: Array<{ dispute_id: string; amount: number; winProbability: number; receiptId: string }> = [];

    for (const d of actionable) {
      const amount = parseFloat(d.dispute_amount.value);
      const analysis = runForensicAnalysis(d);

      if (amount <= maxAmount && analysis.winProbability >= minConfidence) {
        const sub = await submitEvidenceToPayPal(
          d.dispute_id,
          analysis.generatedDefenseStatement,
          'PROOF_OF_DELIVERY'
        );
        processed.push({
          dispute_id: d.dispute_id,
          amount,
          winProbability: analysis.winProbability,
          receiptId: sub.receiptId,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: processed.length,
      processed,
      message: `DisputeGuard Auto-Pilot autonomously defended ${processed.length} high-confidence disputes.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
