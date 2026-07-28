/**
 * Melhor Envio Shipping Integration
 * 
 * Provides real shipping calculations for Brazilian e-commerce.
 * Supports Correios, Jadlog, Loggi, and other carriers.
 * 
 * Environment Variables Required:
 * - MELHOR_ENVIO_TOKEN: API authentication token
 * - MELHOR_ENVIO_ENVIRONMENT: 'sandbox' or 'production'
 * - MELHOR_ENVIO_FROM_POSTAL_CODE: Origin postal code for calculations
 */

export interface ShippingOption {
  id: string;
  carrier: string;
  service: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  delivery_days: number;
  delivery_range?: {
    min: number;
    max: number;
  };
  tracking?: boolean;
  home_delivery: boolean;
  pickup_available: boolean;
}

export interface ShippingRequest {
  from_postal_code: string;
  to_postal_code: string;
  products: Array<{
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }>;
  services?: string[];
}

export interface ShippingResult {
  success: boolean;
  options: ShippingOption[];
  error?: string;
}

const MELHOR_ENVIO_API = {
  sandbox: 'https://sandbox.melhorenvio.com.br/api/v2',
  production: 'https://www.melhorenvio.com.br/api/v2',
};

// Default product dimensions (for items without specified dimensions)
const DEFAULT_PRODUCT = {
  width: 30,  // cm
  height: 5,  // cm
  length: 40, // cm
  weight: 0.5, // kg
  insurance_value: 100,
};

export class MelhorEnvioProvider {
  private token: string;
  private environment: 'sandbox' | 'production';
  private fromPostalCode: string;
  isConfigured: boolean;
  
