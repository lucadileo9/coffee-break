'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const currentTheme = resolvedTheme || theme;
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return null;
  }

  const currentTheme = resolvedTheme || theme;

  return (
    <div className="ease-&lsqb;cubic-bezier(0.34,_1.56,_0.64,_1)&rsqb; flex items-center space-x-2 transition-all duration-700">
      <Sun
        className={`ease-&lsqb;cubic-bezier(0.34,_1.56,_0.64,_1)&rsqb; h-4 w-4 transition-all duration-700 sm:h-5 sm:w-5 ${
          currentTheme === 'dark'
            ? 'rotate-12 scale-75 text-muted-foreground'
            : 'rotate-0 scale-100 text-foreground'
        }`}
      />
      <Switch
        checked={currentTheme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="ease-&lsqb;cubic-bezier(0.34,_1.56,_0.64,_1)&rsqb; scale-75 transition-all duration-700 hover:scale-110 sm:scale-100"
      />
      <Moon
        className={`ease-&lsqb;cubic-bezier(0.34,_1.56,_0.64,_1)&rsqb; h-4 w-4 transition-all duration-700 sm:h-5 sm:w-5 ${
          currentTheme === 'light'
            ? 'rotate-12 scale-75 text-muted-foreground'
            : 'rotate-0 scale-100 text-foreground'
        }`}
      />
    </div>
  );
}
