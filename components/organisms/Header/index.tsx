'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { FC, useState } from 'react';

import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { websiteConfig } from '@/website.config';

import { HeaderProps, MenuItem } from './index.types';

const ANIMATION_DELAY_INCREMENT = 0.1;
const ANIMATION_BASE_DELAY = 0.2;
const ANIMATION_DURATION = 0.2;

const Header: FC<HeaderProps> = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, signOut } = useAuth();

  // Funzione per filtrare i menu items in base allo stato auth
  const getFilteredMenuItems = (): MenuItem[] => {
    const baseItems = websiteConfig.menuItems.map((item) => ({
      href: item.href,
      text: item.text,
      active: pathname === item.href,
      requiresAuth: item.requiresAuth || false,
      adminOnly: item.adminOnly || false,
    }));

    // Aggiungi link admin se l'utente è admin
    if (isAdmin) {
      baseItems.push({
        href: '/admin',
        text: 'Admin',
        active: pathname.startsWith('/admin'),
        requiresAuth: true,
        adminOnly: true,
      });
    }

    // Filtra i menu items in base all'autenticazione
    return baseItems.filter((item) => {
      // Se richiede autenticazione ma l'utente non è loggato
      if (item.requiresAuth && !isAuthenticated) {
        return false;
      }
      // Se è solo per admin ma l'utente non è admin
      if (item.adminOnly && !isAdmin) {
        return false;
      }
      return true;
    });
  };

  const menuItems = getFilteredMenuItems();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* <Image
              src={websiteConfig.logo_img}
              alt="Logo"
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="h-auto w-auto"
            />
            <span className="hidden font-semibold text-foreground sm:inline-block">
              {websiteConfig.title.split(' - ')[0]}
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  item.active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {item.text}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Login/Logout Button */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="hidden md:flex"
              >
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-0 right-0 top-full z-50 overflow-hidden border-t border-border/40 bg-background shadow-lg backdrop-blur-md dark:bg-background/90 md:hidden"
            >
              <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="container mx-auto flex flex-col space-y-2 px-4 py-4"
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      delay:
                        index * ANIMATION_DELAY_INCREMENT +
                        ANIMATION_BASE_DELAY,
                      duration: ANIMATION_DURATION,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        item.active
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.text}
                    </Link>
                  </motion.div>
                ))}

                {/* Login/Logout nel menu mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: menuItems.length * ANIMATION_DELAY_INCREMENT + ANIMATION_BASE_DELAY,
                    duration: ANIMATION_DURATION,
                  }}
                  className="border-t border-border/40 pt-2"
                >
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Login
                    </Link>
                  )}
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
