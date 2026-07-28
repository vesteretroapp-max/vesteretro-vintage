/**
 * Resend Email Service
 * 
 * Provides transactional email functionality for VesteRetro.
 * Sends order confirmations, shipping updates, and notifications.
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY: Resend API authentication key
 * - RESEND_FROM_EMAIL: Sender email address
 * - RESEND_FROM_NAME: Sender display name
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface OrderEmailData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  payment_method: string;
  shipping_address: string;
  shipping_method: string;
}

const RESEND_API = 'https://api.resend.com';

// Email templates
const templates = {
  orderConfirmation: (data: OrderEmailData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0b0b; color: #f8f5ed; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111414; border-radius: 4px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1a1c1c, #0d0e0e); padding: 30px; text-align: center; border-bottom: 2px solid #d6a632; }
        .logo { font-size: 28px; font-weight: bold; color: #d6a632; }
        .content { padding: 30px; }
        .order-number { font-size: 24px; color: #d6a632; margin: 20px 0; }
        .item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #2a2c2c; }
        .item-image { width: 60px; height: 70px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
        .item-details { flex: 1; }
        .item-name { font-weight: 600; margin-bottom: 5px; }
        .item-meta { font-size: 12px; color: #9b9b9b; }
        .item-price { font-weight: bold; color: #d6a632; }
        .totals { margin-top: 20px; padding-top: 20px; border-top: 2px solid #2a2c2c; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .total-row.final { font-size: 18px; font-weight: bold; color: #d6a632; margin-top: 15px; padding-top: 15px; border-top: 1px solid #2a2c2c; }
        .button { display: inline-block; background: #d6a632; color: #0a0b0b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .footer { background: #0d0e0e; padding: 20px; text-align: center; font-size: 12px; color: #9b9b9b; }
        .whatsapp { color: #25d366; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">VesteRetro</div>
          <p style="color: #9b9b9b; margin: 10px 0 0 0;">Vista a História</p>
        </div>
        
        <div class="content">
          <h2 style="color: #f8f5ed; margin-bottom: 5px;">Pedido Recebido!</h2>
          <p style="color: #9b9b9b; font-size: 14px;">Olá ${data.customer_name}, recebemos seu pedido.</p>
          
          <div class="order-number">${data.order_number}</div>
          
          <h3 style="color: #d6a632; font-size: 14px; margin: 30px 0 15px 0;">ITENS DO PEDIDO</h3>
          
          ${data.items.map(item => `
            <div class="item">
              ${item.image ? `<img src="${item.image}" alt="" class="item-image">` : ''}
              <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">Tamanho: ${item.size} · Qtd: ${item.quantity}</div>
              </div>
              <div class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}
          
          <div class="totals">
            <div class="total-row">
              <span style="color: #9b9b9b;">Subtotal</span>
              <span>R$ ${data.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span style="color: #9b9b9b;">Frete</span>
              <span>${data.shipping_cost === 0 ? 'Grátis' : `R$ ${data.shipping_cost.toFixed(2)}`}</span>
            </div>
            ${data.discount > 0 ? `
            <div class="total-row">
              <span style="color: #9b9b9b;">Desconto</span>
              <span style="color: #2ea66b;">- R$ ${data.discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="total-row final">
              <span>Total</span>
              <span>R$ ${data.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-top: 30px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">FORMA DE PAGAMENTO</h4>
            <p style="color: #f8f5ed; margin: 0;">${data.payment_method === 'whatsapp' ? 'Pagamento via WhatsApp' : data.payment_method}</p>
          </div>
          
          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-top: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">ENDEREÇO DE ENTREGA</h4>
            <p style="color: #f8f5ed; margin: 0; font-size: 14px;">${data.shipping_address}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${window?.location?.origin || 'https://vesteretro.com.br'}/meus-pedidos" class="button">
              ACOMPANHAR PEDIDO
            </a>
          </div>
          
          <p style="color: #9b9b9b; font-size: 12px; text-align: center; margin-top: 30px;">
            Precisa de ajuda? Fale conosco via <span class="whatsapp">WhatsApp</span>: 
            <a href="https://wa.me/5511987516823" style="color: #25d366;">+55 11 98751-6823</a>
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} VesteRetro - Vista a História</p>
          <p style="margin-top: 5px;">Camisas retrô premium</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  paymentApproved: (data: { order_number: string; customer_name: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0b0b; color: #f8f5ed; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111414; border-radius: 4px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1a1c1c, #0d0e0e); padding: 30px; text-align: center; border-bottom: 2px solid #2ea66b; }
        .logo { font-size: 28px; font-weight: bold; color: #d6a632; }
        .content { padding: 30px; text-align: center; }
        .success-icon { font-size: 64px; margin-bottom: 20px; }
        .order-number { font-size: 24px; color: #d6a632; margin: 20px 0; }
        .footer { background: #0d0e0e; padding: 20px; text-align: center; font-size: 12px; color: #9b9b9b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">VesteRetro</div>
        </div>
        <div class="content">
          <div class="success-icon">✅</div>
          <h2 style="color: #2ea66b;">Pagamento Aprovado!</h2>
          <p style="color: #9b9b9b;">Olá ${data.customer_name}, seu pagamento foi confirmado.</p>
          <div class="order-number">${data.order_number}</div>
          <p style="color: #f8f5ed;">Seu pedido já está sendo preparado para envio.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} VesteRetro</p>
        </div>
      </div>
    </body>
    </html>
  `,
  
  orderShipped: (data: { order_number: string; customer_name: string; tracking_code?: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0b0b; color: #f8f5ed; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111414; border-radius: 4px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1a1c1c, #0d0e0e); padding: 30px; text-align: center; border-bottom: 2px solid #d6a632; }
        .logo { font-size: 28px; font-weight: bold; color: #d6a632; }
        .content { padding: 30px; text-align: center; }
        .shipping-icon { font-size: 64px; margin-bottom: 20px; }
        .tracking-code { background: #1a1c1c; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: monospace; color: #d6a632; }
        .footer { background: #0d0e0e; padding: 20px; text-align: center; font-size: 12px; color: #9b9b9b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">VesteRetro</div>
        </div>
        <div class="content">
          <div class="shipping-icon">📦</div>
          <h2 style="color: #d6a632;">Pedido Enviado!</h2>
          <p style="color: #9b9b9b;">Olá ${data.customer_name}, seu pedido foi enviado.</p>
          <p style="color: #f8f5ed;">Pedido: ${data.order_number}</p>
          ${data.tracking_code ? `
          <div class="tracking-code">
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #9b9b9b;">Código de Rastreamento</p>
            <p style="margin: 0; font-size: 18px;">${data.tracking_code}</p>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} VesteRetro</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

export class ResendEmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;
  isConfigured: boolean;
  
  constructor() {
    this.apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
    this.fromEmail = import.meta.env.VITE_RESEND_FROM_EMAIL || 'noreply@vesteretro.com.br';
    this.fromName = import.meta.env.VITE_RESEND_FROM_NAME || 'VesteRetro';
    
    this.isConfigured = Boolean(this.apiKey);
    
    if (this.isConfigured) {
      console.log('[Resend] Email service configured');
    } else {
      console.warn('[Resend] Not configured - emails will be logged only');
    }
  }
  
  private async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      console.log('[Resend Demo] Email would be sent:', {
        to: options.to,
        subject: options.subject,
        htmlLength: options.html.length,
      });
      return true;
    }
    
    try {
      const response = await fetch(`${RESEND_API}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
          reply_to: options.replyTo,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error('[Resend] Email send error:', error);
        return false;
      }
      
      const result = await response.json();
      console.log('[Resend] Email sent successfully:', result.id);
      return true;
    } catch (error) {
      console.error('[Resend] Email send error:', error);
      return false;
    }
  }
  
  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    const html = templates.orderConfirmation(data);
    
    return this.sendEmail({
      to: data.customer_email,
      subject: `Recebemos seu pedido ${data.order_number} | VesteRetro`,
      html,
    });
  }
  
  async sendPaymentApproved(orderNumber: string, customerName: string, customerEmail: string): Promise<boolean> {
    const html = templates.paymentApproved({
      order_number: orderNumber,
      customer_name: customerName,
    });
    
    return this.sendEmail({
      to: customerEmail,
      subject: `Pagamento aprovado - Pedido ${orderNumber} | VesteRetro`,
      html,
    });
  }
  
  async sendOrderShipped(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    trackingCode?: string
  ): Promise<boolean> {
    const html = templates.orderShipped({
      order_number: orderNumber,
      customer_name: customerName,
      tracking_code: trackingCode,
    });
    
    return this.sendEmail({
      to: customerEmail,
      subject: `Pedido ${orderNumber} enviado | VesteRetro`,
      html,
    });
  }
  
  async sendPasswordReset(email: string, resetUrl: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; background-color: #0a0b0b; color: #f8f5ed; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #111414; border-radius: 4px; padding: 30px; text-align: center; }
          .logo { font-size: 28px; font-weight: bold; color: #d6a632; margin-bottom: 30px; }
          .button { display: inline-block; background: #d6a632; color: #0a0b0b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 12px; color: #9b9b9b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">VesteRetro</div>
          <h2>Redefinir Senha</h2>
          <p style="color: #9b9b9b;">Clique no botão abaixo para redefinir sua senha.</p>
          <a href="${resetUrl}" class="button">REDEFINIR SENHA</a>
          <p style="color: #9b9b9b; font-size: 12px; margin-top: 20px;">
            Se você não solicitou a redefinição, ignore este e-mail.
          </p>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VesteRetro</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return this.sendEmail({
      to: email,
      subject: 'Redefinir Senha | VesteRetro',
      html,
    });
  }
}

// Singleton instance
let resendInstance: ResendEmailService | null = null;

export function getResendEmailService(): ResendEmailService {
  if (!resendInstance) {
    resendInstance = new ResendEmailService();
  }
  return resendInstance;
}

export default {
  getResendEmailService,
  ResendEmailService,
};
