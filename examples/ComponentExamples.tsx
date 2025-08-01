/**
 * ESEMPI DI UTILIZZO DEI COMPONENTI ATOMICI
 *
 * Questo file mostra come utilizzare i tre componenti appena creati:
 * 1. SimpleTitle
 * 2. ErrorMessage
 * 3. IconButton
 */

import { Search, Download, Trash2, Plus } from 'lucide-react';
import React from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import SimpleTitle from '@/components/atoms/SimpleTitle';

import IconButton from '@/components/atoms/IconButton';

const ComponentExamples = () => {
  return (
    <div className="space-y-8 p-8">
      {/* ===== SIMPLE TITLE EXAMPLES ===== */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">SimpleTitle Examples</h2>

        {/* Titolo principale */}
        <SimpleTitle level="h1" className="mb-4">
          Questo è un titolo H1
        </SimpleTitle>

        {/* Sottotitolo */}
        <SimpleTitle level="h2" className="mb-4">
          Questo è un titolo H2
        </SimpleTitle>

        {/* Titolo sezione */}
        <SimpleTitle level="h3" className="mb-4">
          Questo è un titolo H3
        </SimpleTitle>

        {/* Titolo con custom class */}
        <SimpleTitle level="h4" className="mb-4 text-primary" id="custom-title">
          Titolo H4 con stile personalizzato
        </SimpleTitle>
      </section>

      {/* ===== ERROR MESSAGE EXAMPLES ===== */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">ErrorMessage Examples</h2>

        {/* Errore base */}
        <ErrorMessage
          message="Si è verificato un errore durante il caricamento dei dati."
          className="mb-4"
        />

        {/* Errore con dettagli e retry */}
        <ErrorMessage
          title="Errore di Connessione"
          message="Impossibile connettersi al server."
          details="Codice errore: 500 - Internal Server Error"
          onRetry={() => console.log('Retry clicked')}
          className="mb-4"
        />

        {/* Warning */}
        <ErrorMessage
          variant="warning"
          title="Attenzione"
          message="Alcuni dati potrebbero non essere aggiornati."
          className="mb-4"
        />

        {/* Info */}
        <ErrorMessage
          variant="info"
          title="Informazione"
          message="La sincronizzazione è in corso."
          showIcon={true}
          className="mb-4"
        />

        {/* Errore senza icona */}
        <ErrorMessage
          message="Errore senza icona."
          showIcon={false}
          className="mb-4"
        />
      </section>

      {/* ===== ICON BUTTON EXAMPLES ===== */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">IconButton Examples</h2>

        <div className="mb-6 flex flex-wrap gap-4">
          {/* Button primary con icona */}
          <IconButton
            icon={Search}
            label="Cerca"
            onClick={() => console.log('Search clicked')}
          />

          {/* Button secondary */}
          <IconButton
            icon={Download}
            label="Scarica"
            variant="secondary"
            onClick={() => console.log('Download clicked')}
          />

          {/* Button outline */}
          <IconButton
            icon={Plus}
            label="Aggiungi"
            variant="outline"
            onClick={() => console.log('Add clicked')}
          />

          {/* Button destructive */}
          <IconButton
            icon={Trash2}
            label="Elimina"
            variant="destructive"
            onClick={() => console.log('Delete clicked')}
          />

          {/* Button ghost */}
          <IconButton
            icon={Search}
            label="Cerca"
            variant="ghost"
            onClick={() => console.log('Ghost search clicked')}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          {/* Dimensioni diverse */}
          <IconButton
            icon={Search}
            label="Small"
            size="sm"
            onClick={() => console.log('Small clicked')}
          />

          <IconButton
            icon={Search}
            label="Medium (default)"
            size="md"
            onClick={() => console.log('Medium clicked')}
          />

          <IconButton
            icon={Search}
            label="Large"
            size="lg"
            onClick={() => console.log('Large clicked')}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          {/* Icon-only buttons */}
          <IconButton
            icon={Search}
            label="Cerca"
            iconOnly={true}
            onClick={() => console.log('Icon only clicked')}
          />

          <IconButton
            icon={Download}
            label="Scarica"
            iconOnly={true}
            variant="secondary"
            onClick={() => console.log('Icon only download clicked')}
          />

          <IconButton
            icon={Trash2}
            label="Elimina"
            iconOnly={true}
            variant="destructive"
            size="sm"
            onClick={() => console.log('Icon only delete clicked')}
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          {/* Icona a destra */}
          <IconButton
            icon={Download}
            label="Scarica File"
            iconPosition="right"
            onClick={() => console.log('Right icon clicked')}
          />

          {/* Button disabilitato */}
          <IconButton
            icon={Search}
            label="Disabilitato"
            disabled={true}
            onClick={() => console.log('Disabled clicked')}
          />

          {/* Button loading */}
          <IconButton
            icon={Download}
            label="Caricamento..."
            loading={true}
            onClick={() => console.log('Loading clicked')}
          />
        </div>
      </section>
    </div>
  );
};

export default ComponentExamples;
