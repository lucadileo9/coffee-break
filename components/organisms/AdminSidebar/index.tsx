'use client';

import { LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import MyIcon from '@/components/atoms/MyIcon';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { websiteConfig } from '@/website.config';

import { AdminSidebarProps } from './index.types';

/**
 * AdminSidebar - Sidebar di navigazione per l'admin
 *
 * Features:
 * - Navigazione tra sezioni admin
 * - Highlight della pagina corrente
 * - Responsive (sidebar fissa su desktop, sheet su mobile)
 * - Logout integrato
 * - Info utente
 * - Configurazione centralizzata in website.config.ts
 */

export default function AdminSidebar({
  className,
  isOpen: controlledIsOpen,
  onOpenChange,
}: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);

  // Usa lo stato controllato se fornito, altrimenti quello interno
  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = onOpenChange ?? setInternalIsOpen;

  // Ottieni le voci di navigazione dalla configurazione
  const navigationItems = websiteConfig.admin.navigationItems;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">{websiteConfig.admin.title}</h2>
        <p className="text-sm text-muted-foreground">{websiteConfig.admin.subtitle}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <MyIcon name={item.icon} className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs opacity-70">{item.description}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="space-y-4 border-t p-4">
        {user && (
          <div className="text-sm">
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">Amministratore</p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn("", className)}>
      {/* Mobile Trigger */}
      <div className="fixed left-4 top-4 z-60 lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card lg:block">
        <SidebarContent />
      </div>
    </div>
  );
}
