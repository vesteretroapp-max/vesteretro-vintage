import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { handleMercadoPagoWebhook } from "./mercadoPagoWebhook";

const http = httpRouter();

auth.addHttpRoutes(http);

// Mercado Pago Webhook endpoint
http.route({
  path: "/api/webhooks/mercado-pago",
  method: "POST",
  handler: handleMercadoPagoWebhook,
});

export default http;
