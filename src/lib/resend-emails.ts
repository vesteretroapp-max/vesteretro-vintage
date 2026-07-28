/**
 * Resend Email Service
 *
 * Provides transactional email functionality for VesteRetro.
 * Uses Supabase Edge Function to keep API key secure on server side.
 *
 * Environment Variables Required (in Supabase Edge Function):
 * - RESEND_API_KEY: Resend API authentication key
 * - RESEND_FROM_EMAIL: Sender email address (vesteretro.app@gmail.com)
 * - RESEND_FROM_NAME: Sender display name (VesteRetro)
 * - ADMIN_EMAIL: Admin notification email (vesteretro.app@gmail.com)
 *
 * NOTE: Auth emails (signup confirmation, password reset) are handled by Supabase Auth.
 * This service handles transactional emails (orders, notifications, etc.)
 */

import { supabase } from "@/lib/supabase";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  type?: string;
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

// ==================================================
// EMAIL TEMPLATES
// ==================================================

const baseStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0b0b; color: #f8f5ed; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background: #111414; border-radius: 4px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #1a1c1c, #0d0e0e); padding: 30px; text-align: center; border-bottom: 2px solid #d6a632; }
  .logo { font-size: 28px; font-weight: bold; color: #d6a632; letter-spacing: 2px; }
  .content { padding: 30px; }
  .footer { background: #0d0e0e; padding: 20px; text-align: center; font-size: 12px; color: #9b9b9b; }
  .gold { color: #d6a632; }
  .muted { color: #9b9b9b; }
  .success { color: #2ea66b; }
  .danger { color: #c94b4b; }
  .button { display: inline-block; background: #d6a632; color: #0a0b0b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
  .button-outline { display: inline-block; border: 1px solid #d6a632; color: #d6a632; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; }
  .whatsapp { color: #25d366; }
`;

function headerHtml(title?: string) {
  return `
    <div class="header">
      <div class="logo">VESTERETRO</div>
      ${title ? `<p style="color: #9b9b9b; margin: 10px 0 0 0; font-size: 14px;">${title}</p>` : ''}
    </div>
  `;
}

function footerHtml() {
  return `
    <div class="footer">
      <p>© ${new Date().getFullYear()} VesteRetro — Vista a História</p>
      <p style="margin-top: 5px;">Camisas retrô premium</p>
      <p style="margin-top: 10px;">
        <a href="https://wa.me/5511987516823" style="color: #25d366; text-decoration: none;">WhatsApp: +55 11 98751-6823</a>
      </p>
    </div>
  `;
}

const templates = {
  // ==================================================
  // ORDER CONFIRMATION
  // ==================================================
  orderConfirmation: (data: OrderEmailData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Pedido Recebido')}

        <div class="content">
          <h2 style="color: #f8f5ed; margin-bottom: 5px;">Pedido Recebido! 🎉</h2>
          <p style="color: #9b9b9b; font-size: 14px;">Olá ${data.customer_name}, recebemos seu pedido e já estamos preparando tudo.</p>

          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${data.order_number}</div>

          <h3 style="color: #d6a632; font-size: 12px; margin: 30px 0 15px 0; letter-spacing: 1px;">ITENS DO PEDIDO</h3>

          ${data.items.map(item => `
            <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #2a2c2c;">
              ${item.image ? `<img src="${item.image}" alt="" style="width: 60px; height: 70px; object-fit: cover; border-radius: 4px; margin-right: 15px;">` : ''}
              <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 5px;">${item.name}</div>
                <div style="font-size: 12px; color: #9b9b9b;">Tamanho: ${item.size} · Qtd: ${item.quantity}</div>
              </div>
              <div style="font-weight: bold; color: #d6a632;">R$ ${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #2a2c2c;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span class="muted">Subtotal</span>
              <span>R$ ${data.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span class="muted">Frete</span>
              <span>${data.shipping_cost === 0 ? '<span class="success">Grátis</span>' : `R$ ${data.shipping_cost.toFixed(2)}`}</span>
            </div>
            ${data.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span class="muted">Desconto</span>
              <span class="success">- R$ ${data.discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #d6a632; margin-top: 15px; padding-top: 15px; border-top: 1px solid #2a2c2c;">
              <span>Total</span>
              <span>R$ ${data.total.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-top: 30px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 1px;">FORMA DE PAGAMENTO</h4>
            <p style="color: #f8f5ed; margin: 0;">${data.payment_method === 'whatsapp' ? 'Pagamento via WhatsApp' : data.payment_method}</p>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-top: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 1px;">ENDEREÇO DE ENTREGA</h4>
            <p style="color: #f8f5ed; margin: 0; font-size: 14px;">${data.shipping_address}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://vesteretro.com.br/minha-conta/pedidos" class="button">
              ACOMPANHAR PEDIDO
            </a>
          </div>

          <p style="color: #9b9b9b; font-size: 12px; text-align: center; margin-top: 30px;">
            Precisa de ajuda? Fale conosco via <span class="whatsapp">WhatsApp</span>:
            <a href="https://wa.me/5511987516823" style="color: #25d366;">+55 11 98751-6823</a>
          </p>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,

  // ==================================================
  // ADMIN NOTIFICATION — NEW ORDER
  // ==================================================
  adminNewOrder: (data: OrderEmailData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Nova Venda!')}

        <div class="content">
          <div style="background: #d6a632; color: #0a0b0b; padding: 15px; border-radius: 4px; text-align: center; margin-bottom: 20px;">
            <strong style="font-size: 18px;">🔔 NOVO PEDIDO RECEBIDO</strong>
          </div>

          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${data.order_number}</div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">CLIENTE</h4>
            <p style="color: #f8f5ed; margin: 0;"><strong>${data.customer_name}</strong></p>
            <p style="color: #9b9b9b; margin: 5px 0 0 0; font-size: 13px;">${data.customer_email}</p>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">ITENS</h4>
            ${data.items.map(item => `
              <div style="padding: 8px 0; border-bottom: 1px solid #2a2c2c;">
                <strong>${item.name}</strong> — ${item.size} x${item.quantity}
                <span style="float: right; color: #d6a632;">R$ ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">VALORES</h4>
            <p style="margin: 5px 0;">Subtotal: R$ ${data.subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0;">Frete: ${data.shipping_cost === 0 ? 'Grátis' : `R$ ${data.shipping_cost.toFixed(2)}`}</p>
            ${data.discount > 0 ? `<p style="margin: 5px 0;">Desconto: -R$ ${data.discount.toFixed(2)}</p>` : ''}
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #d6a632;">
              Total: R$ ${data.total.toFixed(2)}
            </p>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">PAGAMENTO</h4>
            <p style="color: #f8f5ed; margin: 0;">${data.payment_method === 'whatsapp' ? 'Pagamento via WhatsApp' : data.payment_method}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5511987516823?text=${encodeURIComponent(`Olá! Recebi o pedido ${data.order_number}. Vou verificar e preparar para envio.`)}" class="button" style="background: #25d366;">
              📱 ENVIAR CONFIRMAÇÃO VIA WHATSAPP
            </a>
          </div>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,

  // ==================================================
  // PAYMENT APPROVED
  // ==================================================
  paymentApproved: (data: { order_number: string; customer_name: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Pagamento Confirmado')}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
          <h2 style="color: #2ea66b;">Pagamento Aprovado!</h2>
          <p style="color: #9b9b9b;">Olá ${data.customer_name}, seu pagamento foi confirmado.</p>
          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${data.order_number}</div>
          <p style="color: #f8f5ed;">Seu pedido já está sendo preparado para envio.</p>
          <div style="margin-top: 30px;">
            <a href="https://vesteretro.com.br/minha-conta/pedidos" class="button">ACOMPANHAR PEDIDO</a>
          </div>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,

  // ==================================================
  // ORDER SHIPPED
  // ==================================================
  orderShipped: (data: { order_number: string; customer_name: string; tracking_code?: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Pedido Enviado')}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">📦</div>
          <h2 style="color: #d6a632;">Pedido Enviado!</h2>
          <p style="color: #9b9b9b;">Olá ${data.customer_name}, seu pedido foi enviado.</p>
          <p style="color: #f8f5ed;">Pedido: <strong>${data.order_number}</strong></p>

          ${data.tracking_code ? `
          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #9b9b9b; letter-spacing: 1px;">CÓDIGO DE RASTREAMENTO</p>
            <p style="margin: 0; font-size: 20px; font-family: monospace; color: #d6a632; font-weight: bold;">${data.tracking_code}</p>
          </div>
          ` : ''}

          <div style="margin-top: 30px;">
            <a href="https://vesteretro.com.br/rastreamento" class="button">RASTREAR PEDIDO</a>
          </div>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,

  // ==================================================
  // ORDER CANCELLED
  // ==================================================
  orderCancelled: (data: { order_number: string; customer_name: string; reason?: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Pedido Cancelado')}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
          <h2 style="color: #c94b4b;">Pedido Cancelado</h2>
          <p style="color: #9b9b9b;">Olá ${data.customer_name}, seu pedido foi cancelado.</p>
          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${data.order_number}</div>

          ${data.reason ? `
          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: left;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">MOTIVO</h4>
            <p style="color: #f8f5ed; margin: 0;">${data.reason}</p>
          </div>
          ` : ''}

          <p style="color: #9b9b9b; font-size: 14px;">
            Se tiver alguma dúvida, entre em contato conosco.
          </p>

          <div style="margin-top: 30px;">
            <a href="https://wa.me/5511987516823?text=${encodeURIComponent(`Olá! Gostaria de informações sobre o cancelamento do pedido ${data.order_number}`)}" class="button" style="background: #25d366;">
              FALAR NO WHATSAPP
            </a>
          </div>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,

  // ==================================================
  // REFUND PROCESSED
  // ==================================================
  refundProcessed: (data: { order_number: string; customer_name: string; amount: number }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Reembolso Processado')}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">💰</div>
          <h2 style="color: #2ea66b;">Reembolso Processado!</h2>
          <p style="color: #9b9b9b;">Olá ${data.customer_name}, seu reembolso foi processado.</p>
          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${data.order_number}</div>
          <p style="color: #2ea66b; font-size: 20px; font-weight: bold;">R$ ${data.amount.toFixed(2)}</p>
          <p style="color: #9b9b9b; font-size: 14px; margin-top: 15px;">
            O valor será creditado na mesma forma de pagamento utilizada na compra.
          </p>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,

  // ==================================================
  // ABANDONED CART REMINDER
  // ==================================================
  abandonedCart: (data: { customer_name: string; items: Array<{ name: string; size: string; price: number }>; recovery_url: string }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${headerHtml('Seu carrinho te espera!')}

        <div class="content">
          <h2 style="color: #f8f5ed;">Olá ${data.customer_name}! 👋</h2>
          <p style="color: #9b9b9b;">Notamos que você deixou alguns itens no carrinho. Ainda está interessado?</p>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin: 25px 0;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 15px 0;">SEUS ITENS</h4>
            ${data.items.map(item => `
              <div style="padding: 10px 0; border-bottom: 1px solid #2a2c2c; display: flex; justify-content: space-between;">
                <div>
                  <strong>${item.name}</strong>
                  <span class="muted" style="margin-left: 10px;">${item.size}</span>
                </div>
                <span class="gold">R$ ${item.price.toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${data.recovery_url}" class="button">FINALIZAR COMPRA</a>
          </div>

          <p style="color: #9b9b9b; font-size: 12px; text-align: center; margin-top: 20px;">
            Precisa de ajuda? Fale conosco via <span class="whatsapp">WhatsApp</span>:
            <a href="https://wa.me/5511987516823" style="color: #25d366;">+55 11 98751-6823</a>
          </p>
        </div>

        ${footerHtml()}
      </div>
    </body>
    </html>
  `,
};

// ==================================================
// EMAIL SERVICE CLASS
// ==================================================

export class ResendEmailService {
  readonly isConfigured: boolean;

  constructor() {
    // The API key lives in the Supabase Edge Function, not the frontend.
    // We always try to invoke the Edge Function when a user session exists.
    this.isConfigured = true;

    console.log('[Resend] Email service ready (uses Supabase Edge Function)');
  }

  // ==================================================
  // SEND EMAIL VIA EDGE FUNCTION
  // ==================================================
  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.warn('[Resend] No active session - email not sent');
        return false;
      }

      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          replyTo: options.replyTo,
          type: options.type,
        },
      });

      if (error) {
        console.error('[Resend] Edge function error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[Resend] Error sending email:', error);
      return false;
    }
  }

  // ==================================================
  // PUBLIC METHODS
  // ==================================================

  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    const html = templates.orderConfirmation(data);

    // Send to customer
    const customerSent = await this.sendEmail({
      to: data.customer_email,
      subject: `Recebemos seu pedido ${data.order_number} | VesteRetro`,
      html,
      type: 'order_confirmation',
    });

    // Send admin notification
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'vesteretro.app@gmail.com';
    const adminHtml = templates.adminNewOrder(data);
    await this.sendEmail({
      to: adminEmail,
      subject: `🔔 Novo Pedido ${data.order_number} — R$ ${data.total.toFixed(2)} | VesteRetro`,
      html: adminHtml,
      type: 'admin_new_order',
    });

    return customerSent;
  }

  async sendPaymentApproved(
    orderNumber: string,
    customerName: string,
    customerEmail: string
  ): Promise<boolean> {
    const html = templates.paymentApproved({
      order_number: orderNumber,
      customer_name: customerName,
    });

    return this.sendEmail({
      to: customerEmail,
      subject: `Pagamento aprovado — Pedido ${orderNumber} | VesteRetro`,
      html,
      type: 'payment_approved',
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
      type: 'order_shipped',
    });
  }

  async sendOrderCancelled(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    reason?: string
  ): Promise<boolean> {
    const html = templates.orderCancelled({
      order_number: orderNumber,
      customer_name: customerName,
      reason,
    });

    return this.sendEmail({
      to: customerEmail,
      subject: `Pedido ${orderNumber} cancelado | VesteRetro`,
      html,
      type: 'order_cancelled',
    });
  }

  async sendRefundProcessed(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    amount: number
  ): Promise<boolean> {
    const html = templates.refundProcessed({
      order_number: orderNumber,
      customer_name: customerName,
      amount,
    });

    return this.sendEmail({
      to: customerEmail,
      subject: `Reembolso processado — Pedido ${orderNumber} | VesteRetro`,
      html,
      type: 'refund_processed',
    });
  }

  async sendAbandonedCartReminder(
    customerName: string,
    customerEmail: string,
    items: Array<{ name: string; size: string; price: number }>,
    recoveryUrl: string
  ): Promise<boolean> {
    const html = templates.abandonedCart({
      customer_name: customerName,
      items,
      recovery_url: recoveryUrl,
    });

    return this.sendEmail({
      to: customerEmail,
      subject: `Seu carrinho ainda está te esperando! | VesteRetro`,
      html,
      type: 'abandoned_cart',
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
