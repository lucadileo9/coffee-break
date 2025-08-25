/**
 * Logger utility per gestire console log in modo sicuro
 * In produzione disabilita i log sensibili
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log per errori - sempre attivo (necessario per monitoring)
   */
  error: (message: string, ...args: unknown[]) => {
    console.error(message, ...args);
  },

  /**
   * Log per warning - solo in development
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },

  /**
   * Log per debug - solo in development
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(message, ...args);
    }
  },

  /**
   * Log per info - solo in development
   */
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(message, ...args);
    }
  },

  /**
   * Log per dati sensibili - MAI in produzione
   */
  sensitive: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`[SENSITIVE] ${message}`, ...args);
    }
  },
};

/**
 * Helper per logging condizionale di autenticazione
 */
export const authLogger = {
  loginAttempt: (email: string) => {
    if (isDevelopment) {
      console.warn(`🔑 Tentativo login per: ${email}`);
    }
  },

  loginSuccess: (email: string) => {
    if (isDevelopment) {
      console.warn(`✅ Login riuscito per: ${email}`);
    } else {
      // In produzione logga solo che c'è stato un login (senza email)
      // eslint-disable-next-line no-console
      console.info('Login successful');
    }
  },

  loginFailed: (email: string, error: string) => {
    if (isDevelopment) {
      console.error(`❌ Login fallito per ${email}:`, error);
    } else {
      // In produzione logga solo l'errore (senza email)
      console.error('Login failed:', error);
    }
  },

  logout: () => {
    if (isDevelopment) {
      console.warn('🚪 Logout riuscito, redirect alla home');
    }
  },

  tokenExpired: () => {
    logger.warn('🔄 Token scaduto rilevato, effettuo logout automatico');
  },
};
