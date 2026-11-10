export type DisputeReason =
  | 'MERCHANDISE_OR_SERVICE_NOT_RECEIVED'
  | 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED'
  | 'UNAUTHORISED'
  | 'INCORRECT_TRANSACTION_AMOUNT'
  | 'CANCELED_RECURRING_BILLING';

export type DisputeStatus =
  | 'REQUIRED_ACTION'
  | 'UNDER_REVIEW'
  | 'RESOLVED_SELLER_FAVOR'
  | 'RESOLVED_BUYER_FAVOR'
  | 'WAITING_FOR_BUYER_RESPONSE';

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  shippedDate: string;
  deliveredDate?: string;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'EXCEPTION';
  deliveryAddress: string;
  signedBy?: string;
}

export interface DisputeOrder {
  orderId: string;
  transactionId: string;
  date: string;
  itemTitle: string;
  itemDescription: string;
  itemPrice: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  buyerIp: string;
  shippingAddress: string;
  tracking?: TrackingInfo;
  orderNotes?: string;
  fulfillmentProofUrl?: string;
}

export interface DisputeMessage {
  postedBy: 'BUYER' | 'SELLER' | 'PAYPAL';
  time: string;
  content: string;
}

export interface PayPalDispute {
  dispute_id: string;
  create_time: string;
  update_time: string;
  dispute_amount: {
    currency_code: string;
    value: string;
  };
  reason: DisputeReason;
  status: DisputeStatus;
  dispute_life_cycle_stage: 'INQUIRY' | 'CHARGEBACK' | 'PRE_ARBITRATION' | 'ARBITRATION';
  seller_response_due_date: string;
  buyer_notes?: string;
  messages: DisputeMessage[];
  order: DisputeOrder;
  autoPilotEligible?: boolean;
  autoPilotStatus?: 'PENDING' | 'SUBMITTED' | 'SKIPPED';
}

export interface AIAnalysisResult {
  winProbability: number; // 0 to 100
  sellerProtectionEligibility: 'FULL' | 'PARTIAL' | 'INELIGIBLE';
  confidenceScore: number;
  recommendedAction: 'SUBMIT_EVIDENCE' | 'ISSUE_REFUND' | 'OFFER_PARTIAL' | 'ESCALATE_TO_ARBITRATION';
  keyStrengths: string[];
  vulnerabilities: string[];
  evidenceChecklist: {
    item: string;
    verified: boolean;
    note: string;
  }[];
  generatedDefenseStatement: string;
  suggestedDocuments: string[];
  executiveSummary: string;
}
