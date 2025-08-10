export default interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Se true, richiede che l'utente sia un admin
  fallback?: React.ReactNode; // Componente da mostrare se non autorizzato
}