  constructor() {
    this.token = import.meta.env.VITE_MELHOR_ENVIO_TOKEN || '';
    this.environment = (import.meta.env.VITE_MELHOR_ENVIO_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
    this.fromPostalCode = import.meta.env.VITE_MELHOR_ENVIO_FROM_POSTAL_CODE || '01001-000';
    
    this.isConfigured = Boolean(this.token);
    
    if (this.isConfigured) {
      console.log(`[Melhor Envio] Configured in ${this.environment} mode`);
    } else {
      console.warn('[Melhor Envio] Not configured - using demo mode');
    }
  }
  
  private getApiUrl(): string {
    return MELHOR_ENVIO_API[this.environment];
  }
  
  private async request(path: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.getApiUrl()}${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Melhor Envio API error: ${response.status} - ${JSON.stringify(error)}`);
    }
    
    return response.json();
  }
  
  async calculateShipping(request: ShippingRequest): Promise<ShippingResult> {
    if (!this.isConfigured) {
      return this.fallbackShippingCalculation(request);
    }
    
    try {
      const body = {
        from: { postal_code: request.from_postal_code.replace(/\D/g, '') },
        to: { postal_code: request.to_postal_code.replace(/\D/g, '') },
        products: request.products.map(p => ({
          ...DEFAULT_PRODUCT,
          ...p,
        })),
        services: request.services || ['1', '2'], // Correios PAC and SEDEX
      };
      
      const result = await this.request('/me/shipment/calculate', {
        method: 'POST',
        body: JSON.stringify(body),
      }) as Array<Record<string, unknown>>;
      
      const options: ShippingOption[] = result
        .filter((r: Record<string, unknown>) => !r.error)
        .map((r: Record<string, unknown>) => ({
          id: String(r.id),
          carrier: String((r.company as Record<string, unknown>)?.name || 'Correios'),
          service: String(r.name || ''),
          name: String(r.name || ''),
          description: String(r.name || ''),
          price: Number(r.price || 0),
          original_price: Number(r.original_price || r.price || 0),
          delivery_days: Number(r.delivery_time || 0),
          delivery_range: {
            min: Number(r.delivery_time || 0),
            max: Number(r.delivery_time || 0) + 2,
          },
          tracking: Boolean(r.tracking),
          home_delivery: Boolean(r.home_delivery),
          pickup_available: Boolean(r.pickup_available),
        }));
      
      return {
        success: true,
        options,
      };
    } catch (error) {
      console.error('[Melhor Envio] Shipping calculation error:', error);
      return {
        success: false,
        options: [],
        error: error instanceof Error ? error.message : 'Failed to calculate shipping',
      };
    }
  }
  
  private fallbackShippingCalculation(request: ShippingRequest): ShippingResult {
    console.log('[Melhor Envio Demo] Calculating shipping:', {
      from: request.from_postal_code,
      to: request.to_postal_code,
    });
    
    // Calculate distance-based pricing (simplified)
    const fromCep = request.from_postal_code.replace(/\D/g, '');
    const toCep = request.to_postal_code.replace(/\D/g, '');
    
    // Simple region-based pricing
    const fromRegion = Math.floor(parseInt(fromCep) / 1000000);
    const toRegion = Math.floor(parseInt(toCep) / 1000000);
    const sameRegion = fromRegion === toRegion;
    
    // Calculate total weight
    const totalWeight = request.products.reduce(
      (acc, p) => acc + (p.weight || DEFAULT_PRODUCT.weight) * p.quantity,
      0
    );
    
    // Base prices
    const pacBase = sameRegion ? 15.90 : 22.90;
    const sedexBase = sameRegion ? 25.90 : 39.90;
    
    // Weight multiplier
    const weightMultiplier = 1 + (totalWeight - 0.5) * 0.3;
    
    const options: ShippingOption[] = [
      {
        id: 'pac',
        carrier: 'Correios',
        service: 'PAC',
        name: 'PAC',
        description: 'Entrega padrão via Correios',
        price: Math.round(pacBase * weightMultiplier * 100) / 100,
        original_price: Math.round(pacBase * weightMultiplier * 100) / 100,
        delivery_days: sameRegion ? 7 : 12,
        delivery_range: {
          min: sameRegion ? 5 : 10,
          max: sameRegion ? 10 : 15,
        },
        tracking: true,
        home_delivery: true,
        pickup_available: false,
      },
      {
        id: 'sedex',
        carrier: 'Correios',
        service: 'SEDEX',
        name: 'SEDEX',
        description: 'Entrega expressa via Correios',
        price: Math.round(sedexBase * weightMultiplier * 100) / 100,
        original_price: Math.round(sedexBase * weightMultiplier * 100) / 100,
        delivery_days: sameRegion ? 3 : 5,
        delivery_range: {
          min: sameRegion ? 2 : 4,
          max: sameRegion ? 4 : 7,
        },
        tracking: true,
        home_delivery: true,
        pickup_available: false,
      },
    ];
    
    // Add free shipping option if total exceeds threshold
    const subtotal = request.products.reduce(
      (acc, p) => acc + (p.insurance_value || DEFAULT_PRODUCT.insurance_value) * p.quantity,
      0
    );
    
    if (subtotal >= 299.90) {
      options.unshift({
        id: 'free',
        carrier: 'VesteRetro',
        service: 'Frete Grátis',
        name: 'Frete Grátis',
        description: 'Entrega gratuita para compras acima de R$ 299,90',
        price: 0,
        original_price: pacBase * weightMultiplier,
        delivery_days: 10,
        delivery_range: {
          min: 7,
          max: 15,
        },
        tracking: true,
        home_delivery: true,
        pickup_available: false,
      });
    }
    
    return {
      success: true,
      options,
    };
  }
  
  async validatePostalCode(postalCode: string): Promise<boolean> {
    const cleaned = postalCode.replace(/\D/g, '');
    
    if (cleaned.length !== 8) {
      return false;
    }
    
    if (!this.isConfigured) {
      // Basic validation for demo mode
      const firstDigit = parseInt(cleaned[0]);
      return firstDigit >= 0 && firstDigit <= 9;
    }
    
    try {
      await this.request(`/me/shipment/validate?postal_code=${cleaned}`);
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let melhorEnvioInstance: MelhorEnvioProvider | null = null;

export function getMelhorEnvioProvider(): MelhorEnvioProvider {
  if (!melhorEnvioInstance) {
    melhorEnvioInstance = new MelhorEnvioProvider();
  }
  return melhorEnvioInstance;
}

export default {
  getMelhorEnvioProvider,
  MelhorEnvioProvider,
};
