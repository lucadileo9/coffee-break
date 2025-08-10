// Interfacce per AdminLayout

export default interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  currentPage?: 'dashboard' | 'guides' | 'categories';
}
