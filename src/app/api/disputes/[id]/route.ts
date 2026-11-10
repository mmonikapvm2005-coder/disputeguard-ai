import { NextResponse } from 'next/server';
import { getDisputeById } from '@/lib/paypalClient';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const dispute = getDisputeById(params.id);
  if (!dispute) {
    return NextResponse.json({ success: false, error: 'Dispute not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, dispute });
}
