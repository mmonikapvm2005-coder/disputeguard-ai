import { NextResponse } from 'next/server';
import { getDisputeById } from '@/lib/paypalClient';
import { runForensicAnalysis } from '@/lib/aiForensicEngine';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dispute = getDisputeById(params.id);
  if (!dispute) {
    return NextResponse.json({ success: false, error: 'Dispute not found' }, { status: 404 });
  }

  // Artificial slight delay to simulate deep multi-agent LLM reasoning
  await new Promise((resolve) => setTimeout(resolve, 800));

  const analysis = runForensicAnalysis(dispute);
  return NextResponse.json({ success: true, analysis });
}
