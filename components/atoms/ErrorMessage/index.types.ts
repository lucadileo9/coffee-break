export default interface ErrorMessageProps {
  message: string; // Il messaggio di errore da visualizzare
  title?: string; // Titolo dell'errore (opzionale), default: "Errore"
  details?: string; // Dettagli aggiuntivi dell'errore (opzionali)
  variant?: 'error' | 'warning' | 'info'; // Tipo di errore per styling diverso, default: "error"
  showIcon?: boolean; // Se mostrare l'icona, default: true
  onRetry?: () => void; // Funzione callback per azione di retry (opzionale)
  retryText?: string; // Testo del button di retry, default: "Riprova"
  className?: string; // Classi CSS aggiuntive
}
