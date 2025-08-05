'use client';
import React from 'react';

import MyButton from '@/components/atoms/MyButton';
import { useAuth } from '@/lib/contexts/AuthContext';

import AdminHeaderProps from './index.types';

/**
 * AdminHeader - Header unificato per il pannello di amministrazione
 * 
 * Struttura compatta:
 * - Sezione principale: logo, brand, info utente e logout
 * - Navigazione integrata: tabs con highlight automatico
 * - Design unificato e sticky
 * 
 * Features:
 * - Un solo componente header compatto
 * - Navigazione integrata con separatore visivo
 * - Responsive design ottimizzato
 * - Sticky positioning con z-index corretto
 * - Transizioni smooth per UX migliore
 */
export default function AdminHeader({ 
  currentPage = "dashboard" 
}: AdminHeaderProps) {
  const { user, signOut, isAdmin } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  // Definizione dei link di navigazione
  const navigationLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', key: 'dashboard' },
    { href: '/admin/guides', label: 'Guide', key: 'guides' },
    { href: '/admin/categories', label: 'Categorie', key: 'categories' }
  ] as const;

  return (
    <header className="border-b bg-card sticky top-0 z-50 rounded-lg">
      <div className="container mx-auto px-4">
        
        {/* Sezione principale - Logo, Brand e Azioni Utente */}
        <div className="flex items-center justify-between py-4">
          
          {/* Logo e Brand */}
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Coffee Break Management</p>
            </div>
          </div>

          {/* Utente e Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Amministratore' : 'Utente'}
              </p>
            </div>
            
            <MyButton
              icon="door-open"
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <span className="hidden sm:inline">Esci</span>
            </MyButton>
          </div>
        </div>

        {/* Navigazione integrata */}
        <div className="border-t border-border/50">
          <div className="flex space-x-8 overflow-x-auto">
            {navigationLinks.map(({ href, label, key }) => (
              <a 
                key={key}
                href={href} 
                className={`
                  py-3 text-sm font-medium whitespace-nowrap 
                  border-b-2 transition-colors duration-200
                  ${currentPage === key 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                  }
                `}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        
      </div>
    </header>
  );
}
