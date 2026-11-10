import { NextResponse } from 'next/server';
import { submitEvidenceToPayPal } from '@/lib/paypalClient';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { statement, evidenceType } = await req.json();
    const result = await submitEvidenceToPayPal(params.id, statement, evidenceType);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
