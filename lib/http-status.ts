/**
 * Costanti HTTP Status Codes
 * 
 * Centralizza tutti i codici di stato HTTP utilizzati nell'applicazione
 * per migliorare la manutenibilità e consistenza delle API.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */

export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,                        // Richiesta elaborata con successo
  CREATED: 201,                   // Risorsa creata con successo
  ACCEPTED: 202,                  // Richiesta accettata ma elaborazione non completata
  NO_CONTENT: 204,                // Successo senza contenuto da restituire

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,         // Risorsa spostata permanentemente
  FOUND: 302,                     // Risorsa trovata ma temporaneamente altrove
  NOT_MODIFIED: 304,              // Risorsa non modificata (cache)

  // 4xx Client Error
  BAD_REQUEST: 400,               // Richiesta malformata o parametri non validi
  UNAUTHORIZED: 401,              // Autenticazione richiesta o fallita
  FORBIDDEN: 403,                 // Accesso negato (autorizzazione insufficiente)
  NOT_FOUND: 404,                 // Risorsa non trovata
  METHOD_NOT_ALLOWED: 405,        // Metodo HTTP non supportato
  CONFLICT: 409,                  // Conflitto con lo stato attuale (es. duplicati)
  UNPROCESSABLE_ENTITY: 422,      // Entità sintatticamente corretta ma semanticamente errata
  TOO_MANY_REQUESTS: 429,         // Tropppe richieste (rate limiting)

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,     // Errore interno del server
  NOT_IMPLEMENTED: 501,           // Funzionalità non implementata
  BAD_GATEWAY: 502,               // Gateway non valido
  SERVICE_UNAVAILABLE: 503,       // Servizio temporaneamente non disponibile
  GATEWAY_TIMEOUT: 504,           // Timeout del gateway
} as const;

/**
 * Type per garantire che vengano utilizzati solo i codici di stato definiti
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Helper function per verificare se un codice di stato indica successo (2xx)
 */
export function isSuccessStatus(status: number): boolean {
  const SUCCESS_START = 200;
  const SUCCESS_END = 300;
  return status >= SUCCESS_START && status < SUCCESS_END;
}

/**
 * Helper function per verificare se un codice di stato indica un errore del client (4xx)
 */
export function isClientErrorStatus(status: number): boolean {
  const CLIENT_ERROR_START = 400;
  const CLIENT_ERROR_END = 500;
  return status >= CLIENT_ERROR_START && status < CLIENT_ERROR_END;
}

/**
 * Helper function per verificare se un codice di stato indica un errore del server (5xx)
 */
export function isServerErrorStatus(status: number): boolean {
  const SERVER_ERROR_START = 500;
  const SERVER_ERROR_END = 600;
  return status >= SERVER_ERROR_START && status < SERVER_ERROR_END;
}

/**
 * Mappatura dei codici di stato ai messaggi di errore standard
 */
export const HTTP_STATUS_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: 'Richiesta non valida',
  [HTTP_STATUS.UNAUTHORIZED]: 'Autenticazione richiesta',
  [HTTP_STATUS.FORBIDDEN]: 'Accesso negato',
  [HTTP_STATUS.NOT_FOUND]: 'Risorsa non trovata',
  [HTTP_STATUS.CONFLICT]: 'Conflitto rilevato',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Dati non processabili',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Troppe richieste',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Errore interno del server',
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Servizio non disponibile',
} as const;
