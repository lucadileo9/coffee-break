'use client';
import React, { useState } from 'react';

import ErrorMessage from '@/components/atoms/ErrorMessage';
import MyButton from '@/components/atoms/MyButton';
import SimpleTitle from '@/components/atoms/SimpleTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/contexts/AuthContext';

/**
 * LoginForm - Componente per form di login amministrativo
 * 
 * Features:
 * - Form di login con email/password
 * - Gestione errori
 * - Loading states
 * - Design responsive
 * - Accessibilità completa
 */
export default function LoginForm() {
  const { signIn, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestione input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Rimuovi errore quando user inizia a digitare
    if (error) setError(null);
  };

  // Gestione submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione basic
    if (!formData.email || !formData.password) {
      setError('Tutti i campi sono obbligatori');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Inserisci un indirizzo email valido');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: authError } = await signIn(formData.email, formData.password);
      
      if (authError) {
        // Messaggi di errore user-friendly
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email o password non corretti');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Email non confermata. Controlla la tua casella di posta');
        } else {
          setError(authError.message);
        }
      }
      // Se successo, AuthContext gestirà la navigazione
      
    } catch {
      setError('Si è verificato un errore imprevisto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Titolo della pagina */}
        <div className="text-center mb-8">
          <SimpleTitle level="h1" className="mb-2">
            Pannello Amministrativo
          </SimpleTitle>
          <p className="text-muted-foreground">
            Accedi per gestire guide e categorie
          </p>
        </div>

        {/* Form di login */}
        <Card>
          <CardHeader>
            <CardTitle>Accesso</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere al pannello di controllo
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder=""
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading || isSubmitting}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading || isSubmitting}
                  required
                  autoComplete="current-password"
                />
              </div>

              {/* Messaggio di errore */}
              {error && (
                <ErrorMessage
                  message={error}
                  variant="error"
                  showIcon={true}
                />
              )}

              {/* Button di submit */}
              <MyButton
                type="submit"
                icon="door-open"
                loading={isSubmitting || loading}
                loadingText="Accesso in corso..."
                disabled={!formData.email || !formData.password}
                className="w-full"
              >
                Accedi
              </MyButton>
            </form>
          </CardContent>
        </Card>

        {/* Info aggiuntive */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Solo gli amministratori autorizzati possono accedere a questa area
          </p>
        </div> */}
      </div>
    </div>
  );
}
