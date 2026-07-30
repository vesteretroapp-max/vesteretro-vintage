import{j as e}from"./framer-motion-C920JLDZ.js";import{d as _e,r as h,L as $}from"./react-vendor-BVNECSRU.js";import{c as ee,_ as ke,s as T,u as Ce,C as W,M as H,L as le}from"./index-A_Y8207k.js";import{C as ce}from"./circle-check-big-CSYwTUZN.js";import{C as Q}from"./check-CeVZyAer.js";import{C as pe}from"./copy-U4LjDgrE.js";import{T as $e}from"./truck-B2-iabgq.js";import{C as B}from"./chevron-right-BgT7iSDI.js";import{C as L}from"./chevron-left-WZYrUbvN.js";import{C as Pe}from"./credit-card-Cq29chwG.js";import{S as Ee}from"./shield-kBgyVRUb.js";import"./radix-ui-DDoKgfNw.js";const Se=[["rect",{width:"20",height:"12",x:"2",y:"6",rx:"2",key:"9lu3g6"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}],["path",{d:"M6 12h.01M18 12h.01",key:"113zkx"}]],Re=ee("banknote",Se);const De=[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],Y=ee("building-2",De);const Oe=[["rect",{width:"5",height:"5",x:"3",y:"3",rx:"1",key:"1tu5fj"}],["rect",{width:"5",height:"5",x:"16",y:"3",rx:"1",key:"1v8r4q"}],["rect",{width:"5",height:"5",x:"3",y:"16",rx:"1",key:"1x03jg"}],["path",{d:"M21 16h-3a2 2 0 0 0-2 2v3",key:"177gqh"}],["path",{d:"M21 21v.01",key:"ents32"}],["path",{d:"M12 7v3a2 2 0 0 1-2 2H7",key:"8crl2c"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M12 3h.01",key:"n36tog"}],["path",{d:"M12 16v.01",key:"133mhm"}],["path",{d:"M16 12h1",key:"1slzba"}],["path",{d:"M21 12v.01",key:"1lwtk9"}],["path",{d:"M12 21v-1",key:"1880an"}]],me=ee("qr-code",Oe);let F=null;async function Ae(){if(F)return F;const{MercadoPagoProvider:s}=await ke(async()=>{const{MercadoPagoProvider:o}=await import("./mercadopago-npnscY7D.js");return{MercadoPagoProvider:o}},[]),r=new s;return r.isConfigured?(F=r,r):(F=new ze,F)}class ze{name="Demo";isConfigured=!1;environment="sandbox";generateId(){return`demo_${Date.now()}_${Math.random().toString(36).slice(2,8)}`}async createPixPayment(r,o,n){return console.log("[Demo Payment] Creating PIX payment:",{amount:r,description:o,externalReference:n}),{success:!0,payment_id:this.generateId(),external_reference:n,status:"pending",pix_qr_code:`00020126580014BR.GOV.BCB.PIX0136vesteretro@example.com5204000053039865404${r.toFixed(2)}5802BR5913VESTE RETRO6009SAO PAULO62070503***6304`,pix_qr_code_base64:"",pix_qr_code_link:"",pix_expiration:new Date(Date.now()+1800*1e3).toISOString(),amount:r,currency:"BRL"}}async createCardPayment(r,o,n,d){return console.log("[Demo Payment] Creating card payment:",{amount:r,description:o,externalReference:n,installments:d}),{success:!0,payment_id:this.generateId(),external_reference:n,status:"approved",installments:d,installment_amount:r/d,amount:r,currency:"BRL"}}async createBoletoPayment(r,o,n){return console.log("[Demo Payment] Creating boleto payment:",{amount:r,description:o,externalReference:n}),{success:!0,payment_id:this.generateId(),external_reference:n,status:"pending",boleto_url:"",boleto_barcode:"23793.38128 60000.000003 00000.000400 1 84340000019990",boleto_expiration:new Date(Date.now()+4320*60*1e3).toISOString(),amount:r,currency:"BRL"}}async getPaymentStatus(r){return console.log("[Demo Payment] Getting payment status:",r),{success:!0,payment_id:r,status:"approved",amount:0,currency:"BRL"}}async cancelPayment(r){return console.log("[Demo Payment] Cancelling payment:",r),{success:!0,payment_id:r,status:"cancelled"}}async refundPayment(r,o){return console.log("[Demo Payment] Refunding payment:",r,o),{success:!0,payment_id:r,status:"refunded",amount:o}}async processWebhook(r){return console.log("[Demo Payment] Processing webhook:",r),{payment_id:"",external_reference:"",status:"approved",status_detail:"approved"}}}const Ie={sandbox:"https://sandbox.melhorenvio.com.br/api/v2",production:"https://www.melhorenvio.com.br/api/v2"},X={width:30,height:5,length:40,weight:.5,insurance_value:100};class Me{token;environment;fromPostalCode;isConfigured;constructor(){this.token="",this.environment="sandbox",this.fromPostalCode="01001-000",this.isConfigured=!!this.token,this.isConfigured?console.log(`[Melhor Envio] Configured in ${this.environment} mode`):console.warn("[Melhor Envio] Not configured - using demo mode")}getApiUrl(){return Ie[this.environment]}async request(r,o={}){const n=`${this.getApiUrl()}${r}`,d=await fetch(n,{...o,headers:{Authorization:`Bearer ${this.token}`,"Content-Type":"application/json",Accept:"application/json",...o.headers}});if(!d.ok){const i=await d.json().catch(()=>({}));throw new Error(`Melhor Envio API error: ${d.status} - ${JSON.stringify(i)}`)}return d.json()}async calculateShipping(r){if(!this.isConfigured)return this.fallbackShippingCalculation(r);try{const o={from:{postal_code:r.from_postal_code.replace(/\D/g,"")},to:{postal_code:r.to_postal_code.replace(/\D/g,"")},products:r.products.map(i=>({...X,...i})),services:r.services||["1","2"]};return{success:!0,options:(await this.request("/me/shipment/calculate",{method:"POST",body:JSON.stringify(o)})).filter(i=>!i.error).map(i=>({id:String(i.id),carrier:String(i.company?.name||"Correios"),service:String(i.name||""),name:String(i.name||""),description:String(i.name||""),price:Number(i.price||0),original_price:Number(i.original_price||i.price||0),delivery_days:Number(i.delivery_time||0),delivery_range:{min:Number(i.delivery_time||0),max:Number(i.delivery_time||0)+2},tracking:!!i.tracking,home_delivery:!!i.home_delivery,pickup_available:!!i.pickup_available}))}}catch(o){return console.error("[Melhor Envio] Shipping calculation error:",o),{success:!1,options:[],error:o instanceof Error?o.message:"Failed to calculate shipping"}}}fallbackShippingCalculation(r){console.log("[Melhor Envio Demo] Calculating shipping:",{from:r.from_postal_code,to:r.to_postal_code});const o=r.from_postal_code.replace(/\D/g,""),n=r.to_postal_code.replace(/\D/g,""),d=Math.floor(parseInt(o)/1e6),i=Math.floor(parseInt(n)/1e6),x=d===i,V=r.products.reduce((I,C)=>I+(C.weight||X.weight)*C.quantity,0),D=x?15.9:22.9,A=x?25.9:39.9,j=1+(V-.5)*.3,z=[{id:"pac",carrier:"Correios",service:"PAC",name:"PAC",description:"Entrega padrão via Correios",price:Math.round(D*j*100)/100,original_price:Math.round(D*j*100)/100,delivery_days:x?7:12,delivery_range:{min:x?5:10,max:x?10:15},tracking:!0,home_delivery:!0,pickup_available:!1},{id:"sedex",carrier:"Correios",service:"SEDEX",name:"SEDEX",description:"Entrega expressa via Correios",price:Math.round(A*j*100)/100,original_price:Math.round(A*j*100)/100,delivery_days:x?3:5,delivery_range:{min:x?2:4,max:x?4:7},tracking:!0,home_delivery:!0,pickup_available:!1}];return r.products.reduce((I,C)=>I+(C.insurance_value||X.insurance_value)*C.quantity,0)>=299.9&&z.unshift({id:"free",carrier:"VesteRetro",service:"Frete Grátis",name:"Frete Grátis",description:"Entrega gratuita para compras acima de R$ 299,90",price:0,original_price:D*j,delivery_days:10,delivery_range:{min:7,max:15},tracking:!0,home_delivery:!0,pickup_available:!1}),{success:!0,options:z}}async validatePostalCode(r){const o=r.replace(/\D/g,"");if(o.length!==8)return!1;if(!this.isConfigured){const n=parseInt(o[0]);return n>=0&&n<=9}try{return await this.request(`/me/shipment/validate?postal_code=${o}`),!0}catch{return!1}}}let J=null;function Fe(){return J||(J=new Me),J}const P=`
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
`;function E(s){return`
    <div class="header">
      <div class="logo">VESTERETRO</div>
      ${s?`<p style="color: #9b9b9b; margin: 10px 0 0 0; font-size: 14px;">${s}</p>`:""}
    </div>
  `}function S(){return`
    <div class="footer">
      <p>© ${new Date().getFullYear()} VesteRetro — Vista a História</p>
      <p style="margin-top: 5px;">Camisas retrô premium</p>
      <p style="margin-top: 10px;">
        <a href="https://wa.me/5511987516823" style="color: #25d366; text-decoration: none;">WhatsApp: +55 11 98751-6823</a>
      </p>
    </div>
  `}const R={orderConfirmation:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Pedido Recebido")}

        <div class="content">
          <h2 style="color: #f8f5ed; margin-bottom: 5px;">Pedido Recebido! 🎉</h2>
          <p style="color: #9b9b9b; font-size: 14px;">Olá ${s.customer_name}, recebemos seu pedido e já estamos preparando tudo.</p>

          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${s.order_number}</div>

          <h3 style="color: #d6a632; font-size: 12px; margin: 30px 0 15px 0; letter-spacing: 1px;">ITENS DO PEDIDO</h3>

          ${s.items.map(r=>`
            <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #2a2c2c;">
              ${r.image?`<img src="${r.image}" alt="" style="width: 60px; height: 70px; object-fit: cover; border-radius: 4px; margin-right: 15px;">`:""}
              <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 5px;">${r.name}</div>
                <div style="font-size: 12px; color: #9b9b9b;">Tamanho: ${r.size} · Qtd: ${r.quantity}</div>
              </div>
              <div style="font-weight: bold; color: #d6a632;">R$ ${(r.price*r.quantity).toFixed(2)}</div>
            </div>
          `).join("")}

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #2a2c2c;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span class="muted">Subtotal</span>
              <span>R$ ${s.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span class="muted">Frete</span>
              <span>${s.shipping_cost===0?'<span class="success">Grátis</span>':`R$ ${s.shipping_cost.toFixed(2)}`}</span>
            </div>
            ${s.discount>0?`
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
              <span class="muted">Desconto</span>
              <span class="success">- R$ ${s.discount.toFixed(2)}</span>
            </div>
            `:""}
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #d6a632; margin-top: 15px; padding-top: 15px; border-top: 1px solid #2a2c2c;">
              <span>Total</span>
              <span>R$ ${s.total.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-top: 30px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 1px;">FORMA DE PAGAMENTO</h4>
            <p style="color: #f8f5ed; margin: 0;">${s.payment_method==="whatsapp"?"Pagamento via WhatsApp":s.payment_method}</p>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-top: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 1px;">ENDEREÇO DE ENTREGA</h4>
            <p style="color: #f8f5ed; margin: 0; font-size: 14px;">${s.shipping_address}</p>
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

        ${S()}
      </div>
    </body>
    </html>
  `,adminNewOrder:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Nova Venda!")}

        <div class="content">
          <div style="background: #d6a632; color: #0a0b0b; padding: 15px; border-radius: 4px; text-align: center; margin-bottom: 20px;">
            <strong style="font-size: 18px;">🔔 NOVO PEDIDO RECEBIDO</strong>
          </div>

          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${s.order_number}</div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">CLIENTE</h4>
            <p style="color: #f8f5ed; margin: 0;"><strong>${s.customer_name}</strong></p>
            <p style="color: #9b9b9b; margin: 5px 0 0 0; font-size: 13px;">${s.customer_email}</p>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">ITENS</h4>
            ${s.items.map(r=>`
              <div style="padding: 8px 0; border-bottom: 1px solid #2a2c2c;">
                <strong>${r.name}</strong> — ${r.size} x${r.quantity}
                <span style="float: right; color: #d6a632;">R$ ${(r.price*r.quantity).toFixed(2)}</span>
              </div>
            `).join("")}
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">VALORES</h4>
            <p style="margin: 5px 0;">Subtotal: R$ ${s.subtotal.toFixed(2)}</p>
            <p style="margin: 5px 0;">Frete: ${s.shipping_cost===0?"Grátis":`R$ ${s.shipping_cost.toFixed(2)}`}</p>
            ${s.discount>0?`<p style="margin: 5px 0;">Desconto: -R$ ${s.discount.toFixed(2)}</p>`:""}
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #d6a632;">
              Total: R$ ${s.total.toFixed(2)}
            </p>
          </div>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">PAGAMENTO</h4>
            <p style="color: #f8f5ed; margin: 0;">${s.payment_method==="whatsapp"?"Pagamento via WhatsApp":s.payment_method}</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://wa.me/5511987516823?text=${encodeURIComponent(`Olá! Recebi o pedido ${s.order_number}. Vou verificar e preparar para envio.`)}" class="button" style="background: #25d366;">
              📱 ENVIAR CONFIRMAÇÃO VIA WHATSAPP
            </a>
          </div>
        </div>

        ${S()}
      </div>
    </body>
    </html>
  `,paymentApproved:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Pagamento Confirmado")}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
          <h2 style="color: #2ea66b;">Pagamento Aprovado!</h2>
          <p style="color: #9b9b9b;">Olá ${s.customer_name}, seu pagamento foi confirmado.</p>
          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${s.order_number}</div>
          <p style="color: #f8f5ed;">Seu pedido já está sendo preparado para envio.</p>
          <div style="margin-top: 30px;">
            <a href="https://vesteretro.com.br/minha-conta/pedidos" class="button">ACOMPANHAR PEDIDO</a>
          </div>
        </div>

        ${S()}
      </div>
    </body>
    </html>
  `,orderShipped:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Pedido Enviado")}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">📦</div>
          <h2 style="color: #d6a632;">Pedido Enviado!</h2>
          <p style="color: #9b9b9b;">Olá ${s.customer_name}, seu pedido foi enviado.</p>
          <p style="color: #f8f5ed;">Pedido: <strong>${s.order_number}</strong></p>

          ${s.tracking_code?`
          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #9b9b9b; letter-spacing: 1px;">CÓDIGO DE RASTREAMENTO</p>
            <p style="margin: 0; font-size: 20px; font-family: monospace; color: #d6a632; font-weight: bold;">${s.tracking_code}</p>
          </div>
          `:""}

          <div style="margin-top: 30px;">
            <a href="https://vesteretro.com.br/rastreamento" class="button">RASTREAR PEDIDO</a>
          </div>
        </div>

        ${S()}
      </div>
    </body>
    </html>
  `,orderCancelled:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Pedido Cancelado")}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">❌</div>
          <h2 style="color: #c94b4b;">Pedido Cancelado</h2>
          <p style="color: #9b9b9b;">Olá ${s.customer_name}, seu pedido foi cancelado.</p>
          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${s.order_number}</div>

          ${s.reason?`
          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: left;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 10px 0;">MOTIVO</h4>
            <p style="color: #f8f5ed; margin: 0;">${s.reason}</p>
          </div>
          `:""}

          <p style="color: #9b9b9b; font-size: 14px;">
            Se tiver alguma dúvida, entre em contato conosco.
          </p>

          <div style="margin-top: 30px;">
            <a href="https://wa.me/5511987516823?text=${encodeURIComponent(`Olá! Gostaria de informações sobre o cancelamento do pedido ${s.order_number}`)}" class="button" style="background: #25d366;">
              FALAR NO WHATSAPP
            </a>
          </div>
        </div>

        ${S()}
      </div>
    </body>
    </html>
  `,refundProcessed:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Reembolso Processado")}

        <div class="content" style="text-align: center;">
          <div style="font-size: 64px; margin-bottom: 20px;">💰</div>
          <h2 style="color: #2ea66b;">Reembolso Processado!</h2>
          <p style="color: #9b9b9b;">Olá ${s.customer_name}, seu reembolso foi processado.</p>
          <div style="font-size: 24px; color: #d6a632; margin: 20px 0; font-weight: bold;">${s.order_number}</div>
          <p style="color: #2ea66b; font-size: 20px; font-weight: bold;">R$ ${s.amount.toFixed(2)}</p>
          <p style="color: #9b9b9b; font-size: 14px; margin-top: 15px;">
            O valor será creditado na mesma forma de pagamento utilizada na compra.
          </p>
        </div>

        ${S()}
      </div>
    </body>
    </html>
  `,abandonedCart:s=>`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${P}</style>
    </head>
    <body>
      <div class="container">
        ${E("Seu carrinho te espera!")}

        <div class="content">
          <h2 style="color: #f8f5ed;">Olá ${s.customer_name}! 👋</h2>
          <p style="color: #9b9b9b;">Notamos que você deixou alguns itens no carrinho. Ainda está interessado?</p>

          <div style="background: #1a1c1c; padding: 20px; border-radius: 4px; margin: 25px 0;">
            <h4 style="color: #d6a632; font-size: 12px; margin: 0 0 15px 0;">SEUS ITENS</h4>
            ${s.items.map(r=>`
              <div style="padding: 10px 0; border-bottom: 1px solid #2a2c2c; display: flex; justify-content: space-between;">
                <div>
                  <strong>${r.name}</strong>
                  <span class="muted" style="margin-left: 10px;">${r.size}</span>
                </div>
                <span class="gold">R$ ${r.price.toFixed(2)}</span>
              </div>
            `).join("")}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${s.recovery_url}" class="button">FINALIZAR COMPRA</a>
          </div>

          <p style="color: #9b9b9b; font-size: 12px; text-align: center; margin-top: 20px;">
            Precisa de ajuda? Fale conosco via <span class="whatsapp">WhatsApp</span>:
            <a href="https://wa.me/5511987516823" style="color: #25d366;">+55 11 98751-6823</a>
          </p>
        </div>

        ${S()}
      </div>
    </body>
    </html>
  `};class Te{isConfigured;constructor(){this.isConfigured=!0,console.log("[Resend] Email service ready (uses Supabase Edge Function)")}async sendEmail(r){try{const{data:{session:o}}=await T.auth.getSession();if(!o?.access_token)return console.warn("[Resend] No active session - email not sent"),!1;const{error:n}=await T.functions.invoke("send-email",{body:{to:r.to,subject:r.subject,html:r.html,text:r.text,replyTo:r.replyTo,type:r.type}});return n?(console.error("[Resend] Edge function error:",n),!1):!0}catch(o){return console.error("[Resend] Error sending email:",o),!1}}async sendOrderConfirmation(r){const o=R.orderConfirmation(r),n=await this.sendEmail({to:r.customer_email,subject:`Recebemos seu pedido ${r.order_number} | VesteRetro`,html:o,type:"order_confirmation"}),d="contato@vesteretro.com.br",i=R.adminNewOrder(r);return await this.sendEmail({to:d,subject:`🔔 Novo Pedido ${r.order_number} — R$ ${r.total.toFixed(2)} | VesteRetro`,html:i,type:"admin_new_order"}),n}async sendPaymentApproved(r,o,n){const d=R.paymentApproved({order_number:r,customer_name:o});return this.sendEmail({to:n,subject:`Pagamento aprovado — Pedido ${r} | VesteRetro`,html:d,type:"payment_approved"})}async sendOrderShipped(r,o,n,d){const i=R.orderShipped({order_number:r,customer_name:o,tracking_code:d});return this.sendEmail({to:n,subject:`Pedido ${r} enviado | VesteRetro`,html:i,type:"order_shipped"})}async sendOrderCancelled(r,o,n,d){const i=R.orderCancelled({order_number:r,customer_name:o,reason:d});return this.sendEmail({to:n,subject:`Pedido ${r} cancelado | VesteRetro`,html:i,type:"order_cancelled"})}async sendRefundProcessed(r,o,n,d){const i=R.refundProcessed({order_number:r,customer_name:o,amount:d});return this.sendEmail({to:n,subject:`Reembolso processado — Pedido ${r} | VesteRetro`,html:i,type:"refund_processed"})}async sendAbandonedCartReminder(r,o,n,d){const i=R.abandonedCart({customer_name:r,items:n,recovery_url:d});return this.sendEmail({to:o,subject:"Seu carrinho ainda está te esperando! | VesteRetro",html:i,type:"abandoned_cart"})}}let Z=null;function Ve(){return Z||(Z=new Te),Z}const K="https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";function et(){_e();const{user:s,profile:r}=Ce(),[o,n]=h.useState("info"),[d,i]=h.useState("whatsapp"),[x,V]=h.useState("padrao"),[D,A]=h.useState(!1),[j,z]=h.useState(null),[O,I]=h.useState([]),[C,te]=h.useState(!1),[c,xe]=h.useState(null),[ue,re]=h.useState(!1),[g,M]=h.useState({number:"",name:"",expiry:"",cvv:"",installments:1}),ge=Array.from({length:12},(t,l)=>({value:l+1,label:`${l+1}x sem juros`})),he=()=>{const t=localStorage.getItem("veste_cart");if(!t)return[];try{return JSON.parse(t)}catch{return[]}},[a,se]=h.useState({nome:r?.full_name||"",cpf:r?.cpf||"",email:r?.email||s?.email||"",telefone:r?.phone||"",whatsapp:r?.whatsapp||"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""}),b=(t,l)=>{se(p=>({...p,[t]:l}))},N=he(),w=N.reduce((t,l)=>t+l.price*l.quantity,0),q=[{key:"padrao",name:"Frete Padrão",price:19.9,days:"7-15"},{key:"expresso",name:"Frete Expresso",price:39.9,days:"3-7"},{key:"gratis",name:"Frete Grátis",price:0,days:"10-20",note:"Acima de R$ 299"}],v=O.length>0?O.find(t=>t.id===x)||O[0]:q.find(t=>t.key===x)||q[0],_=w>=299?0:"price"in v?v.price:19.9,oe=w+_,ae=h.useCallback(async()=>{if(!(!a.cep||a.cep.replace(/\D/g,"").length!==8)){te(!0);try{const l=await Fe().calculateShipping({from_postal_code:"01001-000",to_postal_code:a.cep,products:N.map(p=>({id:p.productId,width:30,height:5,length:40,weight:.5,insurance_value:p.price,quantity:p.quantity}))});l.success&&l.options.length>0&&I(l.options)}catch(t){console.error("Error calculating shipping:",t)}finally{te(!1)}}},[a.cep,N]);h.useEffect(()=>{o==="shipping"&&a.cep&&ae()},[o,a.cep,ae]);const be=async()=>{const t=a.cep.replace(/\D/g,"");if(t.length===8)try{const p=await(await fetch(`https://viacep.com.br/ws/${t}/json/`)).json();p.erro||se(m=>({...m,rua:p.logradouro||m.rua,bairro:p.bairro||m.bairro,cidade:p.localidade||m.cidade,estado:p.uf||m.estado}))}catch{}},fe=()=>{const t=new Date().getFullYear(),l=Math.random().toString(36).slice(2,6).toUpperCase(),p=Date.now().toString(36).slice(-4).toUpperCase();return`VR-${t}-${p}${l}`},ve=async()=>{A(!0),z(null);try{const t=fe(),l=localStorage.getItem("veste_coupon")||null,p=l?w*.1:0,m=w+_-p,G=await Ae();let u=null;if(d==="pix"?u=await G.createPixPayment(m,`Pedido ${t} - VesteRetro`,t):d==="credit"?u=await G.createCardPayment(m,`Pedido ${t} - VesteRetro`,t,g.installments):d==="boleto"?u=await G.createBoletoPayment(m,`Pedido ${t} - VesteRetro`,t):u={success:!0,status:"pending",payment_id:`whatsapp_${Date.now()}`,external_reference:t},!u.success)throw new Error(u.error_message||"Erro ao processar pagamento");const U={order_number:t,user_id:s?.id||null,customer_name:a.nome,customer_email:a.email,customer_phone:a.telefone,customer_cpf:a.cpf.replace(/\D/g,""),customer_whatsapp:a.whatsapp,status:"awaiting_payment",payment_status:u.status||"pending",payment_method:d,subtotal:w,discount:p,shipping_cost:_,total:m,coupon_code:l,shipping_method:"name"in v?v.name:"Frete Padrão",shipping_address:`${a.rua}, ${a.numero}${a.complemento?` - ${a.complemento}`:""}, ${a.bairro} - ${a.cidade}/${a.estado}, CEP: ${a.cep}`};let ne=!1;try{const{data:y,error:k}=await T.from("orders").insert(U).select("id").single();if(k)throw k;if(y){const we=N.map(f=>({order_id:y.id,product_id:f.productId,variant_id:f.productId+"-"+f.size,product_name:f.name,product_slug:f.slug,image_url:f.image,size:f.size,sku:f.size,quantity:f.quantity,unit_price:f.price,total_price:f.price*f.quantity})),{error:ie}=await T.from("order_items").insert(we);if(ie)throw ie;await T.from("order_status_history").insert({order_id:y.id,status:"awaiting_payment",message:"Seu pedido foi recebido e está aguardando a confirmação do pagamento.",created_by:s?.id||"guest"}),ne=!0}}catch(y){console.error("Error saving order to DB, falling back to localStorage:",y),ne=!1}const de=JSON.parse(localStorage.getItem("veste_orders")||"[]"),Ne={number:t,date:new Date().toISOString(),items:N,total:m,subtotal:w,shipping:_,discount:p,payment:d,shipping_method:"name"in v?v.name:"Frete Padrão",status:d==="whatsapp"?"Aguardando pagamento":"Pagamento pendente",shipping_address:U.shipping_address,customer_name:a.nome,customer_email:a.email,customer_phone:a.telefone};de.unshift(Ne),localStorage.setItem("veste_orders",JSON.stringify(de)),localStorage.removeItem("veste_cart"),localStorage.removeItem("veste_coupon"),window.dispatchEvent(new Event("cart-updated"));try{await Ve().sendOrderConfirmation({order_number:t,customer_name:a.nome,customer_email:a.email,items:N.map(k=>({name:k.name,size:k.size,quantity:k.quantity,price:k.price,image:k.image})),subtotal:w,shipping_cost:_,discount:p,total:m,payment_method:d==="whatsapp"?"Pagamento via WhatsApp":d,shipping_address:U.shipping_address,shipping_method:"name"in v?v.name:"Frete Padrão"})}catch(y){console.error("Error sending email:",y)}if(xe({method:d,status:u.status||"pending",paymentId:u.payment_id,orderNumber:t,pixQrCode:u.pix_qr_code,pixExpiration:u.pix_expiration,boletoUrl:u.boleto_url,boletoBarcode:u.boleto_barcode,boletoExpiration:u.boleto_expiration}),n("payment_result"),d==="whatsapp"){const y=`Olá! Acabei de realizar o pedido nº ${t} na VesteRetro e gostaria de combinar o pagamento.`;window.open(`https://wa.me/5511987516823?text=${encodeURIComponent(y)}`,"_blank")}}catch(t){console.error("Error creating order:",t),z("Não foi possível finalizar o pedido. Tente novamente.")}finally{A(!1)}},ye=()=>{c?.pixQrCode&&(navigator.clipboard.writeText(c.pixQrCode),re(!0),setTimeout(()=>re(!1),2e3))},je=()=>{const t=[{key:"info",label:"Identificação"},{key:"address",label:"Endereço"},{key:"shipping",label:"Entrega"},{key:"payment",label:"Pagamento"},{key:"review",label:"Revisão"}],l=t.findIndex(p=>p.key===o);return e.jsx("div",{className:"flex items-center justify-center gap-2 mb-8 overflow-x-auto",children:t.map((p,m)=>e.jsxs("div",{className:"flex items-center shrink-0",children:[e.jsxs("div",{className:`flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider ${m<=l?"text-[var(--gold)]":"text-muted-foreground"}`,children:[e.jsx("div",{className:`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${m<l||m===l?"bg-[var(--gold)] text-background":"border border-muted-foreground"}`,children:m<l?e.jsx(Q,{className:"w-3 h-3"}):m+1}),e.jsx("span",{className:"hidden sm:inline",children:p.label})]}),m<t.length-1&&e.jsx("div",{className:`w-4 sm:w-6 h-px ${m<l?"bg-[var(--gold)]":"bg-[var(--gold)]/20"}`})]},p.key))})};return N.length===0&&o!=="payment_result"?e.jsxs("div",{className:"min-h-screen bg-background flex flex-col items-center justify-center px-4",children:[e.jsx("div",{className:"flex justify-center mb-8",children:e.jsx($,{to:"/",children:e.jsx("img",{src:K,alt:"VesteRetro",className:"h-10 w-auto"})})}),e.jsx("p",{className:"text-muted-foreground text-sm mb-4",children:"Seu carrinho está vazio."}),e.jsx($,{to:"/todos-os-produtos",className:"btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase",children:"Ver produtos"})]}):o==="payment_result"&&c?e.jsx("div",{className:"min-h-screen bg-background",children:e.jsxs("div",{className:"max-w-3xl mx-auto px-4 py-6 lg:py-10",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx($,{to:"/",children:e.jsx("img",{src:K,alt:"VesteRetro",className:"h-10 w-auto"})})}),e.jsxs("div",{className:"bg-surface border border-border rounded-sm p-6 lg:p-8",children:[e.jsxs("div",{className:"text-center mb-8",children:[e.jsx("div",{className:"w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center",children:e.jsx(ce,{className:"w-8 h-8 text-[var(--gold)]"})}),e.jsx("h2",{className:"font-display text-2xl font-bold text-foreground mb-2",children:"Pedido Recebido!"}),e.jsxs("p",{className:"text-muted-foreground",children:["Pedido ",e.jsx("span",{className:"text-[var(--gold)] font-semibold",children:c.orderNumber})]})]}),c.method==="pix"&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(me,{className:"w-5 h-5 text-[var(--gold)]"}),e.jsx("p",{className:"text-sm font-semibold text-[var(--gold)]",children:"Pagamento PIX"})]}),e.jsx("p",{className:"text-xs text-muted-foreground mb-4",children:"Escaneie o QR Code ou copie o código abaixo para realizar o pagamento."}),e.jsx("div",{className:"bg-white p-4 rounded-sm mb-4 flex items-center justify-center",children:e.jsx("div",{className:"w-48 h-48 bg-gray-100 flex items-center justify-center",children:e.jsx(me,{className:"w-32 h-32 text-gray-400"})})}),c.pixQrCode&&e.jsxs("div",{className:"bg-background p-3 rounded-sm",children:[e.jsx("p",{className:"text-[10px] text-muted-foreground mb-2",children:"Código PIX (Copia e Cola)"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text",value:c.pixQrCode,readOnly:!0,className:"flex-1 px-3 py-2 bg-surface border border-border text-foreground text-xs rounded-sm"}),e.jsx("button",{onClick:ye,className:"px-3 py-2 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors",children:ue?e.jsx(Q,{className:"w-4 h-4"}):e.jsx(pe,{className:"w-4 h-4"})})]})]}),c.pixExpiration&&e.jsxs("p",{className:"text-[10px] text-muted-foreground mt-3 flex items-center gap-1",children:[e.jsx(W,{className:"w-3 h-3"}),"Expira em: ",new Date(c.pixExpiration).toLocaleString("pt-BR")]})]}),e.jsx("div",{className:"p-3 bg-background rounded-sm border border-border",children:e.jsx("p",{className:"text-xs text-muted-foreground",children:"⚠️ O pagamento será confirmado automaticamente após a identificação do PIX."})})]}),c.method==="boleto"&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(Y,{className:"w-5 h-5 text-[var(--gold)]"}),e.jsx("p",{className:"text-sm font-semibold text-[var(--gold)]",children:"Boleto Bancário"})]}),e.jsx("p",{className:"text-xs text-muted-foreground mb-4",children:"Utilize o código abaixo para pagamento via boleto."}),c.boletoBarcode&&e.jsxs("div",{className:"bg-background p-3 rounded-sm",children:[e.jsx("p",{className:"text-[10px] text-muted-foreground mb-2",children:"Linha Digitável"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text",value:c.boletoBarcode,readOnly:!0,className:"flex-1 px-3 py-2 bg-surface border border-border text-foreground text-xs rounded-sm font-mono"}),e.jsx("button",{onClick:()=>{navigator.clipboard.writeText(c.boletoBarcode||"")},className:"px-3 py-2 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors",children:e.jsx(pe,{className:"w-4 h-4"})})]})]}),c.boletoUrl&&e.jsxs("a",{href:c.boletoUrl,target:"_blank",rel:"noopener noreferrer",className:"mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors text-sm font-semibold",children:[e.jsx(Y,{className:"w-4 h-4"}),"Visualizar Boleto"]}),c.boletoExpiration&&e.jsxs("p",{className:"text-[10px] text-muted-foreground mt-3 flex items-center gap-1",children:[e.jsx(W,{className:"w-3 h-3"}),"Vencimento: ",new Date(c.boletoExpiration).toLocaleDateString("pt-BR")]})]}),e.jsx("div",{className:"p-3 bg-background rounded-sm border border-border",children:e.jsx("p",{className:"text-xs text-muted-foreground",children:"⚠️ O boleto leva até 3 dias úteis para ser compensado após o pagamento."})})]}),c.method==="credit"&&c.status==="approved"&&e.jsx("div",{className:"mb-6",children:e.jsxs("div",{className:"p-4 bg-[#2EA66B]/10 border border-[#2EA66B]/20 rounded-sm",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(ce,{className:"w-5 h-5 text-[#2EA66B]"}),e.jsx("p",{className:"text-sm font-semibold text-[#2EA66B]",children:"Pagamento Aprovado!"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Seu pagamento foi processado com sucesso. Seu pedido já está sendo preparado."})]})}),c.method==="credit"&&c.status!=="approved"&&e.jsx("div",{className:"mb-6",children:e.jsxs("div",{className:"p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(W,{className:"w-5 h-5 text-[var(--gold)]"}),e.jsx("p",{className:"text-sm font-semibold text-[var(--gold)]",children:"Pagamento em Análise"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Seu pagamento está sendo analisado. Avisaremos assim que houver uma atualização."})]})}),c.method==="whatsapp"&&e.jsx("div",{className:"mb-6",children:e.jsxs("div",{className:"p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[e.jsx(H,{className:"w-5 h-5 text-[#25D366]"}),e.jsx("p",{className:"text-sm font-semibold text-[#25D366]",children:"Aguardando Contato"})]}),e.jsx("p",{className:"text-xs text-muted-foreground mb-4",children:"Um atendente entrará em contato via WhatsApp para combinar o pagamento."}),e.jsxs("a",{href:"https://wa.me/5511987516823?text=Olá! Gostaria de combinar o pagamento do meu pedido.",target:"_blank",rel:"noopener noreferrer",className:"w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-sm hover:bg-[#25D366]/80 transition-colors text-sm font-semibold",children:[e.jsx(H,{className:"w-4 h-4"}),"Falar no WhatsApp"]})]})}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[e.jsxs($,{to:`/pedido/${c.orderNumber}`,className:"flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors text-sm font-semibold",children:[e.jsx($e,{className:"w-4 h-4"}),"Acompanhar Pedido"]}),e.jsx($,{to:"/",className:"flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border text-muted-foreground rounded-sm hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm",children:"Continuar Comprando"})]})]})]})}):e.jsx("div",{className:"min-h-screen bg-background",children:e.jsxs("div",{className:"max-w-3xl mx-auto px-4 py-6 lg:py-10",children:[e.jsx("div",{className:"flex justify-center mb-6",children:e.jsx($,{to:"/",children:e.jsx("img",{src:K,alt:"VesteRetro",className:"h-10 w-auto"})})}),je(),j&&e.jsx("div",{className:"mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm",children:e.jsx("p",{className:"text-xs text-destructive",children:j})}),o==="info"&&e.jsxs("div",{className:"bg-surface border border-border rounded-sm p-6 lg:p-8",children:[e.jsx("h2",{className:"font-display text-xl font-bold text-foreground mb-6",children:"Identificação"}),s&&r&&e.jsxs("div",{className:"mb-6 p-4 bg-background rounded-sm",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"Cliente"}),e.jsx("p",{className:"text-sm text-foreground font-medium",children:r.full_name}),e.jsx("p",{className:"text-xs text-muted-foreground",children:r.email})]}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Nome completo *"}),e.jsx("input",{type:"text",value:a.nome,onChange:t=>b("nome",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"Seu nome completo"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"CPF *"}),e.jsx("input",{type:"text",value:a.cpf,onChange:t=>b("cpf",t.target.value.replace(/\D/g,"").slice(0,11)),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"000.000.000-00"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"E-mail *"}),e.jsx("input",{type:"email",value:a.email,onChange:t=>b("email",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"seu@email.com"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Telefone"}),e.jsx("input",{type:"tel",value:a.telefone,onChange:t=>b("telefone",t.target.value.replace(/\D/g,"").slice(0,11)),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"(11) 99999-9999"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"WhatsApp"}),e.jsx("input",{type:"tel",value:a.whatsapp,onChange:t=>b("whatsapp",t.target.value.replace(/\D/g,"").slice(0,11)),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"(11) 99999-9999"})]})]}),e.jsx("div",{className:"mt-6 flex justify-end",children:e.jsxs("button",{onClick:()=>n("address"),className:"btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2",children:["Continuar ",e.jsx(B,{className:"w-4 h-4"})]})})]}),o==="address"&&e.jsxs("div",{className:"bg-surface border border-border rounded-sm p-6 lg:p-8",children:[e.jsx("h2",{className:"font-display text-xl font-bold text-foreground mb-6",children:"Endereço de Entrega"}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"CEP *"}),e.jsx("input",{type:"text",value:a.cep.replace(/\D/g,"").replace(/^(\d{5})(\d{0,3})/,"$1-$2"),onBlur:be,onChange:t=>b("cep",t.target.value.replace(/\D/g,"").slice(0,8)),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"00000-000"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Rua *"}),e.jsx("input",{type:"text",value:a.rua,onChange:t=>b("rua",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"Nome da rua"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Número *"}),e.jsx("input",{type:"text",value:a.numero,onChange:t=>b("numero",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"Nº"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Complemento"}),e.jsx("input",{type:"text",value:a.complemento,onChange:t=>b("complemento",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"Apto, Bloco"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Bairro *"}),e.jsx("input",{type:"text",value:a.bairro,onChange:t=>b("bairro",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"Seu bairro"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Cidade *"}),e.jsx("input",{type:"text",value:a.cidade,onChange:t=>b("cidade",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"Sua cidade"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Estado *"}),e.jsxs("select",{value:a.estado,onChange:t=>b("estado",t.target.value),className:"w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none",children:[e.jsx("option",{value:"",children:"Selecione"}),["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(t=>e.jsx("option",{value:t,children:t},t))]})]})]}),e.jsxs("div",{className:"mt-6 flex justify-between",children:[e.jsxs("button",{onClick:()=>n("info"),className:"border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2",children:[e.jsx(L,{className:"w-4 h-4"})," Voltar"]}),e.jsxs("button",{onClick:()=>n("shipping"),className:"btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2",children:["Continuar ",e.jsx(B,{className:"w-4 h-4"})]})]})]}),o==="shipping"&&e.jsxs("div",{className:"bg-surface border border-border rounded-sm p-6 lg:p-8",children:[e.jsx("h2",{className:"font-display text-xl font-bold text-foreground mb-6",children:"Forma de Entrega"}),C?e.jsxs("div",{className:"flex items-center justify-center py-8",children:[e.jsx(le,{className:"w-6 h-6 text-[var(--gold)] animate-spin"}),e.jsx("span",{className:"ml-2 text-sm text-muted-foreground",children:"Calculando frete..."})]}):e.jsx("div",{className:"space-y-3",children:O.length>0?O.map(t=>e.jsxs("label",{className:`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${x===t.id?"border-[var(--gold)] bg-[var(--gold)]/5":"border-[var(--gold)]/20 hover:border-[var(--gold)]/40"}`,children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("input",{type:"radio",name:"shipping",checked:x===t.id,onChange:()=>V(t.id),className:"accent-[var(--gold)]"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-foreground",children:t.name}),e.jsxs("p",{className:"text-[10px] text-muted-foreground",children:[t.delivery_days," dias úteis"]})]})]}),e.jsx("span",{className:"text-sm font-semibold text-[var(--gold)]",children:t.price===0?"Grátis":`R$ ${t.price.toFixed(2)}`})]},t.id)):q.map(t=>e.jsxs("label",{className:`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${x===t.key?"border-[var(--gold)] bg-[var(--gold)]/5":"border-[var(--gold)]/20 hover:border-[var(--gold)]/40"}`,children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("input",{type:"radio",name:"shipping",checked:x===t.key,onChange:()=>V(t.key),className:"accent-[var(--gold)]"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-foreground",children:t.name}),e.jsxs("p",{className:"text-[10px] text-muted-foreground",children:[t.days," dias úteis"]}),t.note&&e.jsx("p",{className:"text-[10px] text-[var(--success)]",children:t.note})]})]}),e.jsx("span",{className:"text-sm font-semibold text-[var(--gold)]",children:t.price===0?"Grátis":`R$ ${t.price.toFixed(2)}`})]},t.key))}),e.jsxs("div",{className:"mt-6 flex justify-between",children:[e.jsxs("button",{onClick:()=>n("address"),className:"border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2",children:[e.jsx(L,{className:"w-4 h-4"})," Voltar"]}),e.jsxs("button",{onClick:()=>n("payment"),className:"btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2",children:["Continuar ",e.jsx(B,{className:"w-4 h-4"})]})]})]}),o==="payment"&&e.jsxs("div",{className:"bg-surface border border-border rounded-sm p-6 lg:p-8",children:[e.jsx("h2",{className:"font-display text-xl font-bold text-foreground mb-6",children:"Forma de Pagamento"}),e.jsxs("div",{className:"mb-4 p-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm",children:[e.jsx("p",{className:"text-xs text-[var(--gold)] uppercase tracking-wider font-semibold",children:"🔧 Ambiente de Demonstração"}),e.jsx("p",{className:"text-[10px] text-muted-foreground mt-1",children:"Nenhuma cobrança real será processada. As credenciais de pagamento serão configuradas em breve."})]}),e.jsx("div",{className:"space-y-3",children:[{id:"pix",name:"PIX",icon:Re,desc:"Pagamento instantâneo",disabled:!1},{id:"credit",name:"Cartão de Crédito",icon:Pe,desc:"Parcele em até 12x",disabled:!1},{id:"boleto",name:"Boleto Bancário",icon:Y,desc:"Vencimento em 3 dias úteis",disabled:!1},{id:"whatsapp",name:"Pagamento via WhatsApp",icon:H,desc:"Combine o pagamento conosco",disabled:!1}].map(t=>e.jsxs("label",{className:`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${d===t.id?"border-[var(--gold)] bg-[var(--gold)]/5":"border-[var(--gold)]/20 hover:border-[var(--gold)]/40"} ${t.disabled?"opacity-40 pointer-events-none":""}`,children:[e.jsx("input",{type:"radio",name:"payment",value:t.id,checked:d===t.id,onChange:()=>i(t.id),className:"accent-[var(--gold)]"}),e.jsx(t.icon,{className:"w-5 h-5 text-[var(--gold)] shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-foreground",children:t.name}),e.jsx("p",{className:"text-[10px] text-muted-foreground",children:t.desc})]})]},t.id))}),d==="credit"&&e.jsxs("div",{className:"mt-6 p-4 bg-background rounded-sm border border-border",children:[e.jsx("h3",{className:"text-sm font-semibold text-foreground mb-4",children:"Dados do Cartão"}),e.jsxs("div",{className:"grid sm:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Número do Cartão *"}),e.jsx("input",{type:"text",value:g.number,onChange:t=>M({...g,number:t.target.value.replace(/\D/g,"").slice(0,16)}),className:"w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"0000 0000 0000 0000"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Nome no Cartão *"}),e.jsx("input",{type:"text",value:g.name,onChange:t=>M({...g,name:t.target.value.toUpperCase()}),className:"w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"NOME COMO ESTÁ NO CARTÃO"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Validade *"}),e.jsx("input",{type:"text",value:g.expiry,onChange:t=>M({...g,expiry:t.target.value.replace(/\D/g,"").slice(0,4)}),className:"w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"MM/AA"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"CVV *"}),e.jsx("input",{type:"text",value:g.cvv,onChange:t=>M({...g,cvv:t.target.value.replace(/\D/g,"").slice(0,4)}),className:"w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none",placeholder:"000"})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block",children:"Parcelas *"}),e.jsx("select",{value:g.installments,onChange:t=>M({...g,installments:Number(t.target.value)}),className:"w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none",children:ge.map(t=>e.jsx("option",{value:t.value,children:t.label},t.value))})]})]}),e.jsx("p",{className:"text-[10px] text-muted-foreground mt-3",children:"⚠️ Dados do cartão não são salvos. Processamento seguro via gateway de pagamento."})]}),e.jsxs("div",{className:"mt-6 flex justify-between",children:[e.jsxs("button",{onClick:()=>n("shipping"),className:"border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2",children:[e.jsx(L,{className:"w-4 h-4"})," Voltar"]}),e.jsxs("button",{onClick:()=>n("review"),className:"btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2",children:["Revisar ",e.jsx(B,{className:"w-4 h-4"})]})]})]}),o==="review"&&e.jsxs("div",{className:"bg-surface border border-border rounded-sm p-6 lg:p-8",children:[e.jsx("h2",{className:"font-display text-xl font-bold text-foreground mb-6",children:"Revisão do Pedido"}),e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsxs("div",{className:"p-4 bg-background rounded-sm",children:[e.jsx("p",{className:"text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2",children:"Dados Pessoais"}),e.jsx("p",{className:"text-foreground",children:a.nome}),e.jsx("p",{className:"text-muted-foreground",children:a.email}),e.jsx("p",{className:"text-muted-foreground",children:a.telefone})]}),e.jsxs("div",{className:"p-4 bg-background rounded-sm",children:[e.jsx("p",{className:"text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2",children:"Endereço"}),e.jsxs("p",{className:"text-foreground",children:[a.rua,", ",a.numero,a.complemento&&` - ${a.complemento}`]}),e.jsxs("p",{className:"text-muted-foreground",children:[a.bairro," - ",a.cidade,"/",a.estado]}),e.jsxs("p",{className:"text-muted-foreground",children:["CEP: ",a.cep]})]}),e.jsxs("div",{className:"p-4 bg-background rounded-sm",children:[e.jsx("p",{className:"text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2",children:"Itens"}),N.map((t,l)=>e.jsxs("div",{className:"flex items-center gap-3 mb-2 last:mb-0",children:[e.jsx("img",{src:t.image,alt:"",className:"w-10 h-12 object-cover rounded-sm"}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-xs text-foreground truncate",children:t.name}),e.jsxs("p",{className:"text-[10px] text-muted-foreground",children:["Tam: ",t.size," · Qtd: ",t.quantity]})]}),e.jsxs("p",{className:"text-xs font-medium text-[var(--gold)]",children:["R$ ",(t.price*t.quantity).toFixed(2)]})]},l))]}),e.jsxs("div",{className:"p-4 bg-background rounded-sm space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-muted-foreground",children:"Subtotal"}),e.jsxs("span",{className:"text-foreground",children:["R$ ",w.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsxs("span",{className:"text-muted-foreground",children:["Frete (","name"in v?v.name:"Frete Padrão",")"]}),e.jsx("span",{className:_===0?"text-[var(--success)]":"text-foreground",children:_===0?"Grátis":`R$ ${_.toFixed(2)}`})]}),e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-muted-foreground",children:"Forma de pagamento"}),e.jsx("span",{className:"text-foreground capitalize",children:d==="whatsapp"?"WhatsApp":d})]}),d==="credit"&&e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-muted-foreground",children:"Parcelas"}),e.jsxs("span",{className:"text-foreground",children:[g.installments,"x de R$ ",(oe/g.installments).toFixed(2)]})]}),e.jsx("div",{className:"border-t border-border pt-2 mt-2",children:e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-foreground font-semibold",children:"Total"}),e.jsxs("span",{className:"text-[var(--gold)] font-bold",children:["R$ ",oe.toFixed(2)]})]})})]})]}),e.jsx("div",{className:"mt-6 p-4 border border-[var(--gold)]/20 rounded-sm bg-background",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(Ee,{className:"w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-foreground",children:"Compra segura — Pagamento processado com segurança"}),e.jsx("p",{className:"text-[10px] text-muted-foreground mt-1",children:"Seus dados estão protegidos. Nenhuma informação de pagamento é armazenada."})]})]})}),!s&&e.jsx("div",{className:"mt-4 p-4 bg-background rounded-sm border border-border",children:e.jsxs("p",{className:"text-xs text-muted-foreground",children:["💡 Deseja criar sua conta e acompanhar seus pedidos com mais facilidade?"," ",e.jsx($,{to:"/criar-conta",className:"text-[var(--gold)] hover:underline",children:"Criar conta"})]})}),e.jsxs("div",{className:"mt-6 flex justify-between",children:[e.jsxs("button",{onClick:()=>n("payment"),className:"border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2",children:[e.jsx(L,{className:"w-4 h-4"})," Voltar"]}),e.jsx("button",{onClick:ve,disabled:D,className:"btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60",children:D?e.jsx(le,{className:"w-4 h-4 animate-spin"}):e.jsxs(e.Fragment,{children:["Finalizar Pedido ",e.jsx(Q,{className:"w-4 h-4"})]})})]})]})]})})}export{et as default};
