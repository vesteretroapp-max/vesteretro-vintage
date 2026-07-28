/**
 * Integration Logs Service
 * 
 * Tracks all integration activities for debugging and auditing.
 * Logs API calls, webhook events, email sends, and errors.
 */

export type IntegrationService = 
  | 'mercadopago'
  | 'melhor_envio'
  | 'resend'
  | 'supabase'
  | 'whatsapp'
  | 'viacep';

export type LogAction = 
  | 'payment_create'
  | 'payment_status'
  | 'payment_cancel'
  | 'payment_refund'
  | 'webhook_received'
  | 'webhook_processed'
  | 'shipping_calculate'
  | 'email_send'
  | 'order_create'
  | 'order_update'
  | 'api_call'
  | 'api_error'
  | 'config_change';

export interface IntegrationLog {
  id: string;
  service: IntegrationService;
  action: LogAction;
  request_reference?: string;
  response_status?: number;
  success: boolean;
  error_message?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// In-memory store (should use database in production)
const integrationLogs: IntegrationLog[] = [];
const MAX_LOGS = 1000;

/**
 * Create a new integration log entry
 */
export function createLog(
  service: IntegrationService,
  action: LogAction,
  options: {
    request_reference?: string;
    response_status?: number;
    success: boolean;
    error_message?: string;
    metadata?: Record<string, unknown>;
  } = { success: true }
): IntegrationLog {
  const log: IntegrationLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    service,
    action,
    request_reference: options.request_reference,
    response_status: options.response_status,
    success: options.success,
    error_message: options.error_message,
    metadata: options.metadata,
    created_at: new Date().toISOString(),
  };

  integrationLogs.unshift(log);

  // Trim old logs
  if (integrationLogs.length > MAX_LOGS) {
    integrationLogs.splice(MAX_LOGS);
  }

  // Console output for debugging
  if (options.success) {
    console.log(`[Integration] ${service}.${action}:`, {
      reference: options.request_reference,
      status: options.response_status,
    });
  } else {
    console.error(`[Integration] ${service}.${action} FAILED:`, options.error_message);
  }

  return log;
}

/**
 * Get logs filtered by service, action, or time range
 */
export function getLogs(filters?: {
  service?: IntegrationService;
  action?: LogAction;
  success?: boolean;
  limit?: number;
  since?: string;
}): IntegrationLog[] {
  let logs = [...integrationLogs];

  if (filters?.service) {
    logs = logs.filter((l) => l.service === filters.service);
  }

  if (filters?.action) {
    logs = logs.filter((l) => l.action === filters.action);
  }

  if (filters?.success !== undefined) {
    logs = logs.filter((l) => l.success === filters.success);
  }

  if (filters?.since) {
    const sinceDate = new Date(filters.since);
    logs = logs.filter((l) => new Date(l.created_at) >= sinceDate);
  }

  return logs.slice(0, filters?.limit || 100);
}

/**
 * Get logs statistics
 */
export function getLogStats(): {
  total: number;
  byService: Record<string, number>;
  byAction: Record<string, number>;
  successRate: number;
  recentErrors: IntegrationLog[];
} {
  const total = integrationLogs.length;
  
  const byService: Record<string, number> = {};
  const byAction: Record<string, number> = {};
  let successCount = 0;

  integrationLogs.forEach((log) => {
    byService[log.service] = (byService[log.service] || 0) + 1;
    byAction[log.action] = (byAction[log.action] || 0) + 1;
    if (log.success) successCount++;
  });

  const successRate = total > 0 ? (successCount / total) * 100 : 100;

  const recentErrors = integrationLogs
    .filter((l) => !l.success)
    .slice(0, 10);

  return {
    total,
    byService,
    byAction,
    successRate,
    recentErrors,
  };
}

/**
 * Clear old logs (for maintenance)
 */
export function clearOldLogs(daysToKeep: number = 30): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysToKeep);

  const initialCount = integrationLogs.length;
  
  for (let i = integrationLogs.length - 1; i >= 0; i--) {
    if (new Date(integrationLogs[i].created_at) < cutoff) {
      integrationLogs.splice(i, 1);
    }
  }

  return initialCount - integrationLogs.length;
}

export default {
  createLog,
  getLogs,
  getLogStats,
  clearOldLogs,
};
