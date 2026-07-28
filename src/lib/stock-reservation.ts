/**
 * Stock Reservation Service
 * 
 * Manages temporary stock reservations during checkout to prevent overselling.
 * Reservations are released if payment is not completed within the configured time.
 * 
 * In production, this should use database transactions.
 * For demo mode, we use localStorage.
 */

export interface StockReservation {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  size: string;
  quantity: number;
  status: 'active' | 'released' | 'converted' | 'expired';
  expires_at: string;
  created_at: string;
  released_at?: string;
  converted_at?: string;
}

// In-memory store (should use database in production)
const reservations: StockReservation[] = [];

// Default reservation duration: 30 minutes
const RESERVATION_DURATION_MS = 30 * 60 * 1000;

/**
 * Create a stock reservation
 */
export function createReservation(
  orderId: string,
  items: Array<{
    product_id: string;
    variant_id: string;
    size: string;
    quantity: number;
  }>
): StockReservation[] {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RESERVATION_DURATION_MS);

  const newReservations: StockReservation[] = items.map((item) => ({
    id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    order_id: orderId,
    product_id: item.product_id,
    variant_id: item.variant_id,
    size: item.size,
    quantity: item.quantity,
    status: 'active',
    expires_at: expiresAt.toISOString(),
    created_at: now.toISOString(),
  }));

  reservations.push(...newReservations);

  console.log('[Stock Reservation] Created reservations:', {
    orderId,
    count: newReservations.length,
    expiresAt: expiresAt.toISOString(),
  });

  return newReservations;
}

/**
 * Convert reservations to sales (after payment confirmation)
 */
export function convertReservations(orderId: string): StockReservation[] {
  const orderReservations = reservations.filter(
    (r) => r.order_id === orderId && r.status === 'active'
  );

  orderReservations.forEach((r) => {
    r.status = 'converted';
    r.converted_at = new Date().toISOString();
  });

  console.log('[Stock Reservation] Converted reservations:', {
    orderId,
    count: orderReservations.length,
  });

  return orderReservations;
}

/**
 * Release reservations (on cancellation or timeout)
 */
export function releaseReservations(orderId: string): StockReservation[] {
  const orderReservations = reservations.filter(
    (r) => r.order_id === orderId && r.status === 'active'
  );

  orderReservations.forEach((r) => {
    r.status = 'released';
    r.released_at = new Date().toISOString();
  });

  console.log('[Stock Reservation] Released reservations:', {
    orderId,
    count: orderReservations.length,
  });

  return orderReservations;
}

/**
 * Check available stock (considering active reservations)
 */
export function getAvailableStock(
  productId: string,
  size: string,
  totalStock: number
): number {
  const activeReservations = reservations.filter(
    (r) =>
      r.product_id === productId &&
      r.size === size &&
      r.status === 'active' &&
      new Date(r.expires_at) > new Date()
  );

  const reservedQuantity = activeReservations.reduce(
    (sum, r) => sum + r.quantity,
    0
  );

  return Math.max(0, totalStock - reservedQuantity);
}

/**
 * Check if stock is available for an order
 */
export function checkStockAvailability(
  items: Array<{
    product_id: string;
    size: string;
    quantity: number;
  }>,
  stockLevels: Record<string, number>
): {
  available: boolean;
  unavailableItems: Array<{
    product_id: string;
    size: string;
    requested: number;
    available: number;
  }>;
} {
  const unavailableItems: Array<{
    product_id: string;
    size: string;
    requested: number;
    available: number;
  }> = [];

  for (const item of items) {
    const totalStock = stockLevels[`${item.product_id}-${item.size}`] || 0;
    const available = getAvailableStock(item.product_id, item.size, totalStock);

    if (item.quantity > available) {
      unavailableItems.push({
        product_id: item.product_id,
        size: item.size,
        requested: item.quantity,
        available,
      });
    }
  }

  return {
    available: unavailableItems.length === 0,
    unavailableItems,
  };
}

/**
 * Clean up expired reservations
 */
export function cleanupExpiredReservations(): number {
  const now = new Date();
  let cleanedCount = 0;

  for (let i = reservations.length - 1; i >= 0; i--) {
    const reservation = reservations[i];
    if (
      reservation.status === 'active' &&
      new Date(reservation.expires_at) < now
    ) {
      reservation.status = 'expired';
      reservation.released_at = now.toISOString();
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log('[Stock Reservation] Cleaned up expired reservations:', cleanedCount);
  }

  return cleanedCount;
}

/**
 * Get reservations for an order
 */
export function getOrderReservations(orderId: string): StockReservation[] {
  return reservations.filter((r) => r.order_id === orderId);
}

/**
 * Get reservation statistics
 */
export function getReservationStats(): {
  total: number;
  active: number;
  converted: number;
  released: number;
  expired: number;
} {
  return {
    total: reservations.length,
    active: reservations.filter((r) => r.status === 'active').length,
    converted: reservations.filter((r) => r.status === 'converted').length,
    released: reservations.filter((r) => r.status === 'released').length,
    expired: reservations.filter((r) => r.status === 'expired').length,
  };
}

export default {
  createReservation,
  convertReservations,
  releaseReservations,
  getAvailableStock,
  checkStockAvailability,
  cleanupExpiredReservations,
  getOrderReservations,
  getReservationStats,
};
