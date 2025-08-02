import { Metadata } from 'next';
import React from 'react';

import '../styles/globals.css';
import Header from '@/components/organisms/Header';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { websiteConfig } from '@/website.config';
import { ThemeProvider } from '@atoms/ThemeProvider';

export const metadata: Metadata = {
  title: websiteConfig.title,
  description: websiteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={websiteConfig.font_variables.join(' ')}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={['light', 'dark']}
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
