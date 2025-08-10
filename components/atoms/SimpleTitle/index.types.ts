export default interface SimpleTitleProps {
  children: React.ReactNode; // Testo del titolo
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // Livello del titolo, default è 'h1'
  className?: string; // Classi CSS aggiuntive per personalizzazione
  id?: string; // ID del titolo per accessibilità
}
