import { NextResponse } from 'next/server';
import { fetchDisputes, addSimulatedDispute, resetDisputes } from '@/lib/paypalClient';

export async function GET() {
  try {
    const disputes = await fetchDisputes();
    return NextResponse.json({ success: true, disputes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'reset') {
      resetDisputes();
      const disputes = await fetchDisputes();
      return NextResponse.json({ success: true, disputes });
    }

    const created = addSimulatedDispute(body);
    return NextResponse.json({ success: true, dispute: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
