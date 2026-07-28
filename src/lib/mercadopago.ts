/**
 * Mercado Pago Payment Provider
 * 
 * Integrates with Mercado Pago API for PIX, Credit Card, and Boleto payments.
 * Supports both sandbox and production environments.
 * 
 * Environment Variables Required:
 * - MERCADO_PAGO_ACCESS_TOKEN: Access token for API authentication
 * - MERCADO_PAGO_PUBLIC_KEY: Public key for frontend (card tokenization)
 * - MERCADO_PAGO_ENVIRONMENT: 'sandbox' or 'production'
 */

import type {
  PaymentProvider,
  PaymentMethod,
  PaymentStatus,
  PaymentResult,
  PayerInfo,
} from './payment-provider';

const MERCADO_PAGO_API = {
  sandbox: 'https://api.mercadopago.com/v1',
  production: 'https://api.mercadopago.com/v1',
};

export class MercadoPagoProvider implements PaymentProvider {
  name = 'Mercado Pago';
  isConfigured: boolean;
  environment: 'sandbox' | 'production';
  
  private accessToken: string;
  private publicKey: string;
  private siteUrl: string;
  
  constructor() {
    this.accessToken = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || '';
    this.publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '';
    this.environment = (import.meta.env.VITE_MERCADO_PAGO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
    this.siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    this.isConfigured = Boolean(this.accessToken);
    
    if (this.isConfigured) {
      console.log(`[Mercado Pago] Configured in ${this.environment} mode`);
    } else {
      console.warn('[Mercado Pago] Not configured - using demo mode');
    }
  }
  
  private getApiUrl(): string {
    return MERCADO_PAGO_API[this.environment];
  }
  
  private async request(path: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.getApiUrl()}${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Mercado Pago API error: ${response.status} - ${JSON.stringify(error)}`);
    }
    
    return response.json();
  }
  
  async createPixPayment(
    amount: number,
    description: string,
    externalReference: string,
    payer?: PayerInfo
  ): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return this.fallbackPixPayment(amount, description, externalReference);
    }
    
    try {
      const body = {
        transaction_amount: amount,
        description,
        external_reference: externalReference,
        payment_method_id: 'pix',
        date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        payer: payer ? {
          email: payer.email,
          first_name: payer.first_name,
          last_name: payer.last_name,
          identification: payer.identification,
        } : undefined,
      };
      
      const result = await this.request('/payments', {
        method: 'POST',
        body: JSON.stringify(body),
      }) as Record<string, unknown>;
      
      const pointOfInteraction = result.pointOfInteraction as Record<string, unknown> | undefined;
      const transactionData = pointOfInteraction?.transactionData as Record<string, unknown> | undefined;
      
      return {
        success: true,
        payment_id: String(result.id),
        external_reference: String(result.external_reference),
        status: this.mapStatus(String(result.status)),
        status_detail: String(result.status_detail || ''),
        pix_qr_code: String(transactionData?.qr_code || ''),
        pix_qr_code_base64: String(transactionData?.qr_code_base64 || ''),
        pix_qr_code_link: String(transactionData?.ticket_url || ''),
        pix_expiration: String(result.date_of_expiration || ''),
        amount: Number(result.transaction_amount),
        currency: String(result.currency_id || 'BRL'),
      };
    } catch (error) {
      console.error('[Mercado Pago] PIX payment error:', error);
      return {
        success: false,
        error_code: 'PIX_CREATION_FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to create PIX payment',
      };
    }
  }
  
  async createCardPayment(
    amount: number,
    description: string,
    externalReference: string,
    installments: number,
    token?: string,
    payer?: PayerInfo
  ): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return this.fallbackCardPayment(amount, description, externalReference, installments);
    }
    
    if (!token) {
      return {
        success: false,
        error_code: 'TOKEN_REQUIRED',
        error_message: 'Card token is required for card payments',
      };
    }
    
    try {
      const body = {
        transaction_amount: amount,
        description,
        external_reference: externalReference,
        payment_method_id: 'visa', // Will be determined by token
        installments,
        token,
        payer: payer ? {
          email: payer.email,
          identification: payer.identification,
        } : undefined,
      };
      
      const result = await this.request('/payments', {
        method: 'POST',
        body: JSON.stringify(body),
      }) as Record<string, unknown>;
      
      return {
        success: true,
        payment_id: String(result.id),
        external_reference: String(result.external_reference),
        status: this.mapStatus(String(result.status)),
        status_detail: String(result.status_detail || ''),
        installments: Number(result.installments || installments),
        installment_amount: amount / installments,
        amount: Number(result.transaction_amount),
        currency: String(result.currency_id || 'BRL'),
      };
    } catch (error) {
      console.error('[Mercado Pago] Card payment error:', error);
      return {
        success: false,
        error_code: 'CARD_PAYMENT_FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to create card payment',
      };
    }
  }
  
  async createBoletoPayment(
    amount: number,
    description: string,
    externalReference: string,
    payer?: PayerInfo
  ): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return this.fallbackBoletoPayment(amount, description, externalReference);
    }
    
    try {
      const body = {
        transaction_amount: amount,
        description,
        external_reference: externalReference,
        payment_method_id: 'bolbradesco',
        date_of_expiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        payer: payer ? {
          email: payer.email,
          first_name: payer.first_name,
              identification: payer.identification,
          address: payer.identification ? {
            zip_code: '',
            street_name: '',
            street_number: '',
          } : undefined,
        } : undefined,
      };
      
      const result = await this.request('/payments', {
        method: 'POST',
        body: JSON.stringify(body),
      }) as Record<string, unknown>;
      
      const transactionDetails = result.transaction_details as Record<string, unknown> | undefined;
      
      return {
        success: true,
        payment_id: String(result.id),
        external_reference: String(result.external_reference),
        status: this.mapStatus(String(result.status)),
        status_detail: String(result.status_detail || ''),
        boleto_url: String(transactionDetails?.external_resource_url || ''),
        boleto_barcode: String((transactionDetails?.bankInfo as Record<string, unknown>)?.digitableLine || ''),
        boleto_expiration: String(result.date_of_expiration || ''),
        amount: Number(result.transaction_amount),
        currency: String(result.currency_id || 'BRL'),
      };
    } catch (error) {
      console.error('[Mercado Pago] Boleto payment error:', error);
      return {
        success: false,
        error_code: 'BOLETO_CREATION_FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to create boleto payment',
      };
    }
  }
  
  async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return {
        success: true,
        payment_id: paymentId,
        status: 'approved',
        amount: 0,
        currency: 'BRL',
      };
    }
    
    try {
      const result = await this.request(`/payments/${paymentId}`) as Record<string, unknown>;
      
      return {
        success: true,
        payment_id: String(result.id),
        external_reference: String(result.external_reference || ''),
        status: this.mapStatus(String(result.status)),
        status_detail: String(result.status_detail || ''),
        amount: Number(result.transaction_amount),
        currency: String(result.currency_id || 'BRL'),
      };
    } catch (error) {
      console.error('[Mercado Pago] Get payment status error:', error);
      return {
        success: false,
        error_code: 'STATUS_FETCH_FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to get payment status',
      };
    }
  }
  
  async cancelPayment(paymentId: string): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return {
        success: true,
        payment_id: paymentId,
        status: 'cancelled',
      };
    }
    
    try {
      const result = await this.request(`/payments/${paymentId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'cancelled' }),
      }) as Record<string, unknown>;
      
      return {
        success: true,
        payment_id: String(result.id),
        status: 'cancelled',
        status_detail: String(result.status_detail || ''),
      };
    } catch (error) {
      console.error('[Mercado Pago] Cancel payment error:', error);
      return {
        success: false,
        error_code: 'CANCEL_FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to cancel payment',
      };
    }
  }
  
  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    if (!this.isConfigured) {
      return {
        success: true,
        payment_id: paymentId,
        status: 'refunded',
        amount,
      };
    }
    
    try {
      const body = amount ? { amount } : {};
      
      const result = await this.request(`/payments/${paymentId}/refunds`, {
        method: 'POST',
        body: JSON.stringify(body),
      }) as Record<string, unknown>;
      
      return {
        success: true,
        payment_id: String(result.payment_id),
        status: 'refunded',
        amount: Number(result.amount),
        status_detail: String(result.status || ''),
      };
    } catch (error) {
      console.error('[Mercado Pago] Refund payment error:', error);
      return {
        success: false,
        error_code: 'REFUND_FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to refund payment',
      };
    }
  }
  
  async processWebhook(
    payload: Record<string, unknown>,
    headers?: Record<string, string>
  ): Promise<{
    payment_id: string;
    external_reference: string;
    status: PaymentStatus;
    status_detail: string;
  }> {
    try {
      const resource = payload.resource as string;
      const action = payload.action as string;
      
      // Extract payment ID from resource URL
      const paymentIdMatch = resource?.match(/\/payments\/(\d+)/);
      if (!paymentIdMatch) {
        throw new Error('Invalid webhook resource');
      }
      
      const paymentId = paymentIdMatch[1];
      
      // Fetch full payment details
      const paymentResult = await this.getPaymentStatus(paymentId);
      
      if (!paymentResult.success) {
        throw new Error('Failed to fetch payment details');
      }
      
      return {
        payment_id: paymentId,
        external_reference: paymentResult.external_reference || '',
        status: paymentResult.status || 'pending',
        status_detail: paymentResult.status_detail || '',
      };
    } catch (error) {
      console.error('[Mercado Pago] Webhook processing error:', error);
      throw error;
    }
  }
  
  // Helper methods
  
  private mapStatus(mpStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'pending': 'pending',
      'approved': 'approved',
      'authorized': 'approved',
      'in_process': 'in_review',
      'in_review': 'in_review',
      'rejected': 'declined',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'charged_back': 'refunded',
      'expired': 'expired',
    };
    
    return statusMap[mpStatus] || 'pending';
  }
  
  // Fallback methods when not configured
  
  private fallbackPixPayment(
    amount: number,
    description: string,
    externalReference: string
  ): PaymentResult {
    console.log('[Mercado Pago Demo] Creating PIX payment:', { amount, externalReference });
    
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136vesteretro@example.com5204000053039865404${amount.toFixed(2)}5802BR5913VESTE RETRO6009SAO PAULO62070503***6304`;
    
    return {
      success: true,
      payment_id: `mp_demo_${Date.now()}`,
      external_reference: externalReference,
      status: 'pending',
      pix_qr_code: pixCode,
      pix_qr_code_base64: '',
      pix_qr_code_link: '',
      pix_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      amount,
      currency: 'BRL',
    };
  }
  
  private fallbackCardPayment(
    amount: number,
    description: string,
    externalReference: string,
    installments: number
  ): PaymentResult {
    console.log('[Mercado Pago Demo] Creating card payment:', { amount, externalReference, installments });
    
    return {
      success: true,
      payment_id: `mp_demo_${Date.now()}`,
      external_reference: externalReference,
      status: 'approved',
      installments,
      installment_amount: amount / installments,
      amount,
      currency: 'BRL',
    };
  }
  
  private fallbackBoletoPayment(
    amount: number,
    description: string,
    externalReference: string
  ): PaymentResult {
    console.log('[Mercado Pago Demo] Creating boleto payment:', { amount, externalReference });
    
    return {
      success: true,
      payment_id: `mp_demo_${Date.now()}`,
      external_reference: externalReference,
      status: 'pending',
      boleto_url: '',
      boleto_barcode: '23793.38128 60000.000003 00000.000400 1 84340000019990',
      boleto_expiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      amount,
      currency: 'BRL',
    };
  }
}

export default MercadoPagoProvider;
