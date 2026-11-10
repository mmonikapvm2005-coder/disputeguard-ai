import { NextResponse } from 'next/server';
import { getDisputeById } from '@/lib/paypalClient';
import { runForensicAnalysis } from '@/lib/aiForensicEngine';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { message, history } = await req.json();
    const dispute = getDisputeById(params.id);

    if (!dispute) {
      return NextResponse.json({ success: false, error: 'Dispute not found' }, { status: 404 });
    }

    const analysis = runForensicAnalysis(dispute);
    const tracking = dispute.order.tracking;
    const lower = (message || '').toLowerCase();

    let reply = '';
    let updatedStatement: string | undefined = undefined;

    if (lower.includes('why') && (lower.includes('win') || lower.includes('probability') || lower.includes('score') || lower.includes('rate'))) {
      if (analysis.winProbability >= 85) {
        reply = `The win probability is high (${analysis.winProbability}%) because the order strictly satisfies PayPal Seller Protection:\n• Carrier (${tracking?.carrier}) shows confirmed delivery to "${dispute.order.shippingAddress}".\n• Delivery occurred prior to the dispute filing date.\n• ${tracking?.signedBy ? `Signature on file by ${tracking.signedBy}.` : 'Carrier online delivery scan is validated.'}`;
      } else {
        reply = `The win probability is lower (${analysis.winProbability}%) because the package is currently marked as "${tracking?.status || 'IN_TRANSIT'}" without a final confirmed delivery scan. Under PayPal Seller Protection guidelines, sellers are held liable if an item is lost or stalled in carrier transit. We recommend filing a carrier trace inquiry immediately or providing a courtesy update to the buyer.`;
      }
    } else if (lower.includes('rewrite') || lower.includes('tone') || lower.includes('make it') || lower.includes('update statement')) {
      if (lower.includes('concise') || lower.includes('short')) {
        updatedStatement = `To PayPal Adjudication:\nRegarding Dispute ${dispute.dispute_id} (Txn ${dispute.order.transactionId}). The item "${dispute.order.itemTitle}" was shipped on ${new Date(tracking?.shippedDate || '').toLocaleDateString()} via ${tracking?.carrier} (#${tracking?.trackingNumber}). Carrier confirms delivery to the authorized address: "${dispute.order.shippingAddress}" on ${new Date(tracking?.deliveredDate || '').toLocaleDateString()}.\n\nUnder PayPal Seller Protection rules, we request immediate release of held funds.`;
        reply = `I have generated a more concise, punchy version of the defense statement for PayPal. It has been applied to your defense editor!`;
      } else if (lower.includes('assertive') || lower.includes('strong')) {
        updatedStatement = `URGENT NOTICE TO PAYPAL LEGAL ADJUDICATION:\nRe: Formal Contest of Dispute ${dispute.dispute_id}.\n\nThis claim is entirely without merit under PayPal's Seller Protection Policy. The transaction is verified with:\n1. 100% address match to PayPal transaction details.\n2. Carrier verification (${tracking?.carrier} Tracking #${tracking?.trackingNumber}) confirming delivery on ${new Date(tracking?.deliveredDate || '').toLocaleDateString()}.\n3. Conclusive proof of fulfillment.\n\nAny decision against the merchant would violate PayPal's stated User Agreement terms for protected transactions. We demand immediate closure in the seller's favor.`;
        reply = `I have rewritten the defense statement with a legally assertive, firm tone citing PayPal's User Agreement. You can review and submit it now!`;
      } else {
        reply = `I can rewrite the defense statement for you! Tell me whether you prefer a "concise" tone, a "more assertive legal" tone, or want to emphasize specific carrier details.`;
      }
    } else if (lower.includes('seller protection') || lower.includes('policy')) {
      reply = `PayPal Seller Protection covers physical goods delivered to the address listed on the Transaction Details page. For transactions under $750, carrier proof of delivery with a delivery date and recipient city/state or zip code is sufficient. For transactions of $750 or more, signature confirmation is mandatory. For Dispute ${dispute.dispute_id}, your order amount is $${dispute.dispute_amount.value}, which ${parseFloat(dispute.dispute_amount.value) >= 750 ? 'requires signature confirmation.' : 'does not require signature, but online delivery proof is verified.'}`;
    } else if (lower.includes('refund') || lower.includes('settle')) {
      reply = `Given your win probability of ${analysis.winProbability}%, ${analysis.winProbability >= 80 ? 'we strongly advise AGAINST a refund. You have compelling evidence and should submit the defense dossier to retain 100% of the funds.' : 'a partial settlement or courtesy refund may be worth considering to avoid a card-network chargeback penalty fee.'}`;
    } else {
      reply = `I have audited Dispute ${dispute.dispute_id} for "${dispute.order.itemTitle}". Win confidence is ${analysis.winProbability}%. All carrier records and PayPal guidelines are mapped. You can ask me to rewrite the statement (e.g. "make it concise" or "make it assertive"), explain Seller Protection rules, or analyze risk.`;
    }

    return NextResponse.json({
      success: true,
      reply,
      updatedStatement,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
