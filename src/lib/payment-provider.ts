/**
 * Payment Provider Abstraction Layer
 * 
 * This module provides a unified interface for payment processing.
 * Currently supports Mercado Pago (sandbox/production).
 * Can be extended to support Stripe, PagSeguro, etc.
 */

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'whatsapp';

export type PaymentStatus = 
  | 'pending' 
  | 'awaiting_payment' 
  | 'in_review' 
  | 'approved' 
  | 'declined' 
  | 'cancelled' 
  | 'refunded' 
  | 'expired';

export type OrderStatus = 
  | 'pending'
  | 'awaiting_payment'
  | 'payment_review'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface PaymentItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

export interface PayerInfo {
  email: string;
  first_name?: string;
  last_name?: string;
  identification?: {
    type: string;
    number: string;
  };
}

export interface PaymentResult {
  success: boolean;
  payment_id?: string;
  external_reference?: string;
  status?: PaymentStatus;
  status_detail?: string;
  // PIX specific
  pix_qr_code?: string;
  pix_qr_code_base64?: string;
  pix_qr_code_link?: string;
  pix_expiration?: string;
  // Boleto specific
  boleto_url?: string;
  boleto_barcode?: string;
  boleto_expiration?: string;
  // Card specific
  installments?: number;
  installment_amount?: number;
  // Common
  amount?: number;
  currency?: string;
  error_code?: string;
  error_message?: string;
}

export interface PaymentProvider {
  name: string;
  isConfigured: boolean;
  environment: 'sandbox' | 'production';
  
  // Create payment
  createPixPayment(
    amount: number,
    description: string,
    externalReference: string,
    payer?: PayerInfo
  ): Promise<PaymentResult>;
  
  createCardPayment(
    amount: number,
    description: string,
    externalReference: string,
    installments: number,
    token?: string,
    payer?: PayerInfo
  ): Promise<PaymentResult>;
  
  createBoletoPayment(
    amount: number,
    description: string,
    externalReference: string,
    payer?: PayerInfo
  ): Promise<PaymentResult>;
  
  // Get payment status
  getPaymentStatus(paymentId: string): Promise<PaymentResult>;
  
  // Cancel payment
  cancelPayment(paymentId: string): Promise<PaymentResult>;
  
  // Refund payment
  refundPayment(paymentId: string, amount?: number): Promise<PaymentResult>;
  
  // Process webhook
  processWebhook(payload: unknown, headers?: Record<string, string>): Promise<{
    payment_id: string;
    external_reference: string;
    status: PaymentStatus;
    status_detail: string;
  }>;
}

// Payment provider instance (singleton)
let paymentProvider: PaymentProvider | null = null;

export async function getPaymentProvider(): Promise<PaymentProvider> {
  if (paymentProvider) {
    return paymentProvider;
  }
  
  // Try to load Mercado Pago provider
  const { MercadoPagoProvider } = await import('./mercadopago');
  const provider = new MercadoPagoProvider();
  
  if (provider.isConfigured) {
    paymentProvider = provider;
    return provider;
  }
  
  // Fallback to demo provider
  paymentProvider = new DemoPaymentProvider();
  return paymentProvider;
}

// Demo Payment Provider (fallback when no real provider is configured)
class DemoPaymentProvider implements PaymentProvider {
  name = 'Demo';
  isConfigured = false;
  environment = 'sandbox' as const;
  
  private generateId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
  
  async createPixPayment(
    amount: number,
    description: string,
    externalReference: string
  ): Promise<PaymentResult> {
    console.log('[Demo Payment] Creating PIX payment:', { amount, description, externalReference });
    
    return {
      success: true,
      payment_id: this.generateId(),
      external_reference: externalReference,
      status: 'pending',
      pix_qr_code: `00020126580014BR.GOV.BCB.PIX0136vesteretro@example.com5204000053039865404${amount.toFixed(2)}5802BR5913VESTE RETRO6009SAO PAULO62070503***6304`,
      pix_qr_code_base64: '',
      pix_qr_code_link: '',
      pix_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      amount,
      currency: 'BRL',
    };
  }
  
  async createCardPayment(
    amount: number,
    description: string,
    externalReference: string,
    installments: number
  ): Promise<PaymentResult> {
    console.log('[Demo Payment] Creating card payment:', { amount, description, externalReference, installments });
    
    return {
      success: true,
      payment_id: this.generateId(),
      external_reference: externalReference,
      status: 'approved',
      installments,
      installment_amount: amount / installments,
      amount,
      currency: 'BRL',
    };
  }
  
  async createBoletoPayment(
    amount: number,
    description: string,
    externalReference: string
  ): Promise<PaymentResult> {
    console.log('[Demo Payment] Creating boleto payment:', { amount, description, externalReference });
    
    return {
      success: true,
      payment_id: this.generateId(),
      external_reference: externalReference,
      status: 'pending',
      boleto_url: '',
      boleto_barcode: '23793.38128 60000.000003 00000.000400 1 84340000019990',
      boleto_expiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      amount,
      currency: 'BRL',
    };
  }
  
  async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    console.log('[Demo Payment] Getting payment status:', paymentId);
    
    return {
      success: true,
      payment_id: paymentId,
      status: 'approved',
      amount: 0,
      currency: 'BRL',
    };
  }
  
  async cancelPayment(paymentId: string): Promise<PaymentResult> {
    console.log('[Demo Payment] Cancelling payment:', paymentId);
    
    return {
      success: true,
      payment_id: paymentId,
      status: 'cancelled',
    };
  }
  
  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    console.log('[Demo Payment] Refunding payment:', paymentId, amount);
    
    return {
      success: true,
      payment_id: paymentId,
      status: 'refunded',
      amount,
    };
  }
  
  async processWebhook(payload: unknown): Promise<{
    payment_id: string;
    external_reference: string;
    status: PaymentStatus;
    status_detail: string;
  }> {
    console.log('[Demo Payment] Processing webhook:', payload);
    
    return {
      payment_id: '',
      external_reference: '',
      status: 'approved',
      status_detail: 'approved',
    };
  }
}

export default {
  getPaymentProvider,
};
