/**
 * ESEMPI DI UTILIZZO DI MyButton e ErrorMessage aggiornato
 *
 * Questo file mostra come utilizzare:
 * 1. MyButton - Button con MyIcon integrato
 * 2. ErrorMessage - Aggiornato per usare MyIcon e MyButton
 */

import React, { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import MyButton from '@/components/atoms/MyButton';

const MyButtonExamples = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    console.warn('Button clicked');
  };

  const handleRetry = () => {
    console.warn('Retry clicked');
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      {/* ===== MyButton EXAMPLES ===== */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">MyButton Examples</h2>

        <div className="space-y-6">
          {/* Buttons base con icone */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Button con Icone</h3>
            <div className="flex flex-wrap gap-4">
              <MyButton icon="check-circle" onClick={handleClick}>
                Salva
              </MyButton>

              <MyButton icon="mail" variant="secondary" onClick={handleClick}>
                Invia Email
              </MyButton>

              <MyButton
                icon="user-plus"
                variant="outline"
                onClick={handleClick}
              >
                Aggiungi Utente
              </MyButton>

              <MyButton
                icon="shield"
                variant="destructive"
                onClick={handleClick}
              >
                Elimina
              </MyButton>
            </div>
          </div>

          {/* Dimensioni diverse */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Dimensioni</h3>
            <div className="flex flex-wrap items-center gap-4">
              <MyButton icon="cog" size="sm" onClick={handleClick}>
                Piccolo
              </MyButton>

              <MyButton icon="cog" size="default" onClick={handleClick}>
                Normale
              </MyButton>

              <MyButton icon="cog" size="lg" onClick={handleClick}>
                Grande
              </MyButton>
            </div>
          </div>

          {/* Icona a destra */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Icona a Destra</h3>
            <div className="flex flex-wrap gap-4">
              <MyButton
                icon="flag"
                iconPosition="right"
                variant="outline"
                onClick={handleClick}
              >
                Segnala
              </MyButton>

              <MyButton
                icon="door-open"
                iconPosition="right"
                variant="ghost"
                onClick={handleClick}
              >
                Esci
              </MyButton>
            </div>
          </div>

          {/* Icon-only buttons */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Solo Icona</h3>
            <div className="flex flex-wrap gap-4">
              <MyButton icon="cog" iconOnly={true} onClick={handleClick}>
                Impostazioni
              </MyButton>

              <MyButton
                icon="users"
                iconOnly={true}
                variant="secondary"
                size="sm"
                onClick={handleClick}
              >
                Utenti
              </MyButton>

              <MyButton
                icon="lightbulb"
                iconOnly={true}
                variant="outline"
                size="lg"
                onClick={handleClick}
              >
                Idea
              </MyButton>
            </div>
          </div>

          {/* Loading state */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Loading State</h3>
            <div className="flex flex-wrap gap-4">
              <MyButton
                icon="database"
                loading={loading}
                loadingText="Caricamento..."
                onClick={handleLoadingTest}
              >
                Carica Dati
              </MyButton>

              <MyButton
                icon="check-circle"
                loading={true}
                variant="secondary"
                onClick={handleClick}
              >
                Sempre Loading
              </MyButton>

              <MyButton
                icon="users"
                iconOnly={true}
                loading={loading}
                onClick={handleLoadingTest}
              >
                Solo Icona Loading
              </MyButton>
            </div>
          </div>

          {/* Disabled */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Disabilitato</h3>
            <div className="flex flex-wrap gap-4">
              <MyButton icon="shield" disabled={true} onClick={handleClick}>
                Disabilitato
              </MyButton>

              <MyButton
                icon="users"
                iconOnly={true}
                disabled={true}
                variant="destructive"
                onClick={handleClick}
              >
                Elimina Disabilitato
              </MyButton>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ERROR MESSAGE EXAMPLES (Updated) ===== */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">
          ErrorMessage Examples (con MyIcon e MyButton)
        </h2>

        <div className="space-y-6">
          {/* Errore semplice */}
          <ErrorMessage message="Si è verificato un errore durante il caricamento dei dati." />

          {/* Errore con retry */}
          <ErrorMessage
            title="Errore di Connessione"
            message="Impossibile connettersi al server."
            details="Codice errore: 500 - Internal Server Error"
            onRetry={handleRetry}
            retryText="Riprova"
          />

          {/* Warning con retry */}
          <ErrorMessage
            variant="warning"
            title="Attenzione"
            message="Alcuni dati potrebbero non essere aggiornati."
            details="L'ultima sincronizzazione è avvenuta 2 ore fa."
            onRetry={handleRetry}
            retryText="Sincronizza Ora"
          />

          {/* Info con retry */}
          <ErrorMessage
            variant="info"
            title="Informazione"
            message="La sincronizzazione è in corso."
            details="Tempo stimato: 2-3 minuti"
            onRetry={handleRetry}
            retryText="Aggiorna Status"
          />

          {/* Errore senza icona */}
          <ErrorMessage
            message="Messaggio senza icona per layout più pulito."
            showIcon={false}
            onRetry={handleRetry}
          />
        </div>
      </section>

      {/* Test area */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Area Test</h2>
        <div className="rounded-lg border bg-muted/20 p-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Clicca il button Test Loading per vedere l animazione di loading in
            azione.
          </p>
          <MyButton
            icon="zap"
            onClick={handleLoadingTest}
            disabled={loading}
            loading={loading}
            loadingText="Testing..."
            variant="outline"
          >
            Test Loading (3s)
          </MyButton>
        </div>
      </section>
    </div>
  );
};

export default MyButtonExamples;
