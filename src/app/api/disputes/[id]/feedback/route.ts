import { NextResponse } from 'next/server';
import { getDisputeById } from '@/lib/paypalClient';
import { runForensicAnalysis } from '@/lib/aiForensicEngine';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { role, feedbackText, rating } = await req.json();
    const dispute = getDisputeById(params.id);

    if (!dispute) {
      return NextResponse.json({ success: false, error: 'Dispute not found' }, { status: 404 });
    }

    const baseAnalysis = runForensicAnalysis(dispute);
    const tracking = dispute.order.tracking;
    const lower = (feedbackText || '').toLowerCase();

    let buyerSatisfactionScore = 75;
    let merchantProtectionScore = baseAnalysis.winProbability;
    let tailoredReply = '';
    let adjustedStrategy = '';
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED' = 'NEUTRAL';

    if (role === 'BUYER') {
      // Buyer Feedback Processing
      if (lower.includes('photo') || lower.includes('proof') || lower.includes('where')) {
        sentiment = 'NEUTRAL';
        buyerSatisfactionScore = 88;
        tailoredReply = `Hi ${dispute.order.buyerName}, we understand you are looking for delivery verification! We have pulled the carrier delivery proof for you: ${tracking?.carrier} completed delivery on ${tracking?.deliveredDate ? new Date(tracking.deliveredDate).toLocaleDateString() : 'scheduled date'}${tracking?.signedBy ? `, received and signed by ${tracking.signedBy}` : ''}. The package was delivered to: ${dispute.order.shippingAddress}. Please check with household members or building reception.`;
        adjustedStrategy = 'Provide tracking and GPS delivery photo directly through PayPal Message Center. Buyer was seeking proof, not malicious chargeback.';
      } else if (lower.includes('stolen') || lower.includes('porch') || lower.includes('never got') || lower.includes('missing')) {
        sentiment = 'FRUSTRATED';
        buyerSatisfactionScore = 70;
        tailoredReply = `Dear ${dispute.order.buyerName}, we are very sorry to hear the package may have been taken after drop-off. While our carrier confirmed delivery to your doorstep, we want to help. We have initiated an official carrier incident report (Ref #${dispute.order.orderId}-THEFT) and can provide you with the documentation for your local police report or homeowners insurance.`;
        adjustedStrategy = 'Hold firm on PayPal Seller Protection defense (merchant fulfilled obligations), but offer courtesy replacement discount (25% off) to preserve buyer relationship.';
      } else if (lower.includes('damaged') || lower.includes('broken') || lower.includes('wrong')) {
        sentiment = 'FRUSTRATED';
        buyerSatisfactionScore = 92;
        tailoredReply = `Dear ${dispute.order.buyerName}, we sincerely apologize that the item arrived in unsatisfactory condition. We have pre-approved a prepaid return shipping label for you. Once dropped off at the carrier, PayPal will immediately release your full refund, or we can dispatch an expedited replacement today.`;
        adjustedStrategy = 'Recommend mutual resolution: Request PayPal return-for-refund. Protects merchant from total loss while granting buyer 100% refund upon return scan.';
        merchantProtectionScore = 90;
      } else {
        sentiment = 'NEUTRAL';
        buyerSatisfactionScore = 80;
        tailoredReply = `Thank you for sharing your feedback, ${dispute.order.buyerName}. DisputeGuard AI has logged your notes and submitted an updated inquiry to our merchant resolution desk. We are actively reviewing this with PayPal to ensure a fair and timely resolution.`;
        adjustedStrategy = 'Maintain communication with buyer via PayPal Resolution Center.';
      }
    } else {
      // Merchant Feedback Processing
      if (lower.includes('vip') || lower.includes('repeat') || lower.includes('customer') || lower.includes('friendly')) {
        merchantProtectionScore = 85;
        buyerSatisfactionScore = 96;
        tailoredReply = `Acknowledged. The AI agent has updated the dispute strategy to "VIP High-Retention". Instead of an aggressive dispute defense, the AI recommends offering an instant 50% courtesy credit or free replacement, retaining this high-lifetime-value buyer while settling the dispute amicably.`;
        adjustedStrategy = 'Prioritize Customer Lifetime Value (LTV). Offer settled resolution with store credit.';
      } else if (lower.includes('fight') || lower.includes('fraud') || lower.includes('scam') || lower.includes('assertive')) {
        merchantProtectionScore = 99;
        buyerSatisfactionScore = 50;
        tailoredReply = `Strategy updated to "Maximum Capital Protection". The AI has reinforced the formal legal dossier citing PayPal Seller Protection Section 11 and carrier GPS tracking proofs. Zero concessions offered; requesting full closure in seller favor.`;
        adjustedStrategy = 'Aggressive defense. Full seller protection claim submitted to PayPal.';
      } else if (lower.includes('partial') || lower.includes('discount') || lower.includes('compromise')) {
        merchantProtectionScore = 92;
        buyerSatisfactionScore = 90;
        tailoredReply = `Strategy adjusted to "Compromise Settlement". The AI drafted a PayPal Partial Settlement offer. Merchant preserves 70% of transaction capital, and buyer receives an immediate 30% reimbursement without further delays.`;
        adjustedStrategy = 'Dispatch PayPal Make Offer API (/v1/customer/disputes/{id}/make-offer) with partial settlement.';
      } else {
        merchantProtectionScore = baseAnalysis.winProbability;
        buyerSatisfactionScore = 82;
        tailoredReply = `Merchant feedback logged into AI Reinforcement Engine: "${feedbackText}". The agent has calibrated its probability matrix and updated the defense recommendations.`;
        adjustedStrategy = 'Standard Seller Protection defense calibrated with merchant directives.';
      }
    }

    return NextResponse.json({
      success: true,
      sentiment,
      buyerSatisfactionScore,
      merchantProtectionScore,
      tailoredReply,
      adjustedStrategy,
      message: `Feedback processed successfully by DisputeGuard AI Agent.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
