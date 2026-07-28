/**
 * Abandoned Cart Recovery System
 * 
 * Tracks carts that were abandoned before checkout completion.
 * Helps recover lost sales through email reminders and incentives.
 * 
 * In production, this should use database + scheduled jobs.
 * For demo mode, we use localStorage.
 */

export interface AbandonedCart {
  id: string;
  user_id?: string;
  email?: string;
  phone?: string;
  cart_id: string;
  items: Array<{
    product_id: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  status: 'active' | 'reminder_sent' | 'recovered' | 'expired';
  recovery_token: string;
  abandoned_at: string;
  reminder_sent_at?: string;
  recovered_at?: string;
  created_at: string;
}

// In-memory store (should use database in production)
const abandonedCarts: AbandonedCart[] = [];

// Configuration
const CONFIG = {
  abandonment_timeout_ms: 30 * 60 * 1000, // 30 minutes of inactivity
  reminder_delay_ms: 24 * 60 * 60 * 1000, // 24 hours after abandonment
  max_reminders: 2,
  recovery_token_length: 32,
};

/**
 * Generate a random recovery token
 */
function generateRecoveryToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < CONFIG.recovery_token_length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Track or update cart activity
 */
export function trackCartActivity(
  cartId: string,
  items: AbandonedCart['items'],
  subtotal: number,
  userInfo?: {
    user_id?: string;
    email?: string;
    phone?: string;
  }
): AbandonedCart {
  const existingCart = abandonedCarts.find(
    (c) => c.cart_id === cartId && c.status === 'active'
  );

  if (existingCart) {
    // Update existing cart
    existingCart.items = items;
    existingCart.subtotal = subtotal;
    existingCart.created_at = new Date().toISOString();
    
    if (userInfo) {
      if (userInfo.email) existingCart.email = userInfo.email;
      if (userInfo.phone) existingCart.phone = userInfo.phone;
      if (userInfo.user_id) existingCart.user_id = userInfo.user_id;
    }
    
    return existingCart;
  }

  // Create new cart tracking
  const cart: AbandonedCart = {
    id: `ac_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    user_id: userInfo?.user_id,
    email: userInfo?.email,
    phone: userInfo?.phone,
    cart_id: cartId,
    items,
    subtotal,
    status: 'active',
    recovery_token: generateRecoveryToken(),
    abandoned_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  abandonedCarts.push(cart);
  
  console.log('[Abandoned Cart] Tracking cart:', cart.id);
  
  return cart;
}

/**
 * Mark cart as abandoned (called by scheduled job)
 */
export function markAsAbandoned(): AbandonedCart[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() - CONFIG.abandonment_timeout_ms);
  
  const newlyAbandoned: AbandonedCart[] = [];
  
  abandonedCarts.forEach((cart) => {
    if (
      cart.status === 'active' &&
      new Date(cart.created_at) < cutoff &&
      cart.items.length > 0
    ) {
      cart.status = 'active'; // Still active, but eligible for reminders
      cart.abandoned_at = cart.created_at;
      newlyAbandoned.push(cart);
    }
  });
  
  if (newlyAbandoned.length > 0) {
    console.log('[Abandoned Cart] Marked as abandoned:', newlyAbandoned.length);
  }
  
  return newlyAbandoned;
}

/**
 * Get carts eligible for reminder emails
 */
export function getCartsForReminder(): AbandonedCart[] {
  const now = new Date();
  const reminderCutoff = new Date(now.getTime() - CONFIG.reminder_delay_ms);
  
  return abandonedCarts.filter((cart) => {
    // Must be active and have email
    if (cart.status !== 'active' || !cart.email) return false;
    
    // Must be abandoned long enough
    if (new Date(cart.abandoned_at) > reminderCutoff) return false;
    
    // Must not have sent max reminders
    if (cart.reminder_sent_at) {
      const lastReminder = new Date(cart.reminder_sent_at);
      const daysSinceReminder = (now.getTime() - lastReminder.getTime()) / (24 * 60 * 60 * 1000);
      if (daysSinceReminder < 1) return false; // Wait at least 1 day between reminders
    }
    
    return true;
  });
}

/**
 * Mark reminder as sent
 */
export function markReminderSent(cartId: string): void {
  const cart = abandonedCarts.find((c) => c.id === cartId);
  if (cart) {
    cart.reminder_sent_at = new Date().toISOString();
    cart.status = 'reminder_sent';
    console.log('[Abandoned Cart] Reminder sent:', cartId);
  }
}

/**
 * Mark cart as recovered (when checkout completes)
 */
export function markAsRecovered(cartId: string): void {
  const cart = abandonedCarts.find((c) => c.cart_id === cartId);
  if (cart) {
    cart.status = 'recovered';
    cart.recovered_at = new Date().toISOString();
    console.log('[Abandoned Cart] Cart recovered:', cartId);
  }
}

/**
 * Get recovery URL for cart
 */
export function getRecoveryUrl(cartId: string, baseUrl: string): string {
  const cart = abandonedCarts.find((c) => c.cart_id === cartId);
  if (!cart) return '';
  
  return `${baseUrl}/carrinho?recovery=${cart.recovery_token}`;
}

/**
 * Recover cart from token
 */
export function recoverCart(token: string): AbandonedCart | null {
  const cart = abandonedCarts.find(
    (c) => c.recovery_token === token && c.status !== 'expired'
  );
  
  if (cart) {
    console.log('[Abandoned Cart] Cart recovered via token:', cart.id);
    return cart;
  }
  
  return null;
}

/**
 * Get abandoned cart statistics
 */
export function getAbandonedCartStats(): {
  total: number;
  active: number;
  reminder_sent: number;
  recovered: number;
  expired: number;
  recovery_rate: number;
  potential_revenue: number;
  recovered_revenue: number;
} {
  const total = abandonedCarts.length;
  const active = abandonedCarts.filter((c) => c.status === 'active').length;
  const reminder_sent = abandonedCarts.filter((c) => c.status === 'reminder_sent').length;
  const recovered = abandonedCarts.filter((c) => c.status === 'recovered').length;
  const expired = abandonedCarts.filter((c) => c.status === 'expired').length;
  
  const recovery_rate = total > 0 ? (recovered / total) * 100 : 0;
  
  const potential_revenue = abandonedCarts
    .filter((c) => c.status !== 'recovered')
    .reduce((sum, c) => sum + c.subtotal, 0);
  
  const recovered_revenue = abandonedCarts
    .filter((c) => c.status === 'recovered')
    .reduce((sum, c) => sum + c.subtotal, 0);
  
  return {
    total,
    active,
    reminder_sent,
    recovered,
    expired,
    recovery_rate,
    potential_revenue,
    recovered_revenue,
  };
}

/**
 * Clean up old abandoned carts
 */
export function cleanupOldCarts(daysToKeep: number = 90): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);
  
  const initialCount = abandonedCarts.length;
  
  for (let i = abandonedCarts.length - 1; i >= 0; i--) {
    if (new Date(abandonedCarts[i].created_at) < cutoff) {
      abandonedCarts.splice(i, 1);
    }
  }
  
  return initialCount - abandonedCarts.length;
}

export default {
  trackCartActivity,
  markAsAbandoned,
  getCartsForReminder,
  markReminderSent,
  markAsRecovered,
  getRecoveryUrl,
  recoverCart,
  getAbandonedCartStats,
  cleanupOldCarts,
};
